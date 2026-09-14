"use client";

import { toggleSaveContent } from "@/actions/save-content";
import { Bookmark, Check, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function ContentActions({
  contentType,
  slug,
  title,
  initialSaved,
}: {
  contentType: string;
  slug: string;
  title: string;
  initialSaved: boolean;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      const result = await toggleSaveContent({ contentType, slug, title });
      if (result.status === "error") {
        if ("login" in result && result.login) {
          router.push(`/auth/login?callbackUrl=/${contentType}/${slug}`);
        }
        toast.error(result.message);
        return;
      }
      setSaved(result.saved);
      toast.success(result.message);
    });
  }

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => undefined);
      return;
    }
    await navigator.clipboard.writeText(url);
    toast.success("链接已复制");
  }

  return (
    <>
      <button
        type="button"
        disabled={pending}
        onClick={handleSave}
        className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
      >
        {saved ? (
          <Check className="size-4 text-emerald-600" />
        ) : (
          <Bookmark className="size-4" />
        )}
        {pending ? "保存中" : saved ? "已收藏" : "收藏"}
      </button>
      <button
        type="button"
        onClick={handleShare}
        className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
      >
        <Share2 className="size-4" /> 分享
      </button>
    </>
  );
}
