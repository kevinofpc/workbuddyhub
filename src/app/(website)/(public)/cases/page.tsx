import { ListingGrid, PageIntro } from "@/components/hub/hub-ui";
import { getCases } from "@/data/hub";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({ title: "真实案例" });
export default async function CasesPage() {
  const cases = await getCases();
  return (
    <>
      <PageIntro
        eyebrow="Real-world cases"
        title="真实工作里的"
        accent="WorkBuddy"
        description="看不同角色如何改变原来的工作方式：从痛点、配置和关键 Prompt，到效率变化与复盘。"
      />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <ListingGrid items={cases} prefix="cases" />
      </main>
    </>
  );
}
