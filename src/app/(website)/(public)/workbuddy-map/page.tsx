import { HubIconView, PageIntro } from "@/components/hub/hub-ui";
import { features } from "@/content/workbuddy";
import { constructMetadata } from "@/lib/metadata";
import { ArrowRight, Check, X } from "lucide-react";
import Link from "next/link";

export const metadata = constructMetadata({ title: "WorkBuddy 功能地图" });
export default function WorkBuddyMapPage() {
  return (
    <>
      <PageIntro
        eyebrow="Feature map"
        title="先选对能力，"
        accent="再开始任务"
        description="一张图理解助手、项目、专家、技能、连接器、自动化与资料库的定位和组合方式。"
      />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <section
              id={feature.slug}
              key={feature.slug}
              className="hub-panel scroll-mt-28 p-6"
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                <HubIconView name={feature.icon} className="size-6" />
              </span>
              <h2 className="mt-5 text-xl font-black text-slate-950">
                {feature.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {feature.description}
              </p>
              <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
                <p className="flex items-start gap-2 text-xs leading-5 text-slate-600">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                  适合：需要{feature.description.replace("适合", "")}的工作
                </p>
                <p className="flex items-start gap-2 text-xs leading-5 text-slate-600">
                  <X className="mt-0.5 size-3.5 shrink-0 text-rose-400" />
                  不适合：目标不清或缺少必要上下文时直接使用
                </p>
              </div>
              <Link
                href="/guides"
                className="mt-6 flex items-center gap-1 text-xs font-bold text-emerald-600"
              >
                查看相关指南 <ArrowRight className="size-3.5" />
              </Link>
            </section>
          ))}
        </div>
        <section className="mt-14 rounded-3xl bg-slate-950 p-7 text-white md:p-10">
          <p className="hub-kicker">推荐组合</p>
          <h2 className="mt-3 text-2xl font-black">
            复杂任务不是选择一个功能，而是组合一条链路
          </h2>
          <div className="mt-8 grid gap-3 md:grid-cols-4">
            {[
              "项目承载上下文",
              "专家提供判断",
              "技能完成操作",
              "连接器 + 自动化交付",
            ].map((item, index) => (
              <div
                key={item}
                className="relative rounded-xl border border-white/10 bg-white/5 p-4 text-sm font-semibold text-slate-200"
              >
                <span className="mb-3 grid size-6 place-items-center rounded-full bg-emerald-500 text-[10px] font-bold">
                  {index + 1}
                </span>
                {item}
                {index < 3 ? (
                  <ArrowRight className="absolute -right-2.5 top-1/2 hidden size-5 -translate-y-1/2 text-emerald-400 md:block" />
                ) : null}
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
