import { HubIconView, PageIntro } from "@/components/hub/hub-ui";
import { categoryDefinitions } from "@/content/workbuddy";
import { constructMetadata } from "@/lib/metadata";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "内容分类",
  description: "按工作目标浏览 WorkBuddy Hub 的教程、配方、案例和精选资源。",
});

export default function CategoryIndexPage() {
  return (
    <>
      <PageIntro
        eyebrow="Categories"
        title="按任务领域"
        accent="找到方法"
        description="不知道该搜什么时，从你正在处理的工作开始。每个分类都汇集可立即实践的方法与资源。"
      />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryDefinitions.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/50"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                <HubIconView name={category.icon} className="size-5" />
              </span>
              <h2 className="mt-5 text-lg font-black text-slate-900">
                {category.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {category.description}
              </p>
              <span className="mt-5 flex items-center gap-1 text-sm font-bold text-emerald-600">
                浏览内容
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
