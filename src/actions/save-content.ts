"use server";

import { currentUser } from "@/lib/auth";
import { sanityClient } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";

export type SavedContent = {
  _key: string;
  slug: string;
  contentType: string;
  title: string;
  savedAt: string;
};

export async function getSavedContent(): Promise<SavedContent[]> {
  try {
    const user = await currentUser();
    if (!user?.id) return [];
    return (
      (await sanityClient.fetch<SavedContent[]>(
        `*[_type == "user" && _id == $id][0].savedContent[] | order(savedAt desc)`,
        { id: user.id },
      )) || []
    );
  } catch {
    return [];
  }
}

export async function isContentSaved(contentType: string, slug: string) {
  const saved = await getSavedContent();
  return saved.some(
    (item) => item.contentType === contentType && item.slug === slug,
  );
}

export async function toggleSaveContent(input: {
  contentType: string;
  slug: string;
  title: string;
}) {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return {
        status: "error" as const,
        message: "请先登录后收藏",
        login: true,
      };
    }

    const key = `${input.contentType}-${input.slug}`.replace(
      /[^a-zA-Z0-9_-]/g,
      "-",
    );
    const exists = await sanityClient.fetch<boolean>(
      `defined(*[_type == "user" && _id == $id && $key in savedContent[]._key][0])`,
      { id: user.id, key },
    );

    if (exists) {
      await sanityClient
        .patch(user.id)
        .unset([`savedContent[_key == "${key}"]`])
        .commit();
    } else {
      await sanityClient
        .patch(user.id)
        .setIfMissing({ savedContent: [] })
        .append("savedContent", [
          {
            _key: key,
            _type: "savedContent",
            slug: input.slug,
            contentType: input.contentType,
            title: input.title,
            savedAt: new Date().toISOString(),
          },
        ])
        .commit();
    }

    revalidatePath("/dashboard");
    revalidatePath(`/${input.contentType}/${input.slug}`);
    return {
      status: "success" as const,
      saved: !exists,
      message: exists ? "已取消收藏" : "已加入收藏",
    };
  } catch (error) {
    console.error("toggleSaveContent failed:", error);
    return { status: "error" as const, message: "操作失败，请稍后重试" };
  }
}
