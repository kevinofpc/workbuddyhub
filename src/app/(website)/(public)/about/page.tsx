import { PageIntro } from "@/components/hub/hub-ui";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({ title: "关于我们" });
export default function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="About"
        title="让好方法比功能列表"
        accent="更容易找到"
        description="WorkBuddy Hub 是一个社区驱动的学习与最佳实践平台。"
      />
      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <div className="prose prose-slate max-w-none">
          <h2>我们为什么做这个网站</h2>
          <p>
            工具真正产生价值，不在于功能有多少，而在于用户能否把功能组合成解决问题的方法。WorkBuddy
            Hub
            围绕真实任务组织内容，用学习路径、配方、指南、案例和精选资源，帮助每个人更快跨过“知道”到“会用”的距离。
          </p>
          <h2>我们的边界</h2>
          <p>
            这里不执行任务，不替代
            WorkBuddy，也不是技能市场。这里专注学习、理解、发现与复制最佳实践。
          </p>
          <h2>内容与来源</h2>
          <p>
            我们优先引用 WorkBuddy
            官方文档和公开实践，并对社区资源标注作者、原始链接与最后核验时间。
          </p>
        </div>
      </main>
    </>
  );
}
