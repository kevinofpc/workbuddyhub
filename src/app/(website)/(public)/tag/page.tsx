import { PageIntro } from "@/components/hub/hub-ui";
import { tagDefinitions } from "@/content/workbuddy";
import { constructMetadata } from "@/lib/metadata";
import { Hash } from "lucide-react";
import Link from "next/link";

export const metadata = constructMetadata({ title: "热门标签" });

export default function TagIndexPage() {
  return (
    <>
      <PageIntro
        eyebrow="Tags"
        title="用标签连接"
        accent="相关知识"
        description="从一个概念出发，横向发现不同类型的教程、案例与实践配方。"
      />
      <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-3">
          {tagDefinitions.map((tag, index) => (
            <Link
              key={tag.slug}
              href={`/tag/${tag.slug}`}
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:text-emerald-700"
            >
              <Hash className="size-4 text-emerald-500" />
              {tag.title}
              <span className="text-xs font-normal text-slate-300">
                {24 - index}
              </span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
