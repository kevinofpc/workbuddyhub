import { ListingGrid, PageIntro } from "@/components/hub/hub-ui";
import { getRecipes } from "@/data/hub";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({ title: "实战配方" });

export default async function RecipesPage() {
  const recipes = await getRecipes();
  return (
    <>
      <PageIntro
        eyebrow="Recipes"
        title="把方法变成"
        accent="可复制的配方"
        description="一步一步告诉你如何在 WorkBuddy 中完成具体任务。每个配方都包含所需功能、配置步骤、Prompt、示例与避坑建议。"
      />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-wrap gap-2">
          {["全部", "办公", "研究", "内容", "自动化", "开发"].map(
            (item, index) => (
              <button
                key={item}
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-semibold ${index === 0 ? "bg-emerald-500 text-white" : "border border-slate-200 bg-white text-slate-500 hover:border-emerald-200"}`}
              >
                {item}
              </button>
            ),
          )}
        </div>
        <ListingGrid items={recipes} prefix="recipes" />
      </main>
    </>
  );
}
