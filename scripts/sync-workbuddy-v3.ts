import { createClient } from "@sanity/client";
import { cases } from "../src/content/workbuddy";

const environment = process as NodeJS.Process & {
  loadEnvFile?: (path: string) => void;
};
environment.loadEnvFile?.(".env.local");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  throw new Error(
    "缺少 Sanity 配置：NEXT_PUBLIC_SANITY_PROJECT_ID、NEXT_PUBLIC_SANITY_DATASET 或 SANITY_API_TOKEN。",
  );
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const featureIds: Record<string, string> = {
  助手: "assistant",
  项目: "project",
  专家: "expert",
  技能: "skill",
  连接器: "connector",
  自动化: "automation",
  资料库: "knowledge",
  表格: "skill",
  Web: "connector",
};

const difficultyValues = {
  入门: "beginner",
  初级: "beginner",
  中级: "intermediate",
  高级: "advanced",
} as const;

const docId = (type: string, slug: string) => `workbuddy.${type}.${slug}`;
const relation = (type: string, slug: string, index: number) => ({
  _key: `${slug}-${index}`,
  _type: "reference",
  _ref: docId(type, slug),
});

async function main() {
  const transaction = client.transaction();
  const flagshipSlugs = new Set(["tea-shop-sales-analysis", "daily-ai-news"]);
  const flagshipCases = cases.filter((item) => flagshipSlugs.has(item.slug));
  const storyCases = cases.filter((item) => item.caseType === "story");
  const checkedAt = new Date().toISOString();

  for (const item of flagshipCases) {
    transaction.createOrReplace({
      _id: docId("case", item.slug),
      _type: "caseStudy",
      title: item.title,
      slug: { _type: "slug", current: item.slug },
      description: item.description,
      userBackground: item.userBackground,
      previousWorkflow: item.previousWorkflow,
      painPoints: item.painPoints,
      solution: item.solution,
      process: item.process,
      keyPrompt: item.prompt,
      result: item.result,
      improvements: item.improvements,
      prerequisites: item.prerequisites,
      acceptance: item.acceptance,
      deliverables: item.deliverables,
      safety: item.safety,
      limitations: item.limitations,
      caseType: item.caseType,
      dataNature: item.dataNature,
      contentOrigin: item.contentOrigin,
      verificationStatus: item.verificationStatus,
      difficulty: difficultyValues[item.difficulty],
      category: item.category,
      features: Array.from(
        new Set(item.feature.map((name) => featureIds[name]).filter(Boolean)),
      ).map((slug, index) => relation("feature", slug, index)),
      relatedRecipes: (item.relatedRecipes || []).map((entry, index) =>
        relation("recipe", entry.slug, index),
      ),
      relatedGuides: (item.relatedGuides || []).map((entry, index) =>
        relation("guide", entry.slug, index),
      ),
      relatedUseCases: (item.relatedUseCases || []).map((entry, index) =>
        relation("use-case", entry.slug, index),
      ),
      status: "published",
      featured: true,
      score: item.score,
      icon: item.icon,
      estimatedTime: Number.parseInt(item.time || "", 10) || undefined,
      priority: item.slug === "tea-shop-sales-analysis" ? 100 : 90,
      updatedAt: checkedAt,
      sourceUrl: item.sourceUrl,
      sourceName: item.sourceName,
      sourceKind: item.sourceKind,
      sourceLicense: item.sourceLicense,
      sourceRepository: item.sourceRepository,
      sourcePath: item.sourcePath,
      sourceCheckedAt: checkedAt,
      verificationNote: item.verificationNote,
    });
  }

  for (const item of storyCases) {
    transaction.patch(docId("case", item.slug), (patch) =>
      patch.set({
        caseType: "story",
        dataNature: "not-applicable",
        contentOrigin: "editorial",
        verificationStatus: "edited",
        relatedRecipes: (item.relatedRecipes || []).map((entry, index) =>
          relation("recipe", entry.slug, index),
        ),
        updatedAt: checkedAt,
      }),
    );
  }

  await transaction.commit({ returnDocuments: false });
  console.log(
    JSON.stringify(
      {
        projectId,
        dataset,
        createdOrUpdatedFlagshipCases: flagshipCases.length,
        classifiedApplicationStories: storyCases.length,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error("WorkBuddy Hub V3 sync failed:", error);
  process.exitCode = 1;
});
