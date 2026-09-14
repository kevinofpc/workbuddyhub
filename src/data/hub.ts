import {
  type HubIcon,
  type HubItem,
  cases as fallbackCases,
  guides as fallbackGuides,
  recipes as fallbackRecipes,
  resources as fallbackResources,
  useCases as fallbackUseCases,
} from "@/content/workbuddy";
import { sanityFetch } from "@/sanity/lib/fetch";

type HubDocument = {
  slug?: string;
  title?: string;
  description?: string;
  category?: string;
  difficulty?: string;
  features?: string[];
  setupTime?: number;
  readingTime?: number;
  estimatedTime?: number;
  duration?: string;
  icon?: string;
  score?: number;
  views?: string;
  resourceType?: string;
  sourceUrl?: string;
  sourceName?: string;
  sourceKind?: "official" | "community" | "editorial";
  sourceLicense?: string;
  sourceRepository?: string;
  sourcePath?: string;
  verificationNote?: string;
  updatedAt?: string;
  language?: string;
  imageUrl?: string;
  imageAlt?: string;
  content?: string;
  goal?: string;
  audience?: string[];
  inputs?: string[];
  outputs?: string[];
  steps?: string;
  prompt?: string;
  notes?: string;
  exampleResult?: string;
  faq?: Array<{ question?: string; answer?: string }>;
  userBackground?: string;
  previousWorkflow?: string;
  painPoints?: string;
  solution?: string;
  process?: string;
  result?: string;
  improvements?: string;
  quickStart?: string;
  prompts?: string[];
  advanced?: string;
  caseType?: HubItem["caseType"];
  dataNature?: HubItem["dataNature"];
  contentOrigin?: HubItem["contentOrigin"];
  verificationStatus?: HubItem["verificationStatus"];
  verifiedAt?: string;
  prerequisites?: string[];
  acceptance?: string;
  deliverables?: string[];
  safety?: string;
  limitations?: string;
  relatedRecipes?: HubItem["relatedRecipes"];
  relatedGuides?: HubItem["relatedGuides"];
  relatedUseCases?: HubItem["relatedUseCases"];
};

const icons = new Set<HubIcon>([
  "bot",
  "folder",
  "user",
  "wand",
  "link",
  "timer",
  "database",
  "presentation",
  "sheet",
  "search",
  "file",
  "pen",
  "video",
  "code",
  "mail",
  "chart",
]);

function normalizeDifficulty(value?: string): HubItem["difficulty"] {
  if (value === "advanced") return "高级";
  if (value === "intermediate") return "中级";
  if (value === "beginner") return "入门";
  if (["入门", "初级", "中级", "高级"].includes(value || "")) {
    return value as HubItem["difficulty"];
  }
  return "入门";
}

function normalizeIcon(value?: string, fallback: HubIcon = "file"): HubIcon {
  return icons.has(value as HubIcon) ? (value as HubIcon) : fallback;
}

function normalizeLanguage(value?: string): HubItem["language"] {
  if (value === "english") return "英文";
  if (value === "bilingual") return "双语";
  return "中文";
}

function normalizeResourceType(value?: string) {
  const labels: Record<string, string> = {
    tutorial: "教程",
    recipe: "配方",
    guide: "指南",
    video: "视频",
    course: "课程",
    article: "文章",
    case: "案例",
    "official-documentation": "官方文档",
    "community-resource": "社区资源",
  };
  return labels[value || ""] || value;
}

function normalize(
  document: HubDocument,
  fallbackIcon: HubIcon,
): HubItem | null {
  if (!document.slug || !document.title) return null;
  const minutes =
    document.setupTime || document.readingTime || document.estimatedTime;
  return {
    slug: document.slug,
    title: document.title,
    description: document.description || "WorkBuddy Hub 编辑精选内容。",
    icon: normalizeIcon(document.icon, fallbackIcon),
    category:
      normalizeResourceType(document.category || document.resourceType) ||
      "精选内容",
    difficulty: normalizeDifficulty(document.difficulty),
    feature: document.features?.filter(Boolean) || [],
    time: minutes ? `${minutes} 分钟` : document.duration,
    score: document.score,
    views: document.views,
    sourceUrl: document.sourceUrl,
    sourceName: document.sourceName,
    sourceKind: document.sourceKind,
    sourceLicense: document.sourceLicense,
    sourceRepository: document.sourceRepository,
    sourcePath: document.sourcePath,
    verificationNote: document.verificationNote,
    updatedAt: document.updatedAt,
    language: normalizeLanguage(document.language),
    imageUrl: document.imageUrl,
    imageAlt: document.imageAlt,
    content: document.content,
    goal: document.goal,
    audience: document.audience?.filter(Boolean),
    inputs: document.inputs?.filter(Boolean),
    outputs: document.outputs?.filter(Boolean),
    steps: document.steps,
    prompt: document.prompt,
    notes: document.notes,
    exampleResult: document.exampleResult,
    faq: document.faq
      ?.filter((entry) => entry.question && entry.answer)
      .map((entry) => ({
        question: entry.question || "",
        answer: entry.answer || "",
      })),
    userBackground: document.userBackground,
    previousWorkflow: document.previousWorkflow,
    painPoints: document.painPoints,
    solution: document.solution,
    process: document.process,
    result: document.result,
    improvements: document.improvements,
    quickStart: document.quickStart,
    prompts: document.prompts?.filter(Boolean),
    advanced: document.advanced,
    caseType: document.caseType,
    dataNature: document.dataNature,
    contentOrigin: document.contentOrigin,
    verificationStatus: document.verificationStatus,
    verifiedAt: document.verifiedAt,
    prerequisites: document.prerequisites?.filter(Boolean),
    acceptance: document.acceptance,
    deliverables: document.deliverables?.filter(Boolean),
    safety: document.safety,
    limitations: document.limitations,
    relatedRecipes: document.relatedRecipes,
    relatedGuides: document.relatedGuides,
    relatedUseCases: document.relatedUseCases,
  };
}

async function fetchWithFallback(
  query: string,
  fallback: HubItem[],
  fallbackIcon: HubIcon,
) {
  if (
    !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    !process.env.NEXT_PUBLIC_SANITY_DATASET
  ) {
    return fallback;
  }

  try {
    const documents = await sanityFetch<HubDocument[]>({ query });
    const normalized = documents
      .map((document) => normalize(document, fallbackIcon))
      .filter((item): item is HubItem => Boolean(item));
    return normalized.length > 0 ? normalized : fallback;
  } catch {
    console.warn(
      "WorkBuddy Hub CMS unavailable; using curated fallback content.",
    );
    return fallback;
  }
}

const sharedProjection = `
  "slug": slug.current,
  title,
  description,
  difficulty,
  "features": features[]->title,
  icon,
  score,
  sourceUrl,
  sourceName,
  sourceKind,
  sourceLicense,
  sourceRepository,
  sourcePath,
  verificationNote,
  contentOrigin,
  verificationStatus,
  verifiedAt,
  "updatedAt": coalesce(sourceCheckedAt, updatedAt, _updatedAt),
  "imageUrl": coverImage.asset->url,
  "imageAlt": coverImage.alt
`;

export function getRecipes() {
  return fetchWithFallback(
    `*[_type == "recipe" && status == "published"] | order(featured desc, _updatedAt desc) {
      ${sharedProjection},
      setupTime,
      goal,
      audience,
      inputs,
      outputs,
      steps,
      prompt,
      notes,
      exampleResult,
      acceptance,
      deliverables,
      safety,
      "category": coalesce(category, "实战配方")
    }`,
    fallbackRecipes,
    "wand",
  );
}

export function getGuides() {
  return fetchWithFallback(
    `*[_type == "guide" && status == "published"] | order(featured desc, _updatedAt desc) {
      ${sharedProjection},
      readingTime,
      content,
      faq[]{question, answer},
      "category": coalesce(category, "深度指南")
    }`,
    fallbackGuides,
    "file",
  );
}

export function getCases() {
  return fetchWithFallback(
    `*[_type == "caseStudy" && status == "published"] | order(coalesce(priority, 0) desc, featured desc, _updatedAt desc) {
      ${sharedProjection},
      userBackground,
      previousWorkflow,
      painPoints,
      solution,
      process,
      "prompt": keyPrompt,
      result,
      improvements,
      caseType,
      dataNature,
      estimatedTime,
      prerequisites,
      acceptance,
      deliverables,
      safety,
      limitations,
      "relatedRecipes": relatedRecipes[]->{
        "slug": slug.current, title, description, difficulty, icon
      },
      "relatedGuides": relatedGuides[]->{
        "slug": slug.current, title, description, difficulty, icon
      },
      "relatedUseCases": relatedUseCases[]->{
        "slug": slug.current, title, description, difficulty, icon
      },
      "category": coalesce(category, "真实案例")
    }`,
    fallbackCases,
    "chart",
  );
}

export function getUseCases() {
  return fetchWithFallback(
    `*[_type == "useCase" && status == "published"] | order(featured desc, _updatedAt desc) {
      ${sharedProjection},
      quickStart,
      prompts,
      advanced,
      "relatedRecipes": recipes[]->{
        "slug": slug.current, title, description, difficulty, icon
      },
      "relatedGuides": guides[]->{
        "slug": slug.current, title, description, difficulty, icon
      },
      "relatedUseCases": cases[]->{
        "slug": slug.current, title, description, difficulty, icon
      },
      "category": coalesce(category, "使用场景")
    }`,
    fallbackUseCases,
    "search",
  );
}

export function getResources() {
  return fetchWithFallback(
    `*[_type == "item" && defined(publishDate) && forceHidden != true] | order(featured desc, publishDate desc) {
      "slug": slug.current,
      "title": name,
      description,
      difficulty,
      "features": hubFeatures[]->title,
      "category": resourceType,
      resourceType,
      language,
      duration,
      score,
      "sourceUrl": link,
      sourceName,
      sourceKind,
      verificationNote,
      "content": introduction,
      "imageUrl": image.asset->url,
      "imageAlt": image.alt,
      "updatedAt": coalesce(lastChecked, _updatedAt),
      "views": select(defined(viewCount) => string(viewCount), "")
    }`,
    fallbackResources,
    "file",
  );
}

export async function getHubItem(
  type: "recipes" | "guides" | "cases" | "use-cases" | "resources",
  slug: string,
) {
  const loaders = {
    recipes: getRecipes,
    guides: getGuides,
    cases: getCases,
    "use-cases": getUseCases,
    resources: getResources,
  };
  const items = await loaders[type]();
  return items.find((item) => item.slug === slug);
}
