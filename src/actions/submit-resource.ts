"use server";

import { currentUser } from "@/lib/auth";
import { type ResourceSubmitData, ResourceSubmitSchema } from "@/lib/schemas";
import { FreePlanStatus, PricePlans } from "@/lib/submission";
import { slugify } from "@/lib/utils";
import { sanityClient } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";

export type SubmitResourceResponse = {
  status: "success" | "error";
  message: string;
  id?: string;
};

export async function submitResource(
  input: ResourceSubmitData,
): Promise<SubmitResourceResponse> {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return { status: "error", message: "登录状态已失效，请重新登录后提交。" };
    }

    const data = ResourceSubmitSchema.parse(input);
    let slug = slugify(data.title) || `resource-${Date.now()}`;
    const duplicateLink = await sanityClient.fetch<{ _id: string } | null>(
      `*[_type == "item" && link == $url][0]{_id}`,
      { url: data.url },
    );
    if (duplicateLink) {
      return {
        status: "error",
        message: "该链接已在资源库或审核队列中，请勿重复提交。",
      };
    }

    const duplicateSlug = await sanityClient.fetch<{ _id: string } | null>(
      `*[_type == "item" && slug.current == $slug][0]{_id}`,
      { slug },
    );
    if (duplicateSlug) {
      slug = `${slug}-${Date.now().toString().slice(-6)}`;
    }

    const resource = await sanityClient.create({
      _type: "item",
      name: data.title,
      slug: { _type: "slug", current: slug },
      link: data.url,
      description: data.description,
      summary: data.description,
      introduction: data.description,
      resourceType: data.resourceType || "community-resource",
      difficulty: data.difficulty || "beginner",
      language: data.language || "chinese",
      creator: data.creator,
      score: data.qualityScore,
      seoDescription: data.seoDescription,
      suggestedFeatures: data.suggestedFeatures || [],
      suggestedUseCases: data.suggestedUseCases || [],
      suggestedTags: data.suggestedTags || [],
      publishDate: null,
      featured: false,
      forceHidden: false,
      outdated: false,
      paid: false,
      pricePlan: PricePlans.FREE,
      freePlanStatus: FreePlanStatus.PENDING,
      submitter: { _type: "reference", _ref: user.id },
    });

    revalidatePath("/dashboard");
    revalidatePath("/discover");
    return {
      status: "success",
      message: "资源已提交，编辑审核通过后会出现在资源中心。",
      id: resource._id,
    };
  } catch (error) {
    console.error("submitResource failed:", error);
    return {
      status: "error",
      message: "提交失败，请检查内容或稍后重试。",
    };
  }
}
