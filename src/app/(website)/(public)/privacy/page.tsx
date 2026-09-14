import { PageIntro } from "@/components/hub/hub-ui";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({ title: "隐私政策" });
export default function PrivacyPage() {
  return (
    <>
      <PageIntro
        eyebrow="Privacy"
        title="尊重你的数据与"
        accent="选择"
        description="我们只收集提供服务所必要的信息，并持续减少不必要的数据留存。"
      />
      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <div className="prose prose-slate max-w-none">
          <h2>收集的信息</h2>
          <p>
            当你订阅更新、注册账户或提交资源时，我们可能收集你主动提供的邮箱地址、公开资料和提交内容。
          </p>
          <h2>如何使用</h2>
          <p>
            信息仅用于提供站点功能、内容审核、服务通知和改进访问体验。我们不会出售你的个人信息。
          </p>
          <h2>你的选择</h2>
          <p>你可以随时取消订阅，并通过联系邮箱申请查阅或删除相关个人数据。</p>
          <p>最后更新：2026 年 9 月 2 日。</p>
        </div>
      </main>
    </>
  );
}
