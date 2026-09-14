import { ListingGrid, PageIntro } from "@/components/hub/hub-ui";
import { getGuides } from "@/data/hub";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({ title: "深度指南" });
export default async function GuidesPage() {
  const guides = await getGuides();
  return (
    <>
      <PageIntro
        eyebrow="Guides"
        title="理解原理，建立"
        accent="正确用法"
        description="系统解释 WorkBuddy 的功能边界、组合方式与最佳实践，让你不只会照做，也知道为什么。"
      />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <ListingGrid items={guides} prefix="guides" />
      </main>
    </>
  );
}
