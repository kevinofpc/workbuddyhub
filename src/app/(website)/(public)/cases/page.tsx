import { ListingGrid, PageIntro } from "@/components/hub/hub-ui";
import { getCases } from "@/data/hub";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({ title: "真实案例" });
export default async function CasesPage() {
  const cases = await getCases();
  return (
    <>
      <PageIntro
        eyebrow="Cases · 从问题到复现"
        title="不离开本站，读懂一次"
        accent="完整实践"
        description="每篇案例都在本站讲清场景、过程、Prompt、结果与限制，并连接到可以直接照做的配方。"
      />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="mb-10 grid gap-3 md:grid-cols-3">
          {[
            ["真实实践", "有真实使用背景，并提供足够材料支持复现。"],
            ["教学实操", "使用公开或模拟材料，重点训练完整工作方法。"],
            ["公开应用故事", "保留公开证据边界，不把编辑建议写成用户原话。"],
          ].map(([title, description]) => (
            <div key={title} className="hub-panel p-5">
              <h2 className="text-sm font-black text-slate-900">{title}</h2>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                {description}
              </p>
            </div>
          ))}
        </section>
        <ListingGrid items={cases} prefix="cases" />
      </main>
    </>
  );
}
