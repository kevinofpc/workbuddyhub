import { isContentSaved } from "@/actions/save-content";
import { ContentActions } from "@/components/hub/content-actions";
import { HubIconView, RecipeRow } from "@/components/hub/hub-ui";
import ItemCustomMdx from "@/components/item/item-custom-mdx";
import { CopyButton } from "@/components/shared/copy-button";
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

const caseTypeLabels = {
  real: "真实实践",
  tutorial: "教学实操",
  story: "公开应用故事",
};

const dataNatureLabels = {
  real: "真实数据",
  anonymized: "脱敏数据",
  synthetic: "模拟数据",
  "not-applicable": "不涉及数据集",
};

const verificationLabels = {
  imported: "来源已导入",
  edited: "Hub 已编辑",
  verified: "Hub 已复现",
  community_verified: "社区已复现",
  outdated: "可能已过期",
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
      {
        title: "完成标准",
        body: item.acceptance,
        tone: "success",
      },
      { title: "公开实践结果", body: item.result, tone: "success" },
      { title: "安全与边界", body: item.safety, tone: "warning" },
      { title: "已知限制", body: item.limitations, tone: "warning" },
      { title: "复用与改进", body: item.improvements },
    ];
    return sections.filter((section) => section.body);
  }

  if (type === "recipes") {
    const sections: ContentSection[] = [
      { title: "完整实施步骤", body: item.steps },
      { title: "执行注意事项", body: item.notes, tone: "warning" },
      { title: "预期结果", body: item.exampleResult, tone: "success" },
      { title: "完成标准", body: item.acceptance, tone: "success" },
      { title: "安全提示", body: item.safety, tone: "warning" },
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
  const relatedRecipeItems = item.relatedRecipes?.length
    ? item.relatedRecipes
        .map((relation) =>
          recipeItems.find((candidate) => candidate.slug === relation.slug),
        )
        .filter((candidate): candidate is HubItem => Boolean(candidate))
    : type === "cases"
      ? []
      : recipeItems
          .filter((candidate) =>
            candidate.feature.some((feature) => item.feature.includes(feature)),
          )
          .slice(0, 2);
  const relatedGuideItems = item.relatedGuides?.length
    ? item.relatedGuides
        .map((relation) =>
          guideItems.find((candidate) => candidate.slug === relation.slug),
        )
        .filter((candidate): candidate is HubItem => Boolean(candidate))
    : type === "cases"
      ? []
      : guideItems
          .filter((candidate) =>
            candidate.feature.some((feature) => item.feature.includes(feature)),
          )
          .slice(0, 2);
  const practiceHref = relatedRecipeItems[0]
    ? `/recipes/${relatedRecipeItems[0].slug}`
    : item.relatedUseCases?.[0]
      ? `/use-cases/${item.relatedUseCases[0].slug}`
      : "/start";
  const verificationLabel = item.verificationStatus
    ? verificationLabels[item.verificationStatus]
    : item.verificationNote
      ? "编辑已核对"
      : "待核对";
  const overview = [
    {
      icon: Target,
      title: type === "cases" ? "这次要解决" : "目标",
      text:
        item.goal ||
        (type === "cases" ? item.description : undefined) ||
        "理解方法并完成一个可检查的实际任务",
    },
    {
      icon: UsersRound,
      title: "适合谁",
      text:
        item.audience?.join("、") ||
        (type === "cases" ? item.userBackground : undefined) ||
        "希望系统使用 WorkBuddy 的知识工作者",
    },
    {
      icon: Sparkles,
      title: "最终输出",
      text:
        item.outputs?.join("、") ||
        item.deliverables?.join("、") ||
        "可复用、可核验的工作成果",
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
                    {type === "cases" && item.caseType ? (
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                        {caseTypeLabels[item.caseType]}
                      </span>
                    ) : null}
                    {type === "cases" && item.dataNature ? (
                      <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                        {dataNatureLabels[item.dataNature]}
                      </span>
                    ) : null}
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

            {type === "cases" &&
            (item.prerequisites?.length || item.deliverables?.length) ? (
              <section
                id="practice-kit"
                className="hub-panel grid gap-0 overflow-hidden sm:grid-cols-2 sm:divide-x sm:divide-slate-100"
              >
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">
                    Before you start
                  </p>
                  <h2 className="mt-2 text-lg font-black text-slate-950">
                    开始前准备
                  </h2>
                  <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
                    {(item.prerequisites || []).map((value) => (
                      <li key={value} className="flex gap-2">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                        {value}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t border-slate-100 p-6 sm:border-t-0">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-600">
                    What you will get
                  </p>
                  <h2 className="mt-2 text-lg font-black text-slate-950">
                    最终交付物
                  </h2>
                  <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
                    {(item.deliverables || []).map((value) => (
                      <li key={value} className="flex gap-2">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-sky-500" />
                        {value}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            ) : null}

            {contentSections.map((section, index) => (
              <section
                key={section.title}
                id={`section-${index + 1}`}
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
              <section id="prompt" className="hub-panel p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">
                      Ready to use
                    </p>
                    <h2 className="mt-1 text-lg font-black text-slate-950">
                      可直接使用的 Prompt
                    </h2>
                  </div>
                  <CopyButton
                    value={prompt}
                    className="size-9 border-emerald-200 bg-emerald-500 text-white hover:bg-emerald-600 hover:text-white"
                  />
                </div>
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

            {relatedRecipeItems.length || relatedGuideItems.length ? (
              <section id="related" className="pt-3">
                <h2 className="mb-4 text-lg font-black text-slate-950">
                  相关配方与指南
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {relatedRecipeItems.map((recipe) => (
                    <RecipeRow key={recipe.slug} item={recipe} />
                  ))}
                  {relatedGuideItems.map((guide) => (
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
            ) : null}
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
                {item.sourceLicense ? (
                  <div>
                    <dt className="text-slate-400">来源许可</dt>
                    <dd className="mt-1 font-semibold text-slate-700">
                      {item.sourceLicense}
                    </dd>
                  </div>
                ) : null}
                <div>
                  <dt className="text-slate-400">最后核验</dt>
                  <dd className="mt-1 font-semibold text-slate-700">
                    {item.verifiedAt?.slice(0, 10) || "尚未独立复现"}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">内容状态</dt>
                  <dd className="mt-1 font-semibold text-emerald-600">
                    {verificationLabel}
                  </dd>
                </div>
              </dl>
              <Link
                href={isResource ? item.sourceUrl || "/start" : practiceHref}
                target={isResource && item.sourceUrl ? "_blank" : undefined}
                rel={
                  isResource && item.sourceUrl
                    ? "noopener noreferrer"
                    : undefined
                }
                className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
              >
                {isResource ? "访问原始资源" : "按这篇内容开始实践"}
                {isResource && item.sourceUrl ? (
                  <ExternalLink className="size-4" />
                ) : (
                  <ArrowRight className="size-4" />
                )}
              </Link>
              {!isResource && item.sourceUrl ? (
                <Link
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 transition hover:text-slate-700"
                >
                  查看参考来源 <ExternalLink className="size-3" />
                </Link>
              ) : null}
            </div>
            <div className="hub-panel p-5">
              <h2 className="text-sm font-black text-slate-900">本页内容</h2>
              <ol className="mt-4 space-y-3 border-l border-slate-200 pl-4 text-xs text-slate-500">
                <li className="font-semibold text-emerald-600">
                  1. 目标与适用人群
                </li>
                {contentSections.map((section, index) => (
                  <li key={section.title}>
                    <a
                      href={`#section-${index + 1}`}
                      className="hover:text-emerald-600"
                    >
                      {index + 2}. {section.title}
                    </a>
                  </li>
                ))}
                {prompt ? (
                  <li>
                    <a href="#prompt" className="hover:text-emerald-600">
                      {contentSections.length + 2}. Prompt 示例
                    </a>
                  </li>
                ) : null}
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
