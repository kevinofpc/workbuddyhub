import { HubNewsletterForm } from "@/components/hub/hub-newsletter-form";
import { HubSearch } from "@/components/hub/hub-search";
import {
  HubIconView,
  RecipeRow,
  SectionHeading,
} from "@/components/hub/hub-ui";
import { collectionDefinitions, features, goals } from "@/content/workbuddy";
import { getCases, getRecipes, getResources } from "@/data/hub";
import { constructMetadata } from "@/lib/metadata";
import {
  ArrowRight,
  BookOpen,
  Check,
  Mail,
  Rocket,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "学会真正用好 WorkBuddy",
  description: "教程、实战配方、真实案例与最佳实践，帮助你快速掌握 WorkBuddy。",
});

export default async function HomePage() {
  const [recipes, cases, resources] = await Promise.all([
    getRecipes(),
    getCases(),
    getResources(),
  ]);
  return (
    <div className="overflow-hidden">
      <section className="relative border-b border-slate-100 bg-[radial-gradient(circle_at_78%_22%,rgba(167,243,208,.42),transparent_25%),radial-gradient(circle_at_87%_70%,rgba(219,234,254,.45),transparent_22%)]">
        <div className="mx-auto grid min-h-[520px] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:py-20">
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1.5 text-xs font-bold text-emerald-700">
              <Sparkles className="size-3.5" />
              WorkBuddy 学习与最佳实践中心
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.08] tracking-[-0.055em] text-slate-950 sm:text-5xl md:text-[62px]">
              学会真正用好 <span className="text-emerald-500">WorkBuddy</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-500 md:text-lg">
              教程、实战配方、真实案例与最佳实践。把“它能做什么”变成“我现在就会做”。
            </p>
            <div className="mt-8 max-w-2xl">
              <HubSearch />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="mr-1">热门搜索：</span>
              {["PPT", "竞品分析", "自动周报", "公众号", "Excel"].map(
                (label) => (
                  <Link
                    key={label}
                    href={`/discover?q=${encodeURIComponent(label)}`}
                    className="rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-slate-500 transition hover:border-emerald-200 hover:text-emerald-600"
                  >
                    {label}
                  </Link>
                ),
              )}
            </div>
          </div>

          <div
            className="relative hidden min-h-[380px] lg:block"
            aria-hidden="true"
          >
            <div className="absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-200/70" />
            <div className="absolute left-1/2 top-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-emerald-200/70 [animation:spin_28s_linear_infinite]" />
            <div className="absolute left-1/2 top-1/2 flex h-56 w-44 -translate-x-1/2 -translate-y-1/2 rotate-[-4deg] flex-col rounded-[34px] border border-white bg-white/90 p-5 shadow-[0_35px_90px_rgba(15,118,110,.2)] backdrop-blur">
              <div className="flex gap-1.5">
                <span className="size-2 rounded-full bg-rose-300" />
                <span className="size-2 rounded-full bg-amber-300" />
                <span className="size-2 rounded-full bg-emerald-400" />
              </div>
              <div className="my-auto grid place-items-center">
                <span className="grid size-16 place-items-center rounded-2xl bg-emerald-500 text-2xl font-black text-white shadow-lg shadow-emerald-200">
                  WB
                </span>
                <strong className="mt-4 text-lg tracking-tight">
                  WorkBuddy
                </strong>
              </div>
              <div className="space-y-2">
                <span className="block h-2 rounded-full bg-slate-100" />
                <span className="block h-2 w-2/3 rounded-full bg-emerald-100" />
              </div>
            </div>
            {[
              ["更高效的知识协作", "bot", "right-0 top-8"],
              ["更聪明的能力组合", "link", "right-[-18px] top-[145px]"],
              ["更可靠的自动化流程", "timer", "right-6 bottom-10"],
            ].map(([label, icon, position]) => (
              <div
                key={label}
                className={`absolute ${position} flex w-56 items-center gap-3 rounded-2xl border border-white bg-white/85 p-3.5 text-sm font-bold text-slate-700 shadow-[0_14px_36px_rgba(15,23,42,.09)] backdrop-blur`}
              >
                <span className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                  <HubIconView name={icon as "bot"} className="size-4" />
                </span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-20 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <section className="grid gap-5 lg:grid-cols-[.72fr_1.7fr]">
          <Link
            href="/start"
            className="group relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-[0_16px_45px_rgba(16,185,129,.08)]"
          >
            <Rocket className="size-6 text-emerald-600" />
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">
              Start Here · 新手起步
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
              10 分钟了解 WorkBuddy
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              从核心概念到第一次上手实践，开启你的高效之旅。
            </p>
            <span className="mt-6 flex items-center gap-1 text-sm font-bold text-emerald-600">
              开始学习{" "}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
          <div className="hub-panel p-6">
            <p className="hub-kicker">Browse by goal</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
              你想用 WorkBuddy 做什么？
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {goals.map((goal) => (
                <Link
                  key={goal.slug}
                  href={`/use-cases/${goal.slug}`}
                  className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 transition hover:border-emerald-200 hover:bg-emerald-50/40"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-50 text-slate-600 group-hover:bg-white group-hover:text-emerald-600">
                    <HubIconView name={goal.icon} className="size-4.5" />
                  </span>
                  <span className="min-w-0">
                    <strong className="block text-sm text-slate-800">
                      {goal.title}
                    </strong>
                    <span className="mt-0.5 block truncate text-[11px] text-slate-400">
                      {goal.description}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="Learn by feature"
            title="按功能建立完整认知"
            description="先分清每个模块适合解决什么问题，再组合出可靠的工作方式。"
            href="/workbuddy-map"
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {features.map((feature) => (
              <Link
                key={feature.slug}
                href={`/workbuddy-map#${feature.slug}`}
                className="group rounded-2xl border border-slate-200/80 bg-white p-4 text-center transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/50"
              >
                <span className="mx-auto grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                  <HubIconView name={feature.icon} className="size-5" />
                </span>
                <strong className="mt-3 block text-sm text-slate-800">
                  {feature.title}
                </strong>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="Popular recipes"
            title="大家正在实践的热门配方"
            description="每个配方都给出目标、准备项、完整步骤、Prompt 与常见错误。"
            href="/recipes"
          />
          <div className="grid gap-3 lg:grid-cols-2">
            {recipes.slice(0, 6).map((recipe) => (
              <RecipeRow key={recipe.slug} item={recipe} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="Real-world cases"
            title="真实工作里，他们这样使用"
            description="不讲抽象功能，只看原来的痛点、完整流程和最终效果。"
            href="/cases"
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cases.map((item, index) => (
              <Link
                key={item.slug}
                href={`/cases/${item.slug}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60"
              >
                <div
                  className={`relative h-32 overflow-hidden ${["bg-amber-50", "bg-emerald-50", "bg-blue-50", "bg-violet-50"][index]}`}
                >
                  <div className="absolute -right-7 -top-8 size-28 rounded-full border-[20px] border-white/50" />
                  <HubIconView
                    name={item.icon}
                    className="absolute bottom-5 left-5 size-9 text-slate-700/80"
                  />
                </div>
                <div className="p-5">
                  <span className="text-[11px] font-bold text-emerald-600">
                    {item.category}
                  </span>
                  <h3 className="mt-2 font-bold leading-snug text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>
                  <p className="mt-4 text-xs font-semibold text-emerald-600">
                    公开来源 · 编辑评分 {item.score || "—"}/100
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="Curated resources"
            title="编辑精选资源"
            description="从官方文档、课程、视频与社区内容中筛出的高质量学习材料。"
            href="/discover"
          />
          <div className="hub-panel divide-y divide-slate-100 overflow-hidden">
            {resources.slice(0, 4).map((item) => (
              <Link
                key={item.slug}
                href={`/resources/${item.slug}`}
                className="group flex items-center gap-4 p-4 transition hover:bg-slate-50/80 sm:p-5"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                  <HubIconView name={item.icon} className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 truncate text-xs text-slate-500">
                    {item.description}
                  </p>
                </div>
                <span className="hidden rounded-full border border-slate-200 px-2.5 py-1 text-[11px] text-slate-500 sm:block">
                  {item.category}
                </span>
                <ArrowRight className="size-4 text-slate-300 group-hover:text-emerald-600" />
              </Link>
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="Collections"
            title="围绕一个目标，系统学习"
            description="编辑把相关配方、指南、案例和资源编排成一条连续路径。"
            href="/collection"
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {collectionDefinitions.map((collection, index) => (
              <Link
                key={collection.slug}
                href={`/collection/${collection.slug}`}
                className="group relative min-h-52 overflow-hidden rounded-2xl bg-slate-950 p-5 text-white shadow-lg"
              >
                <div
                  className={`absolute inset-0 opacity-40 ${
                    [
                      "bg-[radial-gradient(circle_at_80%_15%,#10b981,transparent_38%)]",
                      "bg-[radial-gradient(circle_at_80%_15%,#3b82f6,transparent_38%)]",
                      "bg-[radial-gradient(circle_at_80%_15%,#a855f7,transparent_38%)]",
                      "bg-[radial-gradient(circle_at_80%_15%,#f59e0b,transparent_38%)]",
                    ][index]
                  }`}
                />
                <div className="relative flex h-full flex-col">
                  <span className="grid size-10 place-items-center rounded-xl bg-white/10 text-emerald-300">
                    <HubIconView name={collection.icon} className="size-4.5" />
                  </span>
                  <h3 className="mt-8 text-lg font-black leading-snug">
                    {collection.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">
                    {collection.description}
                  </p>
                  <ArrowRight className="mt-auto size-4 pt-4 box-content text-emerald-300 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section
          id="newsletter"
          className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-10 text-white sm:px-10 md:flex md:items-center md:justify-between md:gap-12"
        >
          <div className="absolute right-0 top-0 size-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="relative max-w-xl">
            <Mail className="size-7 text-emerald-400" />
            <h2 className="mt-4 text-2xl font-black tracking-tight md:text-3xl">
              每周获得最新教程、配方和案例
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              订阅 WorkBuddy Weekly。只发送经过筛选、真正能用的内容。
            </p>
          </div>
          <HubNewsletterForm />
        </section>

        <section className="flex flex-col items-center justify-between gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-7 text-center sm:flex-row sm:text-left">
          <div className="flex items-start gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-emerald-600 shadow-sm">
              <BookOpen className="size-5" />
            </span>
            <div>
              <h2 className="font-bold text-slate-900">
                发现了值得分享的教程或案例？
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                提交链接，帮助更多人真正用好 WorkBuddy。
              </p>
            </div>
          </div>
          <Link
            href="/submit"
            className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:border-emerald-300 hover:text-emerald-700"
          >
            提交资源 <Check className="size-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
