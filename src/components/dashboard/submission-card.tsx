import { Card } from "@/components/ui/card";
import { FreePlanStatus } from "@/lib/submission";
import { getLocaleDate } from "@/lib/utils";
import type { ItemInfo } from "@/types";
import { ArrowUpRight, Clock3, FileCheck2 } from "lucide-react";
import Link from "next/link";

const statusLabels: Record<string, { label: string; classes: string }> = {
  [FreePlanStatus.SUBMITTING]: {
    label: "草稿",
    classes: "bg-slate-100 text-slate-600",
  },
  [FreePlanStatus.PENDING]: {
    label: "等待审核",
    classes: "bg-amber-50 text-amber-700",
  },
  [FreePlanStatus.APPROVED]: {
    label: "审核通过",
    classes: "bg-emerald-50 text-emerald-700",
  },
  [FreePlanStatus.REJECTED]: {
    label: "未收录",
    classes: "bg-rose-50 text-rose-700",
  },
};

export default function SubmissionCard({ item }: { item: ItemInfo }) {
  const status =
    statusLabels[item.freePlanStatus || ""] || statusLabels.submitting;
  return (
    <Card className="rounded-2xl border-slate-200 p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
        <div className="flex min-w-0 gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
            <FileCheck2 className="size-5" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-slate-900">{item.name}</h3>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${status.classes}`}
              >
                {status.label}
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
              {item.description}
            </p>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
              <Clock3 className="size-3.5" /> 提交于{" "}
              {getLocaleDate(item._createdAt)}
            </p>
            {item.freePlanStatus === FreePlanStatus.REJECTED &&
            item.rejectionReason ? (
              <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
                编辑说明：{item.rejectionReason}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          {item.publishDate ? (
            <Link
              href={`/resources/${item.slug.current}`}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:border-emerald-200 hover:text-emerald-700"
            >
              查看收录 <ArrowUpRight className="size-3.5" />
            </Link>
          ) : null}
          {item.link ? (
            <Link
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:border-emerald-200 hover:text-emerald-700"
            >
              原始链接 <ArrowUpRight className="size-3.5" />
            </Link>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

export function SubmissionCardSkeleton() {
  return <div className="h-36 animate-pulse rounded-2xl bg-slate-100" />;
}
