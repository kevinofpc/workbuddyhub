import { HubSearch } from "@/components/hub/hub-search";
import { HubIconView } from "@/components/hub/hub-ui";
import { getResources } from "@/data/hub";
import { constructMetadata } from "@/lib/metadata";
import { Bookmark, Eye, SlidersHorizontal, Star, X } from "lucide-react";
import Link from "next/link";

export const metadata = constructMetadata({ title: "精选资源" });

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams?: {
    q?: string;
    type?: string;
    difficulty?: string;
    language?: string;
  };
}) {
  const resources = await getResources();
  const query = (searchParams?.q || "").toLowerCase();
  const selectedType = searchParams?.type || "";
  const selectedDifficulty = searchParams?.difficulty || "";
  const selectedLanguage = searchParams?.language || "";
  const filtered = resources.filter((item) => {
    const matchesQuery = query
      ? [item.title, item.description, item.category, ...item.feature]
          .join(" ")
          .toLowerCase()
          .includes(query)
      : true;
    const matchesType = selectedType
      ? item.category.includes(selectedType)
      : true;
    const matchesDifficulty = selectedDifficulty
      ? item.difficulty === selectedDifficulty
      : true;
    const matchesLanguage = selectedLanguage
      ? (item.language || "中文") === selectedLanguage
      : true;
    return matchesQuery && matchesType && matchesDifficulty && matchesLanguage;
  });

  function filterHref(key: "type" | "difficulty" | "language", value?: string) {
    const params = new URLSearchParams();
    if (searchParams?.q) params.set("q", searchParams.q);
    if (selectedType) params.set("type", selectedType);
    if (selectedDifficulty) params.set("difficulty", selectedDifficulty);
    if (selectedLanguage) params.set("language", selectedLanguage);
    if (value) params.set(key, value);
    else params.delete(key);
    const suffix = params.toString();
    return suffix ? `/discover?${suffix}` : "/discover";
  }
  const tags = [
    "自动化",
    "数据处理",
    "连接器",
    "新手入门",
    "工作流",
    "API",
    "表格",
    "模板",
    "AI 集成",
  ];

  return (
    <main className="bg-slate-50/35">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[210px_minmax(0,1fr)_210px] lg:px-8">
        <aside className="hidden lg:block">
          <div className="hub-panel sticky top-24 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
              <h2 className="flex items-center gap-2 text-sm font-black">
                <SlidersHorizontal className="size-4 text-emerald-600" />
                筛选资源
              </h2>
              <Link
                href={
                  query
                    ? `/discover?q=${encodeURIComponent(query)}`
                    : "/discover"
                }
                className="text-[11px] text-emerald-600"
              >
                重置
              </Link>
            </div>
            {[
              ["类型", "type", ["视频", "文档", "课程", "文章"]],
              ["难度", "difficulty", ["入门", "初级", "中级", "高级"]],
              ["语言", "language", ["中文", "英文", "双语"]],
            ].map(([title, key, options]) => {
              const filterKey = key as "type" | "difficulty" | "language";
              const selected = {
                type: selectedType,
                difficulty: selectedDifficulty,
                language: selectedLanguage,
              }[filterKey];
              return (
                <div
                  key={title as string}
                  className="border-b border-slate-100 p-4 last:border-0"
                >
                  <h3 className="mb-3 text-xs font-bold text-slate-700">
                    {title as string}
                  </h3>
                  <div className="space-y-2.5">
                    {["", ...(options as string[])].map((option) => (
                      <Link
                        key={option}
                        href={filterHref(filterKey, option || undefined)}
                        className={`flex items-center gap-2 text-xs ${selected === option ? "font-bold text-emerald-700" : "text-slate-500 hover:text-slate-800"}`}
                      >
                        <span
                          className={`size-3.5 rounded-full border ${selected === option ? "border-emerald-500 bg-emerald-500 shadow-[inset_0_0_0_3px_white]" : "border-slate-300"}`}
                        />
                        {option || `全部${title}`}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
        <div className="min-w-0">
          <p className="hub-kicker">Discover</p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.045em] text-slate-950">
            精选资源
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            发现高质量的 WorkBuddy 教程、视频、文章与课程。
          </p>
          <div className="mt-6">
            <HubSearch compact initialValue={searchParams?.q || ""} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              ["type", `类型：${selectedType || "全部"}`],
              ["difficulty", `难度：${selectedDifficulty || "全部"}`],
              ["language", `语言：${selectedLanguage || "全部"}`],
            ].map(([key, label]) => (
              <Link
                key={key}
                href={filterHref(key as "type" | "difficulty" | "language")}
                className="flex items-center gap-1 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-700"
              >
                {label}
                {label.endsWith("全部") ? null : <X className="size-3" />}
              </Link>
            ))}
          </div>
          <section className="mt-7 rounded-2xl border border-amber-200 bg-amber-50/35 p-4">
            <div className="flex items-center gap-2 text-sm font-black text-slate-900">
              <Star className="size-4 fill-amber-400 text-amber-400" />
              编辑精选
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {resources.slice(0, 2).map((item) => (
                <Link
                  href={`/resources/${item.slug}`}
                  key={item.slug}
                  className="rounded-xl border border-amber-100 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                      <HubIconView name={item.icon} className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-[11px] text-slate-400">
                    <span className="text-amber-600">
                      编辑评分 {item.score || "—"}/100
                    </span>
                    {item.views ? (
                      <span>
                        <Eye className="mr-1 inline size-3" />
                        {item.views}
                      </span>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          </section>
          <div className="mt-8 flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-950">
              {query ? `“${searchParams?.q}” 的结果` : "全部资源"}{" "}
              <span className="ml-1 text-xs font-normal text-slate-400">
                共 {filtered.length} 条
              </span>
            </h2>
            <button
              type="button"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500"
            >
              排序：最新发布
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {filtered.length ? (
              filtered.map((item) => (
                <Link
                  key={item.slug}
                  href={`/resources/${item.slug}`}
                  className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-emerald-200 hover:shadow-[0_12px_30px_rgba(16,185,129,.07)]"
                >
                  <span className="grid size-20 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-50 to-slate-50 text-emerald-600 sm:size-24">
                    <HubIconView name={item.icon} className="size-8" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex gap-2">
                      <span className="rounded bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                        {item.category}
                      </span>
                      <span className="rounded bg-slate-100 px-2 py-1 text-[10px] text-slate-500">
                        {item.difficulty}
                      </span>
                    </div>
                    <h3 className="mt-3 text-base font-black text-slate-900 group-hover:text-emerald-700">
                      {item.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                      {item.description}
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-[11px] text-slate-400">
                      <span className="text-amber-600">
                        编辑评分 {item.score || "—"}/100
                      </span>
                      {item.views ? (
                        <span>
                          <Eye className="mr-1 inline size-3" />
                          {item.views}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <Bookmark className="size-4 shrink-0 text-slate-300" />
                </Link>
              ))
            ) : (
              <div className="hub-panel py-16 text-center">
                <p className="text-lg font-bold text-slate-800">
                  暂时没有匹配资源
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  换一个任务词试试，例如“自动化”或“入门”。
                </p>
              </div>
            )}
          </div>
        </div>
        <aside className="hidden lg:block">
          <div className="space-y-5 sticky top-24">
            <div className="hub-panel p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-slate-900">热门标签</h2>
                <span className="text-[11px] text-emerald-600">查看全部</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Link
                    key={tag}
                    href={`/discover?q=${encodeURIComponent(tag)}`}
                    className="rounded-lg bg-slate-50 px-2.5 py-2 text-[11px] text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    {tag}{" "}
                    <span className="ml-1 text-slate-300">
                      {128 - index * 9}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="hub-panel p-4">
              <h2 className="text-sm font-black text-slate-900">推荐合集</h2>
              <div className="mt-4 space-y-2">
                {[
                  "新手必看合集",
                  "自动化实战合集",
                  "连接器配置合集",
                  "内容创作合集",
                ].map((title, index) => (
                  <Link
                    key={title}
                    href="/collection"
                    className="flex items-center gap-3 rounded-lg border border-slate-100 p-3 text-xs font-semibold text-slate-700 hover:border-emerald-200"
                  >
                    <span className="grid size-7 place-items-center rounded-lg bg-emerald-50 text-[10px] font-black text-emerald-600">
                      {index + 1}
                    </span>
                    {title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
