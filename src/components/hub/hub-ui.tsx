import type { HubIcon, HubItem } from "@/content/workbuddy";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Braces,
  Clock3,
  Database,
  FileText,
  Folder,
  Link2,
  Mail,
  PenTool,
  Presentation,
  Search,
  Sheet,
  Sparkles,
  Star,
  UserRound,
  Video,
} from "lucide-react";
import Link from "next/link";

const iconMap = {
  bot: Bot,
  folder: Folder,
  user: UserRound,
  wand: Sparkles,
  link: Link2,
  timer: Clock3,
  database: Database,
  presentation: Presentation,
  sheet: Sheet,
  search: Search,
  file: FileText,
  pen: PenTool,
  video: Video,
  code: Braces,
  mail: Mail,
  chart: BarChart3,
};

export function HubIconView({
  name,
  className,
}: {
  name: HubIcon;
  className?: string;
}) {
  const Icon = iconMap[name];
  return <Icon className={className} aria-hidden="true" />;
}

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative grid size-9 place-items-center overflow-hidden rounded-[11px] bg-emerald-500 text-white shadow-[0_7px_20px_rgba(16,185,129,.25)]",
        className,
      )}
      aria-hidden="true"
    >
      <span className="absolute -left-2 -top-2 size-6 rounded-full border border-white/40" />
      <span className="text-sm font-black tracking-[-0.12em]">WB</span>
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-6">
      <div>
        {eyebrow ? (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-2xl font-black tracking-[-0.035em] text-slate-950 md:text-[28px]">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        ) : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="group hidden shrink-0 items-center gap-1 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700 sm:flex"
        >
          查看全部
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </div>
  );
}

export function ContentCard({
  item,
  href,
  className,
}: {
  item: HubItem;
  href: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex min-h-48 flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,.035)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_18px_40px_rgba(16,185,129,.10)]",
        className,
      )}
    >
      <div className="mb-5 flex items-start justify-between">
        <span className="grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600 transition-transform duration-300 group-hover:rotate-[-3deg] group-hover:scale-105">
          <HubIconView name={item.icon} className="size-5" />
        </span>
        <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500">
          {item.difficulty}
        </span>
      </div>
      {item.caseType ? (
        <div className="mb-3 flex flex-wrap gap-1.5 text-[10px] font-bold">
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">
            {
              {
                real: "真实实践",
                tutorial: "教学实操",
                story: "应用故事",
              }[item.caseType]
            }
          </span>
          {item.dataNature === "synthetic" ? (
            <span className="rounded-full bg-violet-50 px-2.5 py-1 text-violet-700">
              模拟数据
            </span>
          ) : null}
          <span className="rounded-full bg-sky-50 px-2.5 py-1 text-sky-700">
            {item.verificationStatus === "verified"
              ? "Hub 已复现"
              : item.verificationStatus === "community_verified"
                ? "社区已复现"
                : "Hub 已编辑"}
          </span>
        </div>
      ) : null}
      <h3 className="text-[17px] font-bold leading-snug text-slate-900">
        {item.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
        {item.description}
      </p>
      <div className="mt-auto flex items-end justify-between gap-3 pt-5 text-xs text-slate-400">
        <span>{item.category}</span>
        <span className="flex items-center gap-1 font-semibold text-emerald-600 opacity-0 transition-opacity group-hover:opacity-100">
          查看 <ArrowRight className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}

export function RecipeRow({ item }: { item: HubItem }) {
  return (
    <Link
      href={`/recipes/${item.slug}`}
      className="group flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white p-4 transition-all hover:border-emerald-200 hover:shadow-[0_10px_30px_rgba(16,185,129,.08)]"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
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
      {item.views ? (
        <span className="hidden items-center gap-1 text-xs text-slate-400 md:flex">
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
          {item.views}
        </span>
      ) : null}
      <ArrowRight className="size-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-600" />
    </Link>
  );
}

export function PageIntro({
  eyebrow,
  title,
  accent,
  description,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description: string;
}) {
  return (
    <div className="relative overflow-hidden border-b border-slate-100 bg-[radial-gradient(circle_at_70%_0%,rgba(167,243,208,.32),transparent_32%)]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-[-0.045em] text-slate-950 md:text-6xl">
          {title}{" "}
          {accent ? <span className="text-emerald-500">{accent}</span> : null}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-500 md:text-lg">
          {description}
        </p>
      </div>
    </div>
  );
}

export function ListingGrid({
  items,
  prefix,
}: {
  items: HubItem[];
  prefix: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ContentCard
          key={item.slug}
          item={item}
          href={`/${prefix}/${item.slug}`}
        />
      ))}
    </div>
  );
}
