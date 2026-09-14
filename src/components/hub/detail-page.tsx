import { isContentSaved } from "@/actions/save-content";
import { ContentActions } from "@/components/hub/content-actions";
import { HubIconView, RecipeRow } from "@/components/hub/hub-ui";
import ItemCustomMdx from "@/components/item/item-custom-mdx";
import type { HubItem } from "@/content/workbuddy";
import { getGuides, getRecipes } from "@/data/hub";
import {
  ArrowRight,
  Clock3,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const labels: Record<string, string> = {
  recipes: "配方库",
  guides: "深度指南",
  cases: "案例库",
  "use-cases": "场景中心",
  resources: "资源中心",
};

const sourceLabels = {
  official: "官方来源",
  community: "社区来源",
  editorial: "编辑整理",
};

type ContentSection = {
  title: string;
  body?: string;
  tone?: "default" | "success" | "warning";
};

function buildContentSections(item: HubItem, type: string): ContentSection[] {
  if (type === "cases") {
    const sections: ContentSection[] = [
      { title: "团队与场景", body: item.userBackground },
      { title: "原有工作方式", body: item.previousWorkflow },
      { title: "核心痛点", body: item.painPoints, tone: "warning" },
      { title: "WorkBuddy 的用法", body: item.solution },
      { title: "完整实践流程", body: item.process },
      { title: "公开实践结果", body: item.result, tone: "success" },
      { title: "复用与改进", body: item.improvements },
    ];
    return sections.filter((section) => section.body);
  }

  if (type === "recipes") {
    const sections: ContentSection[] = [
      { title: "完整实施步骤", body: item.steps },
      { title: "执行注意事项", body: item.notes, tone: "warning" },
      { title: "预期结果", body: item.exampleResult, tone: "success" },
    ];
    return sections.filter((section) => section.body);
  }

  if (type === "guides") {
    return [{ title: "核心内容", body: item.content }].filter(
      (section) => section.body,
    );
  }

  if (type === "use-cases") {
    return [
      { title: "最快上手方式", body: item.quickStart },
      { title: "进阶方法", body: item.advanced },
    ].filter((section) => section.body);
  }

  return [{ title: "资源导读", body: item.content }].filter(
    (section) => section.body,
  );
}

function panelTone(tone: ContentSection["tone"]) {
  if (tone === "success") return "border-emerald-200 bg-emerald-50/35";
  if (tone === "warning") return "border-amber-200 bg-amber-50/35";
  return "";
}

export async function HubDetailPage({
  item,
  type,
}: { item: HubItem; type: string }) {
  const isResource = type === "resources";
  const initialSaved = await isContentSaved(type, item.slug);
  const [recipeItems, guideItems] = await Promise.all([
    getRecipes(),
    getGuides(),
  ]);
  const contentSections = buildContentSections(item, type);
  const prompt = item.prompt || item.prompts?.join("\n\n---\n\n");
  const sourceLabel = item.sourceKind
    ? sourceLabels[item.sourceKind]
    : "编辑精选";
  const overview = [
    {
      icon: Target,
      title: "目标",
      text: item.goal || "理解方法并完成一个可检查的实际任务",
    },
    {
      icon: UsersRound,
      title: "适合谁",
      text: item.audience?.join("、") || "希望系统使用 WorkBuddy 的知识工作者",
    },
    {
      icon: Sparkles,
      title: "最终输出",
      text: item.outputs?.join("、") || "可复用、可核验的工作成果",
    },
  ];

  return (
    <div className="bg-slate-50/35">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-2 text-xs text-slate-400">
          <Link
            href={isResource ? "/discover" : `/${type}`}
            className="hover:text-emerald-600"
          >
            {labels[type]}
          </Link>
          <span>/</span>
          <span className="truncate text-slate-500">{item.title}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <main className="min-w-0 space-y-5">
            <section className="hub-panel relative overflow-hidden p-6 sm:p-8">
              <div className="absolute right-0 top-0 size-60 translate-x-1/3 -translate-y-1/3 rounded-full bg-emerald-100/60 blur-2xl" />
              <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      {item.category}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                      {item.difficulty}
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                      <ShieldCheck className="size-3" /> {sourceLabel}
                    </span>
                    {item.time ? (
                      <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                        <Clock3 className="size-3" /> {item.time}
                      </span>
                    ) : null}
                  </div>
                  <h1 className="mt-5 text-3xl font-black leading-tight tracking-[-0.045em] text-slate-950 sm:text-4xl">
                    {item.title}
                  </h1>
                  <p className="mt-4 max-w-2xl text-base leading-8 text-slate-500">
                    {item.description}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {item.feature.map((feature) => (
                      <span
                        key={feature}
                        className="rounded-lg border border-emerald-100 bg-emerald-50/50 px-2.5 py-1.5 text-xs font-medium text-emerald-700"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid size-36 shrink-0 place-items-center self-center overflow-hidden rounded-[32px] border border-white bg-gradient-to-br from-white to-emerald-50 text-emerald-500 shadow-[0_25px_60px_rgba(16,185,129,.15)]">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.imageAlt || `${item.title} 来源截图`}
                      width={288}
                      height={288}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <HubIconView name={item.icon} className="size-16" />
                  )}
                </div>
              </div>
              <div className="relative mt-7 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                <ContentActions
                  contentType={type}
                  slug={item.slug}
                  title={item.title}
                  initialSaved={initialSaved}
                />
              </div>
            </section>

            {item.imageUrl ? (
              <figure className="hub-panel overflow-hidden">
                <div className="relative h-[420px] sm:h-[620px]">
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt || `${item.title} 来源截图`}
                    fill
                    sizes="(min-width: 1024px) 900px, 100vw"
                    className="object-cover object-top"
                  />
                </div>
                <figcaption className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
                  来源截图 · {item.sourceName || sourceLabel}
                </figcaption>
              </figure>
            ) : null}

            <section className="hub-panel grid divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {overview.map(({ icon: Icon, title, text }) => (
                <div key={title} className="p-5">
                  <Icon className="size-5 text-emerald-600" />
                  <h2 className="mt-3 text-sm font-bold text-slate-900">
                    {title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {text}
                  </p>
                </div>
              ))}
            </section>

            {contentSections.map((section) => (
              <section
                key={section.title}
                className={`hub-panel p-6 sm:p-7 ${panelTone(section.tone)}`}
              >
                <h2 className="text-lg font-black text-slate-950">
                  {section.title}
                </h2>
                <div className="mt-5 text-sm leading-7 text-slate-600">
                  <ItemCustomMdx source={section.body || ""} />
                </div>
              </section>
            ))}

            {prompt ? (
              <section className="hub-panel p-6">
                <h2 className="text-lg font-black text-slate-950">
                  Prompt / 配置片段
                </h2>
                <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/35 p-4 text-sm leading-7 text-slate-700">
                  <ItemCustomMdx source={prompt} />
                </div>
              </section>
            ) : null}

            {item.verificationNote ? (
              <section className="rounded-2xl border border-sky-100 bg-sky-50/60 p-5">
                <div className="flex items-center gap-2 text-sm font-bold text-sky-800">
                  <ShieldCheck className="size-4" /> 编辑核验说明
                </div>
                <p className="mt-2 text-sm leading-6 text-sky-900/70">
                  {item.verificationNote}
                </p>
              </section>
            ) : null}

            <section className="pt-3">
              <h2 className="mb-4 text-lg font-black text-slate-950">
                相关配方与指南
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {recipeItems
                  .filter((recipe) => recipe.slug !== item.slug)
                  .slice(0, 2)
                  .map((recipe) => (
                    <RecipeRow key={recipe.slug} item={recipe} />
                  ))}
                {guideItems
                  .filter((guide) => guide.slug !== item.slug)
                  .slice(0, 2)
                  .map((guide) => (
                    <Link
                      key={guide.slug}
                      href={`/guides/${guide.slug}`}
                      className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-sm font-bold text-slate-800 hover:border-emerald-200"
                    >
                      {guide.title}
                      <ArrowRight className="size-4 text-slate-300 group-hover:text-emerald-600" />
                    </Link>
                  ))}
              </div>
            </section>
          </main>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="hub-panel p-5">
              <h2 className="text-sm font-black text-slate-900">内容概览</h2>
              <dl className="mt-4 space-y-4 text-xs">
                <div>
                  <dt className="text-slate-400">难度</dt>
                  <dd className="mt-1 font-semibold text-slate-700">
                    {item.difficulty}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">预计时间</dt>
                  <dd className="mt-1 font-semibold text-slate-700">
                    {item.time || "按原资源为准"}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">来源</dt>
                  <dd className="mt-1 font-semibold text-slate-700">
                    {item.sourceName || sourceLabel}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">最后核验</dt>
                  <dd className="mt-1 font-semibold text-slate-700">
                    {item.updatedAt?.slice(0, 10) || "待核验"}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">内容状态</dt>
                  <dd className="mt-1 font-semibold text-emerald-600">
                    {item.sourceUrl ? "✓ 来源已核验" : "编辑精选"}
                  </dd>
                </div>
              </dl>
              <Link
                href={item.sourceUrl || "/start"}
                target={item.sourceUrl ? "_blank" : undefined}
                rel={item.sourceUrl ? "noopener noreferrer" : undefined}
                className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
              >
                {item.sourceUrl ? "查看原始来源" : "开始实践"}
                {item.sourceUrl ? (
                  <ExternalLink className="size-4" />
                ) : (
                  <ArrowRight className="size-4" />
                )}
              </Link>
            </div>
            <div className="hub-panel p-5">
              <h2 className="text-sm font-black text-slate-900">本页内容</h2>
              <ol className="mt-4 space-y-3 border-l border-slate-200 pl-4 text-xs text-slate-500">
                <li className="font-semibold text-emerald-600">
                  1. 目标与适用人群
                </li>
                {contentSections.map((section, index) => (
                  <li key={section.title}>
                    {index + 2}. {section.title}
                  </li>
                ))}
                {prompt ? (
                  <li>{contentSections.length + 2}. Prompt 示例</li>
                ) : null}
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
