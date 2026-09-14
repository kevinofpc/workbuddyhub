import { DashboardSubmitHeader } from "@/components/dashboard/dashboard-submit-header";

export default async function SubmitLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div>
      <DashboardSubmitHeader
        title="推荐一份好资源"
        subtitle="分享你真正用过、值得更多 WorkBuddy 用户看到的内容"
        label="社区投稿"
      />

      <div className="mt-8">{children}</div>
    </div>
  );
}
