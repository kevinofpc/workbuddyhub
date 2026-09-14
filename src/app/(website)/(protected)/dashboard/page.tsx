import { getSavedContent } from "@/actions/save-content";
import EmptySubmission from "@/components/dashboard/submission-empty";
import SubmissionList from "@/components/dashboard/submission-list";
import CustomPagination from "@/components/shared/pagination";
import { siteConfig } from "@/config/site";
import { getSubmissions } from "@/data/submission";
import { currentUser } from "@/lib/auth";
import { SUBMISSIONS_PER_PAGE } from "@/lib/constants";
import { constructMetadata } from "@/lib/metadata";
import { Bookmark, ChevronRight, Send } from "lucide-react";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "我的内容",
  description: "查看收藏内容与社区投稿审核状态。",
  canonicalUrl: `${siteConfig.url}/dashboard`,
});

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const user = await currentUser();
  const page = typeof searchParams?.page === "string" ? searchParams.page : "1";
  const currentPage = Number(page) || 1;
  const [{ submissions, totalCount }, savedContent] = await Promise.all([
    getSubmissions({ userId: user?.id, currentPage }),
    getSavedContent(),
  ]);
  const totalPages = Math.ceil(totalCount / SUBMISSIONS_PER_PAGE);

  return (
    <div className="space-y-12">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
            My WorkBuddy Hub
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            我的内容
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            继续学习已收藏的方法，或跟踪投稿审核进度。
          </p>
        </div>
        <Link
          href="/submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700"
        >
          <Send className="size-4" /> 提交新资源
        </Link>
      </header>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <Bookmark className="size-5 text-emerald-600" />
          <h2 className="text-lg font-black text-slate-900">我的收藏</h2>
          <span className="text-xs text-slate-400">{savedContent.length}</span>
        </div>
        {savedContent.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {savedContent.map((item) => (
              <Link
                key={item._key}
                href={`/${item.contentType}/${item.slug}`}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-emerald-200"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {item.contentType}
                  </p>
                </div>
                <ChevronRight className="size-4 shrink-0 text-slate-300 group-hover:text-emerald-600" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-500">
            还没有收藏内容。浏览详情页时点击“收藏”即可保存。
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <Send className="size-5 text-emerald-600" />
          <h2 className="text-lg font-black text-slate-900">我的投稿</h2>
          <span className="text-xs text-slate-400">{totalCount}</span>
        </div>
        {submissions?.length === 0 ? <EmptySubmission /> : null}
        {submissions && submissions.length > 0 ? (
          <div>
            <SubmissionList items={submissions} />
            <div className="mt-8 flex items-center justify-center">
              <CustomPagination
                routePrefix="/dashboard"
                totalPages={totalPages}
              />
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
