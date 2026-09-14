import { ListingGrid, PageIntro } from "@/components/hub/hub-ui";
import { getUseCases } from "@/data/hub";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({ title: "场景中心" });
export default async function UseCasesPage() {
  const useCases = await getUseCases();
  return (
    <>
      <PageIntro
        eyebrow="Use cases"
        title="从你要完成的事"
        accent="开始探索"
        description="不知道应该用助手、项目还是自动化？先选择目标场景，我们会给你最短路径、最佳配方和推荐功能。"
      />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <ListingGrid items={useCases} prefix="use-cases" />
      </main>
    </>
  );
}
