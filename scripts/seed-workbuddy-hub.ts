import { createClient } from "@sanity/client";
import {
  type HubItem,
  cases,
  categoryDefinitions,
  collectionDefinitions,
  features,
  guides,
  recipes,
  resources,
  tagDefinitions,
  useCases,
} from "../src/content/workbuddy";

type SeedDocument = Record<string, unknown> & { _id: string; _type: string };

const environment = process as NodeJS.Process & {
  loadEnvFile?: (path: string) => void;
};

environment.loadEnvFile?.(".env.local");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  throw new Error(
    "缺少 Sanity 配置。请在 .env.local 中设置 NEXT_PUBLIC_SANITY_PROJECT_ID、NEXT_PUBLIC_SANITY_DATASET 和 SANITY_API_TOKEN。",
  );
}

if (projectId === "abc123xy") {
  throw new Error("检测到本地预览占位 Project ID，不能向该项目导入真实内容。");
}

const client = createClient({
  apiVersion: "2024-08-01",
  dataset,
  projectId,
  token,
  useCdn: false,
});

const now = new Date().toISOString();
const ref = (id: string) => ({ _type: "reference", _ref: id });
const keyedRef = (id: string) => ({
  _key: `ref-${id.replace(/[^a-z0-9]/gi, "-")}`,
  ...ref(id),
});
const documentId = (type: string, slug: string) => `workbuddy.${type}.${slug}`;

const featureByTitle = new Map(
  features.map((feature) => [feature.title, feature]),
);
const categoryByName = new Map(
  categoryDefinitions.map((category) => [category.title, category]),
);

const categoryAliases: Record<string, string> = {
  入门: "新手入门",
  基础概念: "新手入门",
  自动化: "自动化实践",
  研究: "研究与检索",
  产品管理: "研究与检索",
  销售: "自动化实践",
  内容: "内容创作",
  内容创作: "内容创作",
  办公: "办公效率",
  效率: "办公效率",
  知识管理: "研究与检索",
  开发: "开发协作",
  官方文档: "新手入门",
  指南: "新手入门",
  课程: "自动化实践",
  文档: "自动化实践",
  视频: "新手入门",
  案例: "内容创作",
};

const tagByFeature: Record<string, string[]> = {
  助手: ["beginner"],
  项目: ["knowledge"],
  专家: ["prompt"],
  技能: ["template"],
  连接器: ["connector"],
  自动化: ["automation", "workflow"],
  资料库: ["knowledge"],
  全部功能: ["beginner"],
};

const resourceTypes: Record<string, string> = {
  "official-docs": "official-documentation",
  "best-practice-guide": "guide",
  "automation-video-course": "course",
  "connector-handbook": "tutorial",
  "beginner-video": "video",
  "content-collection": "case",
};

const resourceCollections: Record<string, string[]> = {
  "official-docs": ["starter-kit"],
  "best-practice-guide": ["starter-kit", "research-stack"],
  "automation-video-course": ["automation-playbook"],
  "connector-handbook": ["automation-playbook"],
  "beginner-video": ["starter-kit"],
  "content-collection": ["creator-toolkit"],
};

function categoryReference(categoryName: string) {
  const canonicalName = categoryAliases[categoryName] || categoryName;
  const category = categoryByName.get(canonicalName);
  return category ? keyedRef(documentId("category", category.slug)) : undefined;
}

function featureReferences(item: HubItem) {
  return item.feature
    .map((title) => featureByTitle.get(title))
    .filter((feature): feature is (typeof features)[number] => Boolean(feature))
    .map((feature) => keyedRef(documentId("feature", feature.slug)));
}

function tagReferences(item: HubItem) {
  const tagSlugs = new Set(
    item.feature.flatMap((feature) => tagByFeature[feature] || []),
  );
  if (item.difficulty === "入门") tagSlugs.add("beginner");
  return Array.from(tagSlugs).map((slug) => keyedRef(documentId("tag", slug)));
}

function markdownHeading(title: string, description: string) {
  return `## ${title}\n\n${description}\n\n这是一篇已导入 WorkBuddy Hub CMS 的首版内容。编辑可在 Studio 中补充真实截图、链接、案例数据与最新操作说明。`;
}

function recipeDocument(item: HubItem, index: number): SeedDocument {
  return {
    _id: documentId("recipe", item.slug),
    _type: "recipe",
    title: item.title,
    slug: { _type: "slug", current: item.slug },
    description: item.description,
    goal: `用可复用流程完成「${item.title}」。`,
    setupTime: Number.parseInt(item.time || "10", 10),
    audience: ["知识工作者", "希望减少重复操作的团队"],
    inputs: ["明确的任务目标", "相关资料或数据", "验收标准"],
    outputs: ["结构化结果", "可复用的任务模板", "下一步行动清单"],
    steps: `${markdownHeading("实施步骤", item.description)}\n\n1. 明确目标、输出格式和完成标准。\n2. 收集并整理可靠的上下文资料。\n3. 组合 ${item.feature.join("、")} 执行任务。\n4. 检查结果、修正遗漏，再沉淀为模板。`,
    prompt: `你是一名经验丰富的 WorkBuddy 任务专家。请基于我提供的资料完成「${item.title}」。\n\n要求：\n1. 先确认目标与缺失信息；\n2. 输出结构化结果并标注依据；\n3. 给出风险、假设与下一步行动。`,
    notes:
      "先用小样本验证流程，再扩大任务范围；不要把未经核验的信息直接作为最终结论。",
    exampleResult:
      "输出应包含结论、依据、待确认项与后续行动，方便直接交付或继续迭代。",
    difficulty:
      item.difficulty === "高级"
        ? "advanced"
        : item.difficulty === "中级"
          ? "intermediate"
          : "beginner",
    category: item.category,
    features: featureReferences(item),
    tags: tagReferences(item),
    status: "published",
    featured: index < 4,
    updatedAt: now,
  };
}

function guideDocument(item: HubItem, index: number): SeedDocument {
  return {
    _id: documentId("guide", item.slug),
    _type: "guide",
    title: item.title,
    slug: { _type: "slug", current: item.slug },
    description: item.description,
    readingTime: Number.parseInt(item.time || "10", 10),
    content: `${markdownHeading("核心内容", item.description)}\n\n### 建议学习顺序\n\n1. 先理解 ${item.feature.join("、")} 的边界与适用场景。\n2. 用一个小任务完成首次练习。\n3. 将已验证的过程整理到项目或资料库中。\n4. 定期更新模板、资料来源和验收标准。`,
    faq: [
      {
        _key: "faq-start",
        question: "应该从哪里开始？",
        answer:
          "从一个范围明确、可在十到二十分钟内验证的任务开始，再逐步扩大。",
      },
      {
        _key: "faq-quality",
        question: "如何判断结果是否可靠？",
        answer: "检查来源、假设、输出格式与验收标准，并保留人工复核环节。",
      },
    ],
    difficulty:
      item.difficulty === "高级"
        ? "advanced"
        : item.difficulty === "中级"
          ? "intermediate"
          : "beginner",
    category: item.category,
    features: featureReferences(item),
    tags: tagReferences(item),
    status: "published",
    featured: index < 3,
    updatedAt: now,
  };
}

function caseDocument(item: HubItem, index: number): SeedDocument {
  return {
    _id: documentId("case", item.slug),
    _type: "caseStudy",
    title: item.title,
    slug: { _type: "slug", current: item.slug },
    description: item.description,
    userBackground: markdownHeading(
      "团队背景",
      "面向需要把重复知识工作流程标准化的团队。",
    ),
    previousWorkflow:
      "资料分散在不同工具中，成员需要人工收集、整理、讨论并重复产出相似内容。",
    painPoints: "耗时长、质量不稳定、来源难追溯，且经验无法稳定地被团队复用。",
    solution: `将 ${item.feature.join("、")} 组合为可验证的工作流：先收集资料，再执行分析或生成，并保留人工审核节点。`,
    process:
      "1. 明确本次任务范围和交付标准。\n2. 将可靠资料整理至同一项目。\n3. 运行标准化流程并记录关键判断。\n4. 人工复核后沉淀为可复用模板。",
    keyPrompt: `请基于已提供资料完成「${item.title}」，标注结论依据、待确认信息和下一步行动。`,
    result: `团队可以把「${item.title}」从依赖个人经验的临时工作，转为可追踪、可复用的稳定流程。`,
    improvements: "后续可继续补充真实周期、质量指标、截图和团队复盘记录。",
    difficulty:
      item.difficulty === "高级"
        ? "advanced"
        : item.difficulty === "中级"
          ? "intermediate"
          : "beginner",
    category: item.category,
    features: featureReferences(item),
    tags: tagReferences(item),
    status: "published",
    featured: index < 2,
    updatedAt: now,
  };
}

function useCaseDocument(item: HubItem, index: number): SeedDocument {
  return {
    _id: documentId("use-case", item.slug),
    _type: "useCase",
    title: item.title,
    slug: { _type: "slug", current: item.slug },
    description: item.description,
    quickStart: `从一个最小任务开始：明确「${item.title}」的目标、资料来源和输出格式，再用 ${item.feature.join("、")} 完成首轮验证。`,
    prompts: [
      `请帮助我完成「${item.title}」。先确认目标与可用资料，再给出带有依据和下一步行动的结构化结果。`,
    ],
    advanced:
      "当流程稳定后，将资料、模板与质量检查项沉淀到长期项目中，并通过自动化减少重复执行。",
    difficulty:
      item.difficulty === "高级"
        ? "advanced"
        : item.difficulty === "中级"
          ? "intermediate"
          : "beginner",
    category: item.category,
    features: featureReferences(item),
    tags: tagReferences(item),
    status: "published",
    featured: index < 4,
    updatedAt: now,
  };
}

function resourceDocument(item: HubItem, index: number): SeedDocument {
  const category = categoryReference(item.category);
  return {
    _id: documentId("resource", item.slug),
    _type: "item",
    name: item.title,
    slug: { _type: "slug", current: item.slug },
    description: item.description,
    summary: item.description,
    introduction: `${markdownHeading("资源说明", item.description)}\n\n建议编辑在发布前补充原始链接、适用版本、截图或示例文件。`,
    resourceType: resourceTypes[item.slug] || "community-resource",
    difficulty:
      item.difficulty === "高级"
        ? "advanced"
        : item.difficulty === "中级"
          ? "intermediate"
          : "beginner",
    language: "chinese",
    duration: item.time,
    score: item.score && item.score <= 5 ? item.score * 20 : item.score,
    lastChecked: now,
    outdated: false,
    hubFeatures: featureReferences(item),
    categories: category ? [category] : [],
    tags: tagReferences(item),
    collections: (resourceCollections[item.slug] || []).map((slug) =>
      keyedRef(documentId("collection", slug)),
    ),
    publishDate: now,
    featured: index < 3,
    forceHidden: false,
    paid: false,
    pricePlan: "free",
    freePlanStatus: "approved",
  };
}

const taxonomyDocuments: SeedDocument[] = [
  ...features.map((feature) => ({
    _id: documentId("feature", feature.slug),
    _type: "feature",
    title: feature.title,
    slug: { _type: "slug", current: feature.slug },
    description: feature.description,
    icon: feature.icon,
    whatItIs: markdownHeading("它是什么", feature.description),
    whenToUse: `当任务需要${feature.description}时使用。`,
    whenNotToUse: "当目标、资料或验收标准尚不明确时，先补齐信息再使用。",
    commonMistakes:
      "把多个不相关目标混在一次任务中，或忽略对结果和来源的复核。",
  })),
  ...categoryDefinitions.map((category, index) => ({
    _id: documentId("category", category.slug),
    _type: "category",
    name: category.title,
    slug: { _type: "slug", current: category.slug },
    description: category.description,
    priority: categoryDefinitions.length - index,
  })),
  ...tagDefinitions.map((tag) => ({
    _id: documentId("tag", tag.slug),
    _type: "tag",
    name: tag.title,
    slug: { _type: "slug", current: tag.slug },
    description: `WorkBuddy Hub 标签：${tag.title}`,
  })),
  ...collectionDefinitions.map((collection, index) => ({
    _id: documentId("collection", collection.slug),
    _type: "collection",
    name: collection.title,
    slug: { _type: "slug", current: collection.slug },
    description: collection.description,
    priority: collectionDefinitions.length - index,
  })),
];

const contentDocuments: SeedDocument[] = [
  ...recipes.map(recipeDocument),
  ...guides.map(guideDocument),
  ...cases.map(caseDocument),
  ...useCases.map(useCaseDocument),
  ...resources.map(resourceDocument),
];

async function createOnly(documents: SeedDocument[]) {
  const ids = documents.map((document) => document._id);
  const existing = await client.fetch<string[]>("*[_id in $ids]._id", { ids });
  const existingIds = new Set(existing);
  const missing = documents.filter(
    (document) => !existingIds.has(document._id),
  );

  if (missing.length) {
    const transaction = client.transaction();
    for (const document of missing) {
      transaction.createIfNotExists(document);
    }
    await transaction.commit({ returnDocuments: false });
  }

  return { created: missing.length, skipped: existing.length };
}

async function main() {
  const taxonomy = await createOnly(taxonomyDocuments);
  const content = await createOnly(contentDocuments);
  console.log(
    JSON.stringify(
      {
        projectId,
        dataset,
        taxonomy,
        content,
        total: taxonomyDocuments.length + contentDocuments.length,
        note: "种子内容仅创建缺失文档；后续在 Studio 的编辑不会被此脚本覆盖。",
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error("WorkBuddy Hub CMS seed failed:", error);
  process.exitCode = 1;
});
