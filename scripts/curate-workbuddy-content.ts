import { createReadStream, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@sanity/client";

type SourceKind = "official" | "community" | "editorial";
type Difficulty = "beginner" | "intermediate" | "advanced";
type ResourceType =
  | "tutorial"
  | "guide"
  | "article"
  | "case"
  | "official-documentation"
  | "community-resource";

type ScoreBreakdown = {
  executable: number;
  completeness: number;
  freshness: number;
  originality: number;
  clarity: number;
  feedback: number;
  editorial: number;
};

type ResourceDefinition = {
  slug: string;
  name: string;
  description: string;
  url: string;
  sourceName: string;
  sourceKind: SourceKind;
  resourceType: ResourceType;
  difficulty: Difficulty;
  category: string;
  features: string[];
  tags: string[];
  collections?: string[];
  duration?: string;
  featured?: boolean;
  screenshot?: string;
  learning: string[];
  verificationNote?: string;
  scoreBreakdown?: ScoreBreakdown;
};

type ImageReference = {
  _type: "image";
  asset: { _type: "reference"; _ref: string };
  alt: string;
  sourceUrl: string;
};

type BrandAssetDefinition = {
  slug: string;
  title: string;
  description: string;
  assetType: "logo" | "social" | "reference";
  imageKey: string;
  imageGroup: "brand" | "screenshot";
  sourceUrl: string;
  sourceName: string;
  sourceKind: "official" | "editorial";
  usageNotes: string;
  rightsNote: string;
  featured: boolean;
};

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
  apiVersion: "2024-08-01",
  dataset,
  projectId,
  token,
  useCdn: false,
});

const checkedAt = "2026-09-12T00:00:00.000Z";
const officialDocs = "https://www.workbuddy.cn/docs/workbuddy";
const functionDocs = `${officialDocs}/From-Beginner-to-Expert-Guide/Function-Description`;
const practiceDocs = `${officialDocs}/From-Beginner-to-Expert-Guide/Practice-Cases`;
const openDocs = "https://open.workbuddy.cn/docs";
const screenshotDirectory = resolve("output", "playwright");
const docId = (type: string, slug: string) => `workbuddy.${type}.${slug}`;
const ref = (id: string) => ({ _type: "reference" as const, _ref: id });
const keyedRef = (id: string) => ({
  _key: `ref-${id.replace(/[^a-z0-9]/gi, "-")}`,
  ...ref(id),
});

const defaultOfficialScore: ScoreBreakdown = {
  executable: 24,
  completeness: 19,
  freshness: 15,
  originality: 15,
  clarity: 10,
  feedback: 8,
  editorial: 5,
};

const defaultCommunityScore: ScoreBreakdown = {
  executable: 23,
  completeness: 18,
  freshness: 13,
  originality: 13,
  clarity: 9,
  feedback: 8,
  editorial: 5,
};

function scoreTotal(parts: ScoreBreakdown) {
  return Object.values(parts).reduce((total, value) => total + value, 0);
}

const screenshotSources: Record<
  string,
  { file: string; title: string; sourceUrl: string }
> = {
  overview: {
    file: "workbuddy-overview.png",
    title: "WorkBuddy 官方文档概览",
    sourceUrl: `${officialDocs}/Overview`,
  },
  firstTask: {
    file: "workbuddy-first-task.png",
    title: "WorkBuddy 开启第一个任务",
    sourceUrl: `${officialDocs}/FirstTask`,
  },
  tips: {
    file: "workbuddy-tips.png",
    title: "WorkBuddy 10 个上手技巧",
    sourceUrl: `${officialDocs}/From-Beginner-to-Expert-Guide/Efficient-Tips`,
  },
  automation: {
    file: "workbuddy-automation.png",
    title: "WorkBuddy 自动化官方文档",
    sourceUrl: `${functionDocs}/Automation-Guide`,
  },
  skills: {
    file: "workbuddy-skills.png",
    title: "WorkBuddy 技能官方文档",
    sourceUrl: `${functionDocs}/Skills-Market`,
  },
  assistant: {
    file: "workbuddy-assistant.png",
    title: "WorkBuddy 助理官方文档",
    sourceUrl: `${functionDocs}/Assistant`,
  },
  library: {
    file: "workbuddy-library.png",
    title: "WorkBuddy 资料库官方文档",
    sourceUrl: `${functionDocs}/Library`,
  },
  connectorDev: {
    file: "workbuddy-connector-dev.png",
    title: "WorkBuddy 开放平台连接器文档",
    sourceUrl: `${openDocs}/connector`,
  },
  product: {
    file: "workbuddy-tencent-cloud.png",
    title: "腾讯云 WorkBuddy 官方产品页",
    sourceUrl: "https://cloud.tencent.com/product/workbuddy",
  },
  bluebook: {
    file: "workbuddy-bluebook.png",
    title: "WorkBuddy 实战蓝皮书 GitHub 仓库",
    sourceUrl: "https://github.com/alankris/WorkBuddy",
  },
  resourceArchive: {
    file: "workbuddy-resource-archive.png",
    title: "WorkBuddy 公开资源归档 GitHub 仓库",
    sourceUrl: "https://github.com/infometa/workbuddyskills",
  },
  practicalGuide: {
    file: "workbuddy-practical-guide.png",
    title: "WorkBuddy 实践指南 GitHub 仓库",
    sourceUrl: "https://github.com/opcspace/WorkBuddy-Guide",
  },
};

const brandImageSources: Record<
  string,
  { file: string; path: string; title: string; sourceUrl: string }
> = {
  hubMark: {
    file: "android-chrome-512x512.png",
    path: resolve("public", "android-chrome-512x512.png"),
    title: "WorkBuddy Hub 方形品牌标志",
    sourceUrl: "https://workbuddyhub.com",
  },
  hubOg: {
    file: "og-workbuddy.png",
    path: resolve("public", "og-workbuddy.png"),
    title: "WorkBuddy Hub 社交分享图",
    sourceUrl: "https://workbuddyhub.com",
  },
};

const brandAssets: BrandAssetDefinition[] = [
  {
    slug: "hub-mark",
    title: "WorkBuddy Hub 品牌标志",
    description: "站点自有的方形品牌标志，适合 favicon、头像和紧凑品牌位。",
    assetType: "logo",
    imageKey: "hubMark",
    imageGroup: "brand",
    sourceUrl: "https://workbuddyhub.com",
    sourceName: "WorkBuddy Hub",
    sourceKind: "editorial",
    usageNotes:
      "用于 WorkBuddy Hub 页面、账号头像和站内导航；展示时保留安全留白并保持品牌识别清晰。",
    rightsNote:
      "WorkBuddy Hub 自有站点素材。WorkBuddy 名称及产品商标归其权利人所有。",
    featured: true,
  },
  {
    slug: "hub-social-card",
    title: "WorkBuddy Hub 社交分享图",
    description: "网站 Open Graph 与社交分享使用的 1200×630 品牌封面。",
    assetType: "social",
    imageKey: "hubOg",
    imageGroup: "brand",
    sourceUrl: "https://workbuddyhub.com",
    sourceName: "WorkBuddy Hub",
    sourceKind: "editorial",
    usageNotes:
      "用于网页分享卡片、项目介绍和发布公告；不要裁掉标题或主要视觉区域。",
    rightsNote:
      "WorkBuddy Hub 自有站点素材；使用时应保持内容来源和品牌信息准确。",
    featured: true,
  },
  {
    slug: "official-interface-reference",
    title: "WorkBuddy 官方界面与品牌参考",
    description:
      "来自 WorkBuddy 官方文档首页的界面截图，供资源编辑、页面校对和品牌识别参考。",
    assetType: "reference",
    imageKey: "overview",
    imageGroup: "screenshot",
    sourceUrl: `${officialDocs}/Overview`,
    sourceName: "WorkBuddy 官方文档",
    sourceKind: "official",
    usageNotes:
      "作为带来源的编辑参考或文章截图使用；对外展示时保留来源说明，不拆出页面中的 Logo 作为本站标志。",
    rightsNote:
      "截图中的 WorkBuddy 界面、名称和商标归其权利人所有；本站仅作识别、评论与教学参考。",
    featured: false,
  },
];

const resources = (
  [
    {
      slug: "official-docs",
      name: "WorkBuddy 官方文档总览",
      description:
        "官方完整文档入口，覆盖入门、任务、专家、技能、连接器、资料库、自动化与团队协作。",
      url: `${officialDocs}/Overview`,
      sourceName: "WorkBuddy 官方文档",
      sourceKind: "official",
      resourceType: "official-documentation",
      difficulty: "beginner",
      category: "getting-started",
      features: ["assistant", "project", "expert", "skill", "connector"],
      tags: ["beginner"],
      collections: ["starter-kit"],
      duration: "10 分钟",
      featured: true,
      screenshot: "overview",
      learning: [
        "确认 WorkBuddy 与普通聊天式 AI 的差异",
        "按官方建议顺序进入快速开始、任务管理与结果查看",
        "把官方文档作为后续功能核验的第一来源",
      ],
    },
    {
      slug: "official-product-page",
      name: "腾讯云 WorkBuddy 产品页与用户实践",
      description:
        "腾讯云官方产品介绍，包含核心能力、专家协作、团队复用和公开用户反馈。",
      url: "https://cloud.tencent.com/product/workbuddy",
      sourceName: "腾讯云",
      sourceKind: "official",
      resourceType: "official-documentation",
      difficulty: "beginner",
      category: "getting-started",
      features: ["assistant", "expert", "project", "skill", "connector"],
      tags: ["beginner", "workflow"],
      collections: ["starter-kit"],
      duration: "8 分钟",
      featured: true,
      screenshot: "product",
      learning: [
        "理解自然语言执行、本地文件操作与多 Agent 协作",
        "查看官方公开的团队推广与生产实践反馈",
        "了解个人流程如何沉淀为团队资产",
      ],
      verificationNote:
        "页面中的效率与推广数据属于公开用户反馈，应保留原始语境，不应外推为所有团队的通用结果。",
    },
    {
      slug: "beginner-video",
      name: "开启你的第一个任务（官方图文教程）",
      description:
        "从下载、登录、新建任务、描述目标到查看结果的完整官方上手流程。",
      url: `${officialDocs}/FirstTask`,
      sourceName: "WorkBuddy 官方文档",
      sourceKind: "official",
      resourceType: "tutorial",
      difficulty: "beginner",
      category: "getting-started",
      features: ["assistant"],
      tags: ["beginner", "prompt"],
      collections: ["starter-kit"],
      duration: "10 分钟",
      featured: true,
      screenshot: "firstTask",
      learning: [
        "完成客户端安装与微信扫码登录",
        "用清晰目标创建第一个可执行任务",
        "在结果区检查产物并继续追问",
      ],
      verificationNote: "原占位标题含“视频”，现已改为真实存在的官方图文教程。",
    },
    {
      slug: "best-practice-guide",
      name: "WorkBuddy 10 个官方上手技巧",
      description:
        "官方整理的需求表达、任务拆解、文件备份、结果检查与自动化使用建议。",
      url: `${officialDocs}/From-Beginner-to-Expert-Guide/Efficient-Tips`,
      sourceName: "WorkBuddy 官方文档",
      sourceKind: "official",
      resourceType: "guide",
      difficulty: "beginner",
      category: "getting-started",
      features: ["assistant", "project", "automation"],
      tags: ["beginner", "prompt", "workflow"],
      collections: ["starter-kit", "automation-playbook"],
      duration: "12 分钟",
      featured: true,
      screenshot: "tips",
      learning: [
        "用“做什么、有什么、怎么样”写清任务",
        "从小范围验证开始，给文件保留备份",
        "只把规则明确、可回退的任务交给自动化",
      ],
    },
    {
      slug: "automation-video-course",
      name: "自动化任务官方入门指南",
      description:
        "创建、调度、试运行和审计自动化任务，并理解无人值守任务的安全边界。",
      url: `${functionDocs}/Automation-Guide`,
      sourceName: "WorkBuddy 官方文档",
      sourceKind: "official",
      resourceType: "tutorial",
      difficulty: "intermediate",
      category: "automation",
      features: ["automation", "connector"],
      tags: ["automation", "workflow"],
      collections: ["automation-playbook"],
      duration: "15 分钟",
      featured: true,
      screenshot: "automation",
      learning: [
        "设置名称、提示词、工作空间与调度规则",
        "先低频试运行，再逐步放大执行频率",
        "为文件修改、外部发送与高风险动作保留日志和人工复核",
      ],
      verificationNote:
        "原占位标题含“视频课程”，现已替换为已核验的官方图文指南。",
    },
    {
      slug: "connector-handbook",
      name: "连接器使用与能力边界",
      description:
        "了解连接器如何让 WorkBuddy 通过自然语言调用邮箱、文档及其他外部服务。",
      url: `${functionDocs}/Connector`,
      sourceName: "WorkBuddy 官方文档",
      sourceKind: "official",
      resourceType: "official-documentation",
      difficulty: "intermediate",
      category: "automation",
      features: ["connector", "skill"],
      tags: ["connector", "workflow"],
      collections: ["automation-playbook"],
      duration: "12 分钟",
      screenshot: "connectorDev",
      learning: [
        "区分连接器与普通技能的职责",
        "核对授权、凭证、权限和第三方数据共享边界",
        "连接后先用只读、小范围任务验证",
      ],
    },
    {
      slug: "content-collection",
      name: "官方实践：自媒体运营",
      description:
        "从选题、资料整理到内容生产的官方实践案例，适合内容团队按步骤复现。",
      url: `${practiceDocs}/Practice-Four`,
      sourceName: "WorkBuddy 官方文档",
      sourceKind: "official",
      resourceType: "case",
      difficulty: "intermediate",
      category: "content",
      features: ["project", "expert", "skill"],
      tags: ["writing", "workflow"],
      collections: ["creator-toolkit"],
      duration: "20 分钟",
      screenshot: "tips",
      learning: [
        "把内容任务拆为研究、写作、检查和交付环节",
        "在项目中集中管理上下文与产物",
        "为事实、版权和发布动作保留人工确认",
      ],
      verificationNote: "这是官方教学案例，不代表某个客户团队的量化绩效。",
    },
    ...[
      [
        "official-project",
        "项目：组织长期任务与上下文",
        "了解项目工作区、长期上下文和可复用工作流程。",
        `${functionDocs}/Project`,
        "research",
        ["project", "knowledge"],
        ["knowledge", "workflow"],
        "library",
      ],
      [
        "official-assistant",
        "助理：从手机远程执行任务",
        "通过微信、企微、QQ、钉钉或飞书远程控制电脑上的 WorkBuddy。",
        `${functionDocs}/Assistant`,
        "automation",
        ["assistant", "connector"],
        ["connector", "workflow"],
        "assistant",
      ],
      [
        "official-skills",
        "技能市场与本地技能",
        "学习安装、管理和安全审查 WorkBuddy Skill。",
        `${functionDocs}/Skills-Market`,
        "development",
        ["skill"],
        ["template", "workflow"],
        "skills",
      ],
      [
        "official-library",
        "资料库：沉淀、协作与轻量发布",
        "把 MD、CSV、HTML 与办公文件纳入可持续复用的资料闭环。",
        `${functionDocs}/Library`,
        "research",
        ["knowledge", "project"],
        ["knowledge", "workflow"],
        "library",
      ],
      [
        "official-security-sandbox",
        "默认权限与安全沙箱",
        "理解文件访问、命令执行与高风险操作的权限控制。",
        `${functionDocs}/Permission-Modes`,
        "getting-started",
        ["assistant", "project"],
        ["beginner", "workflow"],
        "overview",
      ],
      [
        "official-team-collaboration",
        "多人多 Agent 协作",
        "了解团队空间、权限、审阅、协同编辑与 Agent 分工。",
        `${functionDocs}/Library/Collaboration`,
        "office",
        ["project", "expert", "knowledge"],
        ["workflow", "knowledge"],
        "library",
      ],
      [
        "official-lightweight-publish",
        "资料库轻量发布",
        "将 HTML 与 CSV 产物发布为可访问页面或轻应用。",
        `${functionDocs}/Library/Lightweight-Publish`,
        "development",
        ["knowledge", "project"],
        ["workflow", "template"],
        "library",
      ],
    ].map(
      ([
        slug,
        name,
        description,
        url,
        category,
        features,
        tags,
        screenshot,
      ]) => ({
        slug: slug as string,
        name: name as string,
        description: description as string,
        url: url as string,
        sourceName: "WorkBuddy 官方文档",
        sourceKind: "official" as const,
        resourceType: "official-documentation" as const,
        difficulty: "intermediate" as const,
        category: category as string,
        features: features as string[],
        tags: tags as string[],
        duration: "12 分钟",
        screenshot: screenshot as string,
        learning: [
          `理解“${name as string}”的适用范围`,
          "按官方步骤完成一次小范围验证",
          "记录权限、输入、输出与需要人工确认的环节",
        ],
      }),
    ),
    ...[
      [
        "practice-file-processing",
        "官方实践：文件内容识别与处理",
        "Practice-One",
        "folder",
      ],
      [
        "practice-document-editing",
        "官方实践：文档生成与编辑",
        "Practice-Two",
        "file",
      ],
      [
        "practice-data-analysis",
        "官方实践：数据分析并可视化",
        "Practice-Three",
        "sheet",
      ],
      [
        "practice-daily-news",
        "官方实践：每日自动推送资讯简报",
        "Practice-Five",
        "mail",
      ],
      [
        "practice-remote-work",
        "官方实践：远程遥控 WorkBuddy",
        "Practice-Six",
        "assistant",
      ],
      [
        "practice-no-code-app",
        "官方实践：零代码制作本地应用",
        "Practice-Seven",
        "code",
      ],
      [
        "practice-create-skill",
        "官方实践：创建自己的 Skill",
        "Practice-Eight",
        "skills",
      ],
      [
        "practice-ai-driven",
        "官方实践：AI 自驱动工作流",
        "Practice-Nine",
        "automation",
      ],
      [
        "practice-meeting-management",
        "官方实践：一句话管理会议",
        "Practice-Ten",
        "file",
      ],
      [
        "practice-tencent-docs",
        "官方实践：一句话管理腾讯文档",
        "Practice-Eleven",
        "library",
      ],
    ].map(([slug, name, path, screenshot], index) => ({
      slug: slug as string,
      name: name as string,
      description:
        "来自 WorkBuddy 官方实践案例栏目的可复现步骤、示例指令与使用建议。",
      url: `${practiceDocs}/${path as string}`,
      sourceName: "WorkBuddy 官方文档",
      sourceKind: "official" as const,
      resourceType: "case" as const,
      difficulty: index < 3 ? ("beginner" as const) : ("intermediate" as const),
      category:
        index === 2
          ? "office"
          : index === 3 || index === 7
            ? "automation"
            : index === 5 || index === 6
              ? "development"
              : "office",
      features:
        index === 3 || index === 7
          ? ["automation", "connector"]
          : index === 4
            ? ["assistant", "connector"]
            : index === 6
              ? ["skill"]
              : ["assistant", "project"],
      tags: ["workflow", index < 3 ? "beginner" : "template"],
      duration: "15 分钟",
      screenshot: screenshot as string,
      learning: [
        "先阅读适用场景与输入要求",
        "复制示例思路并替换成自己的文件、目标和输出格式",
        "用小样本运行，检查产物后再扩大范围",
      ],
      verificationNote:
        "官方教学案例用于演示方法，不等同于经过审计的客户成效案例。",
    })),
    ...[
      [
        "connector-development",
        "开发 WorkBuddy 连接器",
        "connector",
        "connectorDev",
      ],
      ["skill-development", "开发 WorkBuddy Skill", "skill", "skills"],
      ["expert-development", "开发 WorkBuddy 专家", "expert", "skills"],
      ["buddy-app-development", "开发 Buddy 应用", "buddy-app", "connectorDev"],
    ].map(([slug, name, path, screenshot]) => ({
      slug: slug as string,
      name: name as string,
      description:
        "WorkBuddy 开放平台官方开发文档，包含结构、配置字段、依赖与发布要求。",
      url: `${openDocs}/${path as string}`,
      sourceName: "WorkBuddy 开放平台",
      sourceKind: "official" as const,
      resourceType: "official-documentation" as const,
      difficulty: "advanced" as const,
      category: "development",
      features:
        path === "connector"
          ? ["connector", "skill"]
          : path === "skill"
            ? ["skill"]
            : ["expert", "connector", "skill"],
      tags: ["api", "workflow"],
      duration: "25 分钟",
      screenshot: screenshot as string,
      learning: [
        "确认包结构和必填元数据",
        "明确凭证、权限和依赖声明",
        "在本地验证后再提交或分发",
      ],
    })),
    {
      slug: "workbuddy-bluebook",
      name: "WorkBuddy 实战蓝皮书",
      description:
        "社区维护的任务驱动实战读本，覆盖入门、移动办公、知识管理、自动化与多 Agent。",
      url: "https://github.com/alankris/WorkBuddy",
      sourceName: "WorkBuddy 实战蓝皮书社区",
      sourceKind: "community",
      resourceType: "community-resource",
      difficulty: "beginner",
      category: "getting-started",
      features: ["assistant", "project", "skill", "connector", "automation"],
      tags: ["beginner", "workflow", "template"],
      collections: ["starter-kit", "automation-playbook"],
      duration: "系统课程",
      featured: true,
      screenshot: "bluebook",
      learning: [
        "沿真实任务路线学习而不是只看功能列表",
        "获取案例、提示词和可复用工作流",
        "通过仓库 Issue 与提交记录判断维护状态",
      ],
      verificationNote:
        "社区项目，不代表 WorkBuddy 官方立场；操作细节应与最新官方文档交叉核验。",
    },
    {
      slug: "workbuddy-practical-guide",
      name: "WorkBuddy 实践指南",
      description: "从一句话需求走到可验收办公交付的中文实践知识库。",
      url: "https://github.com/opcspace/WorkBuddy-Guide",
      sourceName: "OPCspace",
      sourceKind: "community",
      resourceType: "community-resource",
      difficulty: "beginner",
      category: "getting-started",
      features: ["assistant", "project", "automation", "connector"],
      tags: ["beginner", "workflow"],
      collections: ["starter-kit"],
      duration: "系统指南",
      screenshot: "practicalGuide",
      learning: [
        "把模糊需求写成目标、输入、约束和验收标准",
        "用材料清点、生成和证据验收完成端到端交付",
        "排查权限、文件、自动化和渠道问题",
      ],
      verificationNote:
        "社区重组内容；遇到版本差异时以官方文档和客户端现状为准。",
    },
    {
      slug: "workbuddy-resource-archive",
      name: "WorkBuddy Skills / Connectors / Experts 公开资源归档",
      description:
        "持续同步公开市场包的社区归档，适合检索资源名称、依赖和包结构。",
      url: "https://github.com/infometa/workbuddyskills",
      sourceName: "infometa",
      sourceKind: "community",
      resourceType: "community-resource",
      difficulty: "advanced",
      category: "development",
      features: ["skill", "connector", "expert"],
      tags: ["api", "template"],
      duration: "按需查阅",
      screenshot: "resourceArchive",
      learning: [
        "按目录检索公开技能、连接器与专家包",
        "查看 CATALOG 与具体包的前置条件",
        "在安装前检查许可证、脚本与权限",
      ],
      verificationNote:
        "这是学习归档，不是 WorkBuddy 技能市场；仓库提醒使用者以产品市场为准，并检查第三方包的独立许可证。",
    },
    {
      slug: "workbuddy-connector-community-course",
      name: "WorkBuddy 连接器与腾讯生态社区教程",
      description: "面向腾讯文档、邮箱、会议与项目协作的连接器配置长教程。",
      url: "https://github.com/KimYx0207/AI-Coding-Guide-Zh/blob/main/docs/workbuddy/WB-05-WorkBuddy%E8%BF%9E%E6%8E%A5%E5%99%A8%E4%B8%8E%E8%85%BE%E8%AE%AF%E7%94%9F%E6%80%81%E5%AE%8C%E6%95%B4%E6%8C%87%E5%8D%97.md",
      sourceName: "老金带你玩 AI / AI-Coding-Guide-Zh",
      sourceKind: "community",
      resourceType: "tutorial",
      difficulty: "intermediate",
      category: "automation",
      features: ["connector", "skill"],
      tags: ["connector", "workflow"],
      collections: ["automation-playbook"],
      duration: "1–2 小时",
      learning: [
        "区分技能与连接器",
        "了解腾讯办公生态的典型连接方式",
        "按最小权限原则完成授权和验证",
      ],
      verificationNote:
        "社区教程标注更新时间为 2026-08-06；连接器清单会变化，应以客户端实际市场为准。",
    },
  ] as ResourceDefinition[]
).map((resource) => ({
  ...resource,
  scoreBreakdown:
    resource.scoreBreakdown ||
    (resource.sourceKind === "official"
      ? defaultOfficialScore
      : defaultCommunityScore),
}));

const caseStudies = [
  {
    id: docId("case", "competitor-analysis-pm-process"),
    slug: "competitor-analysis-pm-process",
    title: "捷顺科技：把 WorkBuddy 推广到 15 个部门",
    description:
      "官方公开用户反馈显示，WorkBuddy 从个人使用扩展到了 15 个部门。",
    userBackground:
      "公开来源中的反馈者为赵婉清，产品经理，所属企业为捷顺科技。",
    previousWorkflow:
      "官方页面没有披露推广前的详细流程、样本量或基线数据，因此本站不补写未公开信息。",
    painPoints:
      "公开反馈关注的是跨部门推广与低门槛体验，而不是单一任务的耗时指标。",
    solution:
      "团队先在内部使用 WorkBuddy，再向 15 个部门推广；公开反馈同时提到小程序端可减少下载安装门槛。",
    process:
      "可复用做法：先选低风险、高频任务试点，记录模板和验收标准；稳定后按部门复制，并保留培训、权限与反馈渠道。",
    result:
      "可确认的公开结果是“向 15 个部门推广应用”。官方页面未披露活跃率、节省工时或质量变化。",
    improvements:
      "正式复盘时应继续补充各部门使用率、完成率、人工复核量和失败原因。",
    category: "团队落地",
    features: ["project", "expert", "skill"],
    score: 92,
    verificationNote:
      "姓名、岗位、公司和 15 个部门来自腾讯云官方产品页；流程建议为本站编辑整理，未将其描述为客户原话。",
  },
  {
    id: docId("case", "content-studio"),
    slug: "content-studio",
    title: "麦芽传媒：办公场景单环节提效 90% 以上",
    description:
      "官方公开用户反馈涵盖 PPT、文档数据分析和图片设计等规模化日常办公场景。",
    userBackground:
      "公开来源中的反馈者为周文博，产品运营，所属企业为麦芽传媒。",
    previousWorkflow: "官方页面未给出使用前各任务的耗时、人员数量和测量周期。",
    painPoints:
      "覆盖 PPT、文档数据分析、图片设计等多个高频场景时，既要追求效率，也要处理重试和卡顿。",
    solution:
      "把 WorkBuddy 用于多类日常办公任务，而不是只做单点问答；每类任务仍需要独立的模板和验收检查。",
    process:
      "复用建议：按场景建立输入模板、质量清单和失败回退；先评估单环节，再评估完整流程，避免把局部效率等同于总体效率。",
    result:
      "公开反馈称“单个环节提效在 90% 以上”，同时明确提到有时会出现报错重试和卡顿。",
    improvements:
      "建议补充指标口径、测量周期、成功率与重试成本，让效率数据可复核。",
    category: "内容与办公",
    features: ["project", "skill", "expert"],
    score: 94,
    verificationNote:
      "效率数字和局限均来自腾讯云官方产品页公开反馈；本站没有推断完整流程的总体提效比例。",
  },
  {
    id: docId("case", "sales-daily"),
    slug: "sales-daily",
    title: "奔驰项目团队：用手机远程衔接电脑任务",
    description:
      "官方反馈提到通过微信、企业微信向 WorkBuddy 发指令，支持离开电脑后的任务衔接。",
    userBackground:
      "公开来源中的反馈者为陈昊然，项目经理，所属企业标注为奔驰公司。",
    previousWorkflow:
      "官方页面未披露远程使用前的沟通流程、响应时长或采用人数。",
    painPoints:
      "项目人员离开工位后仍可能需要定位文件、继续任务或获取执行结果。",
    solution:
      "利用 WorkBuddy 的手机端远程连接能力，通过微信或企业微信下达任务；高风险动作仍应要求确认。",
    process:
      "复用建议：远程任务明确文件路径、目标动作和允许范围；先请求诊断或预览，再决定是否执行修改。",
    result:
      "公开反馈确认了微信与企业微信发指令的便利性，但没有公开量化效率指标。",
    improvements:
      "团队应记录远程任务成功率、等待时间、误操作和需要回到电脑处理的比例。",
    category: "项目协作",
    features: ["assistant", "connector"],
    score: 88,
    verificationNote:
      "具名背景和使用方式来自腾讯云官方产品页；本站未采用反馈中与 WorkBuddy 无直接关系的其他产品迁移表述。",
  },
  {
    id: docId("case", "developer-docs"),
    slug: "developer-docs",
    title: "上海教软：非技术产品经理一周完成 Web 应用",
    description:
      "官方用户反馈显示，一名自述不会写代码的产品经理借助 WorkBuddy 在一周内完成 Web 应用。",
    userBackground:
      "公开来源中的反馈者为孙嘉禾，产品经理，所属企业为上海教软。",
    previousWorkflow:
      "反馈称其已有一年多的 Web 应用想法，但官方页面没有披露此前是否外包、原型或尝试过其他工具。",
    painPoints: "没有代码背景时，需求拆解、实现、测试和发布会形成连续门槛。",
    solution:
      "借助 WorkBuddy 内置专家，把业务想法拆成可实现任务，并持续检查中间产物。",
    process:
      "复用建议：先定义最小功能、数据与验收标准；分页面实现并逐一验证；上线前补充安全、隐私、兼容性与备份检查。",
    result:
      "公开反馈称“一周实现”面向客户和母校的 Web 应用；页面未披露代码规模、上线地址或长期维护数据。",
    improvements:
      "后续应记录需求范围、实际工时、缺陷数、上线状态和维护成本，避免只用日历周期判断效率。",
    category: "开发协作",
    features: ["expert", "project", "skill"],
    score: 90,
    verificationNote:
      "人物背景和一周实现来自腾讯云官方产品页；复用流程为本站基于公开能力文档整理。",
  },
];

const recipeUpdates = [
  {
    slug: "ai-daily-news-brief",
    sourceUrl: `${practiceDocs}/Practice-Five`,
    sourceName: "WorkBuddy 官方实践案例",
    cover: "automation",
    goal: "在固定时间收集指定主题信息，筛选、去重并生成带来源链接的简报。",
    audience: ["研究人员", "内容运营", "需要固定情报输入的团队"],
    inputs: ["主题与关键词", "可信来源范围", "发送时间与输出目录"],
    outputs: ["带来源链接的结构化简报", "异常与待核验项"],
    steps:
      "1. 先手动运行一次资讯收集任务，确认来源、格式和篇幅。\n2. 在自动化页面创建任务，填写主题、来源范围、去重规则和输出目录。\n3. 要求每条信息保留原始链接与发布时间，并标记无法交叉验证的内容。\n4. 低频试运行并检查历史记录；稳定后再提高频率或开启消息推送。",
    prompt:
      "请收集过去 24 小时与【主题】相关的重要资讯。只保留可以打开的原始来源，合并重复事件。每条包含：标题、两句摘要、来源、发布时间、原始链接、为什么值得关注。最后列出无法确认的信息；保存到【目录】。",
    notes:
      "无人值守任务可能调用外部模型、连接器和授权凭证。首次配置应低频试运行；涉及发送、写入或删除时保留人工确认。",
    exampleResult:
      "一份可追溯到原始页面的每日简报，并附重复项、失效链接和待核验信息清单。",
  },
  {
    slug: "meeting-notes",
    sourceUrl: `${practiceDocs}/Practice-Ten`,
    sourceName: "WorkBuddy 官方实践案例",
    cover: "firstTask",
    goal: "把会议记录整理为结论、行动项、责任人和截止时间。",
    audience: ["项目经理", "产品团队", "运营团队"],
    inputs: ["会议文字稿或录音转写", "参会人信息", "项目背景"],
    outputs: ["会议摘要", "行动项表格", "未决问题清单"],
    steps:
      "1. 把会议记录与相关项目资料放入同一工作区。\n2. 要求先区分事实、决定、建议和未决问题。\n3. 将行动项输出为表格，并对缺失责任人或日期标记“待确认”。\n4. 人工确认后再写回项目或腾讯文档。",
    prompt:
      "根据会议记录生成纪要：按议题列出结论；行动项必须包含事项、责任人、截止日期和依赖；没有明确给出的字段写“待确认”，不要猜测。最后列出争议点和下次会议需要确认的问题。",
    notes: "录音转写可能误识别人名与数字，发送或回写前必须人工复核。",
    exampleResult: "可直接同步给团队的纪要与责任清晰的行动项表格。",
  },
  {
    slug: "excel-analysis",
    sourceUrl: `${practiceDocs}/Practice-Three`,
    sourceName: "WorkBuddy 官方实践案例",
    cover: "overview",
    goal: "检查表格质量，完成分析与可视化，并保留计算口径。",
    audience: ["运营", "财务", "产品与数据分析人员"],
    inputs: ["原始 Excel/CSV", "字段说明", "分析问题"],
    outputs: ["清洗说明", "关键指标", "图表与结论"],
    steps:
      "1. 复制原文件并明确只读分析或允许修改的范围。\n2. 先输出字段、缺失值、重复值和异常值概览。\n3. 确认指标口径后再计算和绘图。\n4. 随机抽样复算关键数字，并把脚本或公式与结果一起交付。",
    prompt:
      "分析【文件名】。先报告字段类型、缺失、重复和异常，不要修改原文件。等我确认指标口径后，再生成汇总表和图表。每个结论标注使用的字段、筛选条件和计算方法。",
    notes: "关键数字必须抽样复核；不要覆盖原始表格。",
    exampleResult: "包含数据质量、指标口径、可视化、结论与复算方法的分析包。",
  },
  {
    slug: "competitor-analysis",
    sourceUrl: `${officialDocs}/Overview`,
    sourceName: "WorkBuddy 官方文档",
    cover: "overview",
    goal: "围绕明确决策问题收集竞品证据，输出可追溯的比较与建议。",
    audience: ["产品经理", "市场与战略团队", "创业者"],
    inputs: ["竞品名单", "比较维度", "时间范围与目标市场"],
    outputs: ["证据表", "差异矩阵", "结论与待验证假设"],
    steps:
      "1. 先写清这次研究要支持的决策和截止日期。\n2. 为每个竞品使用相同维度，优先官方价格页、文档、公告与产品实测。\n3. 对重要结论至少保留 URL、发布日期和截图；把推断与事实分开。\n4. 输出差异矩阵、机会点、风险和下一轮需要验证的问题。",
    prompt:
      "研究【竞品列表】，目标是支持【决策】。按定位、目标用户、核心功能、价格、渠道、近期变化进行比较。每项事实附原始链接和日期；无法确认的内容标记“待核验”。最后给出 3 个可行动机会与反证条件。",
    notes:
      "搜索摘要不能替代原始页面；定价和功能属于时效信息，必须标注核验日期。",
    exampleResult: "带证据索引的竞品矩阵、决策摘要和后续验证清单。",
  },
  {
    slug: "ppt-from-brief",
    sourceUrl: `${officialDocs}/Overview`,
    sourceName: "WorkBuddy 官方文档",
    cover: "overview",
    goal: "从简报生成逻辑清楚、事实可核验且可继续编辑的演示文稿。",
    audience: ["产品与运营", "咨询顾问", "项目负责人"],
    inputs: ["受众与演示目的", "时长和页数", "品牌素材与事实资料"],
    outputs: ["故事线", "逐页大纲", "可编辑 PPT 与引用清单"],
    steps:
      "1. 先确认受众、场合、演示时长和希望推动的行动。\n2. 让 WorkBuddy 先交付逐页大纲，不要直接美化。\n3. 确认故事线后再生成页面，并提供品牌色、Logo 和图片使用规则。\n4. 检查数字、来源、字体替换、溢出和投影可读性。",
    prompt:
      "基于【资料目录】制作一份面向【受众】的【页数】页演示，目标是【目标】。先只输出故事线与逐页大纲；每页包含一句结论、支持证据和建议视觉。等我确认后再生成可编辑 PPT，并附引用清单。",
    notes: "事实与品牌素材需有授权；生成后必须逐页检查文字溢出和图表口径。",
    exampleResult: "可编辑 PPT、逐页讲稿和全部外部事实/图片的来源清单。",
  },
  {
    slug: "weekly-report",
    sourceUrl: `${functionDocs}/Automation-Guide`,
    sourceName: "WorkBuddy 官方文档",
    cover: "automation",
    goal: "从可信项目记录中生成可核验的周报，并保留人工确认。",
    audience: ["项目经理", "团队负责人", "个人贡献者"],
    inputs: ["本周任务与产物", "风险记录", "下周计划"],
    outputs: ["进展摘要", "风险与依赖", "下周行动项"],
    steps:
      "1. 统一周报的数据来源和统计周期。\n2. 先手动运行，要求每条进展关联任务、文档或产物。\n3. 固定输出结构：结果、风险、依赖、下周计划、待确认。\n4. 稳定后再配置自动化；发送前保留负责人审核。",
    prompt:
      "汇总【日期范围】内【项目/目录】的工作记录，生成周报。每条进展包含结果、证据链接和状态；风险写清影响、负责人和下一动作；未找到证据的内容放入“待确认”，不要补写。",
    notes: "自动生成不等于自动发布。对外发送前应由负责人确认范围与敏感信息。",
    exampleResult: "可回溯到项目记录的周报，以及缺失材料和待确认事项列表。",
  },
  {
    slug: "wechat-content",
    sourceUrl: `${practiceDocs}/Practice-Four`,
    sourceName: "WorkBuddy 官方实践案例",
    cover: "tips",
    goal: "从选题研究到长文草稿建立一条有证据、有审校的内容流程。",
    audience: ["公众号作者", "品牌内容团队", "独立创作者"],
    inputs: ["受众与主题", "参考资料", "品牌语气与禁用项"],
    outputs: ["选题角度", "文章草稿", "事实与版权检查清单"],
    steps:
      "1. 明确目标读者、核心问题和希望读者采取的行动。\n2. 收集一手来源，建立事实卡片并记录链接与日期。\n3. 先完成提纲和论证顺序，再按品牌语气写作。\n4. 发布前检查事实、引用、图片版权、标题承诺与移动端排版。",
    prompt:
      "为【目标读者】写一篇关于【主题】的公众号文章。先给出三个角度和证据需求；我确认后再写提纲与正文。正文只使用已提供或可打开的一手来源，事实附来源，推断明确标注。",
    notes: "不要抓取或改写未授权全文；图片、案例和引语需要确认使用许可。",
    exampleResult:
      "包含标题备选、正文、摘要、配图建议和来源清单的发布前内容包。",
  },
  {
    slug: "github-pr-review",
    sourceUrl: `${functionDocs}/Worktree-Task`,
    sourceName: "WorkBuddy 官方文档",
    cover: "overview",
    goal: "基于实际代码差异和验证结果完成风险优先的代码审查。",
    audience: ["开发者", "技术负责人", "需要并行审查的团队"],
    inputs: ["仓库与目标分支", "PR 差异", "测试与产品约束"],
    outputs: ["按优先级排列的问题", "精确文件位置", "验证建议"],
    steps:
      "1. 确认基线分支、改动范围和验收标准。\n2. 先读 diff 和相关调用链，再运行最小必要测试。\n3. 只报告可以解释影响并能定位的问题，区分缺陷与建议。\n4. 汇总残余风险、未运行测试和需要作者确认的假设。",
    prompt:
      "审查当前分支相对【基线】的改动。优先查找会导致错误结果、数据丢失、安全问题或兼容性回归的缺陷。每条包含严重度、文件与行、触发条件、影响和最小修复建议；列出已运行与未运行的验证。",
    notes: "审查结论必须来自实际 diff 与可重复验证，不要用风格偏好冒充缺陷。",
    exampleResult: "按严重度排序的代码审查意见、测试证据和残余风险摘要。",
  },
];

const guideUpdates = [
  {
    slug: "complete-beginner-guide",
    sourceUrl: `${officialDocs}/Overview`,
    sourceName: "WorkBuddy 官方文档",
    cover: "overview",
    content:
      "## 推荐顺序\n\n1. 阅读官方简介，理解 WorkBuddy 会规划并执行任务，而不只是生成一段回答。\n2. 完成“开启你的第一个任务”，熟悉输入、执行和结果区。\n3. 用一个真实但低风险的小任务练习，明确目标、资料、输出和验收标准。\n4. 再按需要学习项目、技能、连接器、资料库和自动化。\n\n## 第一次任务的验收清单\n\n- 原始文件有备份；\n- 输出路径和格式明确；\n- 事实与数字能回到来源；\n- 未确认内容没有被当成结论；\n- 结果能由人快速检查。",
  },
  {
    slug: "automation-principles",
    sourceUrl: `${functionDocs}/Automation-Guide`,
    sourceName: "WorkBuddy 官方文档",
    cover: "automation",
    content:
      "## 适合自动化的任务\n\n规则明确、重复发生、输入稳定、失败可发现且可回退。日报、周报汇总、定时数据整理是典型例子。\n\n## 上线前四道检查\n\n1. 手动跑通同一提示词。\n2. 使用独立工作目录，不覆盖唯一原件。\n3. 对外发送、文件修改、资金或删除动作保留确认。\n4. 先低频运行，检查日志、耗时和失败状态后再放大。\n\n## 必须记录\n\n任务名称、触发规则、输入范围、输出位置、依赖凭证、负责人、失败后的处理方式和停止条件。",
  },
  {
    slug: "knowledge-base",
    sourceUrl: `${functionDocs}/Library`,
    sourceName: "WorkBuddy 官方文档",
    cover: "library",
    content:
      "## 资料库不是文件堆\n\n官方文档把资料库定位为人和 Agent 的共同产物存放地。MD 负责叙事，CSV 负责数据，HTML 负责呈现；三者可以互相引用。\n\n## 建议目录\n\n- `00-入口与说明`：范围、负责人、更新时间；\n- `10-原始资料`：只读保存并标来源；\n- `20-过程产物`：分析、草稿、审阅；\n- `30-已批准成果`：团队可复用版本；\n- `90-归档`：过期但需要保留的记录。\n\n## 质量规则\n\n每份长期资料至少包含所有者、来源、最后核验日期和适用范围。Agent 修改应可审阅、可回退。",
  },
  {
    slug: "experts-vs-skills-vs-connectors",
    sourceUrl: `${functionDocs}/Expert-Center`,
    sourceName: "WorkBuddy 官方文档",
    cover: "skills",
    content:
      "## 一句话区分\n\n- **专家**：稳定的领域角色、判断方式与协作分工；\n- **技能**：为特定任务封装的脚本、工具和工作流；\n- **连接器**：让 WorkBuddy 在授权下访问外部服务与数据。\n\n## 怎么选\n\n只需要稳定判断框架时先用专家；需要重复执行具体操作时用技能；必须读写邮箱、文档或业务系统时才接连接器。复杂任务可以组合三者，但依赖越多，权限、失败恢复和审计成本越高。\n\n## 上线检查\n\n核验发布者、许可证、依赖、凭证保存方式、最小权限、外部数据共享和高风险操作确认。",
  },
  {
    slug: "prompt-best-practices",
    sourceUrl: `${officialDocs}/From-Beginner-to-Expert-Guide/Efficient-Tips`,
    sourceName: "WorkBuddy 官方文档",
    cover: "tips",
    content:
      "## 四段式任务说明\n\n1. **目标**：要解决什么问题，给谁使用。\n2. **输入**：文件、目录、链接和已有事实。\n3. **约束**：范围、时间、权限、禁用动作和格式。\n4. **验收**：什么结果算完成，如何检查。\n\n## 推荐写法\n\n先要求 WorkBuddy 复述目标和缺失信息；复杂任务先给计划，得到确认后执行；对数字、引用和外部事实要求保留来源；文件操作先备份并限定目录。\n\n## 避免\n\n不要把多个互不相关的目标塞进一次任务，也不要让“看起来合理”替代证据和验收。",
  },
  {
    slug: "projects-vs-assistants",
    sourceUrl: `${functionDocs}/Project`,
    sourceName: "WorkBuddy 官方文档",
    cover: "assistant",
    content:
      "## 使用项目\n\n任务会持续数天或数周、需要固定工作目录、共享文件和长期上下文时，建立项目。项目适合产品研究、内容栏目、开发与团队交付。\n\n## 使用助理\n\n需要从微信、企微、QQ、钉钉或飞书远程发起任务、查看执行记录时，使用助理。官方说明提醒：助理使用固定专属文件夹并保留完整会话历史。\n\n## 决策规则\n\n先问三个问题：是否需要长期上下文？是否需要固定文件空间？是否主要从手机远程触发？前两项为是选项目，第三项为是选助理；需要时可以组合，但要明确文件位置与权限边界。",
  },
];

const useCaseUpdates = [
  {
    slug: "ppt",
    sourceUrl: `${officialDocs}/Overview`,
    sourceName: "WorkBuddy 官方文档",
    cover: "overview",
    quickStart:
      "准备受众、目标、时长、页数和可信资料；先让 WorkBuddy 输出逐页大纲，确认故事线后再生成可编辑 PPT。",
    prompts: [
      "基于【资料目录】为【受众】制作【页数】页演示，目标是【目标】。先输出逐页大纲，每页包含一句结论、证据和建议视觉；我确认后再生成 PPT。",
    ],
    advanced:
      "加入品牌色、字体和图片授权规则；交付前逐页检查数字来源、文字溢出、图表口径与投影可读性。",
  },
  {
    slug: "excel",
    sourceUrl: `${practiceDocs}/Practice-Three`,
    sourceName: "WorkBuddy 官方实践案例",
    cover: "overview",
    quickStart:
      "复制原文件，先让 WorkBuddy 只读检查字段、缺失、重复和异常；确认指标口径后再计算和绘图。",
    prompts: [
      "只读分析【文件名】。先报告字段类型、缺失值、重复值和异常值，不要修改原文件；等待我确认口径后再生成汇总表和图表。",
    ],
    advanced:
      "把清洗规则、公式或脚本与结果一同交付；对关键数字做抽样复算，并记录筛选条件和版本。",
  },
  {
    slug: "research",
    sourceUrl: `${officialDocs}/Overview`,
    sourceName: "WorkBuddy 官方文档",
    cover: "overview",
    quickStart:
      "把宽泛主题改写成一个决策问题，规定时间范围、地区、来源优先级和输出结构，再开始搜索。",
    prompts: [
      "研究【问题】，用于支持【决策】。优先官方文件和一手来源；每个关键结论附链接与日期，区分事实、推断和待核验项。",
    ],
    advanced:
      "为重要结论寻找独立来源交叉验证，建立证据表，并在结论中说明样本、时效和反证条件。",
  },
  {
    slug: "content-creation",
    sourceUrl: `${practiceDocs}/Practice-Four`,
    sourceName: "WorkBuddy 官方实践案例",
    cover: "tips",
    quickStart:
      "明确目标读者、核心问题和行动目标；先做选题与证据卡，再确认提纲，最后进入写作。",
    prompts: [
      "围绕【主题】为【读者】设计三个内容角度。每个角度列出核心观点、需要的一手证据、可能反对意见和预期行动；不要直接写正文。",
    ],
    advanced:
      "把品牌语气、禁用项、事实核查和版权检查沉淀为模板；发布动作继续保留人工确认。",
  },
  {
    slug: "development",
    sourceUrl: `${functionDocs}/Worktree-Task`,
    sourceName: "WorkBuddy 官方文档",
    cover: "overview",
    quickStart:
      "先让 WorkBuddy 读取仓库说明和测试方式，确认需求、影响范围与验收标准，再在隔离分支或工作树中实现。",
    prompts: [
      "先检查仓库结构和项目规范，解释【需求】会影响哪些模块，给出实施与验证计划；在我确认前不要修改文件。",
    ],
    advanced:
      "并行任务使用独立 worktree；提交前运行类型检查与相关测试，汇总变更、验证证据和残余风险。",
  },
  {
    slug: "daily-briefing",
    sourceUrl: `${practiceDocs}/Practice-Five`,
    sourceName: "WorkBuddy 官方实践案例",
    cover: "automation",
    quickStart:
      "先手动生成一份带原始链接的简报，确认来源、去重、篇幅和排序规则后再创建自动化。",
    prompts: [
      "汇总过去 24 小时【主题】资讯。合并重复事件，每条给出摘要、来源、发布时间、原始链接和关注理由；无法确认的内容单独列出。",
    ],
    advanced:
      "为失效链接、零结果和执行超时设置可见状态；低频试运行稳定后再开启消息推送。",
  },
  {
    slug: "weekly-report",
    sourceUrl: `${functionDocs}/Automation-Guide`,
    sourceName: "WorkBuddy 官方文档",
    cover: "automation",
    quickStart:
      "统一统计周期与资料来源，按结果、风险、依赖、下周计划和待确认项生成周报。",
    prompts: [
      "汇总【日期范围】的项目记录。每条进展关联任务或产物；风险包含影响、负责人和下一动作；没有证据的内容标为待确认。",
    ],
    advanced:
      "稳定后配置定时生成，但不要默认自动对外发送；记录缺失材料、重试和负责人复核结果。",
  },
  {
    slug: "wechat",
    sourceUrl: `${practiceDocs}/Practice-Four`,
    sourceName: "WorkBuddy 官方实践案例",
    cover: "tips",
    quickStart:
      "以一个明确读者问题为起点，先核验素材与来源，再生成提纲、正文和移动端排版建议。",
    prompts: [
      "为【目标读者】写【主题】公众号文章。先给出提纲与证据缺口；只使用可追溯来源，推断明确标注，发布前列出事实与版权检查。",
    ],
    advanced:
      "用资料库维护选题、事实卡和已批准素材；把品牌语气与审核清单做成可复用 Skill。",
  },
  {
    slug: "video",
    sourceUrl: `${functionDocs}/Design-Idea`,
    sourceName: "WorkBuddy 官方文档",
    cover: "overview",
    quickStart:
      "先确定平台、时长、受众和单一核心信息，再生成口播稿与分镜，不要直接从模糊主题开始渲染。",
    prompts: [
      "把【材料】改写为【时长】视频方案，面向【受众】。输出节拍化口播稿、逐镜分镜、画面素材需求和字幕重点，并标记需要授权的素材。",
    ],
    advanced:
      "对旁白时长、字幕同步、品牌一致性、音乐和图片授权做独立验收；发布前导出低清样片检查。",
  },
  {
    slug: "files",
    sourceUrl: `${practiceDocs}/Practice-One`,
    sourceName: "WorkBuddy 官方实践案例",
    cover: "firstTask",
    quickStart:
      "复制少量样本到独立目录，先让 WorkBuddy 输出分类和重命名预览，确认后才批量执行。",
    prompts: [
      "扫描【目录】并生成操作预览：当前路径、建议分类、建议新名称和理由。不要移动、覆盖或删除文件；等我确认清单后再执行。",
    ],
    advanced:
      "为同名冲突、未知格式和低置信度文件设置隔离区；保留原路径映射与可回退记录。",
  },
  {
    slug: "developer",
    sourceUrl: `${functionDocs}/Worktree-Task`,
    sourceName: "WorkBuddy 官方文档",
    cover: "overview",
    quickStart:
      "提供仓库、需求、基线分支和验收命令；先读项目规范与相关代码，再决定实现路径。",
    prompts: [
      "实现【需求】。先阅读仓库规范和相关模块，说明假设、影响范围与验证计划；保持改动最小，不覆盖无关的未提交修改。",
    ],
    advanced:
      "把实现、测试、审查和文档同步拆成可验证阶段；高风险迁移先备份并准备回退方案。",
  },
];

async function uploadScreenshots() {
  const uploaded = new Map<string, ImageReference>();

  for (const [key, screenshot] of Object.entries(screenshotSources)) {
    const path = resolve(screenshotDirectory, screenshot.file);
    if (!existsSync(path)) {
      console.warn(`截图不存在，跳过：${path}`);
      continue;
    }

    let asset = await client.fetch<{ _id: string } | null>(
      `*[_type == "sanity.imageAsset" && originalFilename == $filename] | order(_createdAt desc)[0]{_id}`,
      { filename: screenshot.file },
    );
    if (!asset?._id) {
      asset = await client.assets.upload("image", createReadStream(path), {
        filename: screenshot.file,
        title: screenshot.title,
      });
    }

    uploaded.set(key, {
      _type: "image",
      asset: ref(asset._id),
      alt: screenshot.title,
      sourceUrl: screenshot.sourceUrl,
    });
  }

  return uploaded;
}

async function uploadBrandImages() {
  const uploaded = new Map<string, ImageReference>();

  for (const [key, image] of Object.entries(brandImageSources)) {
    if (!existsSync(image.path)) {
      console.warn(`品牌图片不存在，跳过：${image.path}`);
      continue;
    }

    let asset = await client.fetch<{ _id: string } | null>(
      `*[_type == "sanity.imageAsset" && originalFilename == $filename] | order(_createdAt desc)[0]{_id}`,
      { filename: image.file },
    );
    if (!asset?._id) {
      asset = await client.assets.upload(
        "image",
        createReadStream(image.path),
        {
          filename: image.file,
          title: image.title,
        },
      );
    }

    uploaded.set(key, {
      _type: "image",
      asset: ref(asset._id),
      alt: image.title,
      sourceUrl: image.sourceUrl,
    });
  }

  return uploaded;
}

async function verifyLinks() {
  const results: Array<{
    name: string;
    url: string;
    status?: number;
    ok: boolean;
    error?: string;
  }> = [];

  for (const resource of resources) {
    try {
      const response = await fetch(resource.url, {
        method: "GET",
        redirect: "follow",
        signal: AbortSignal.timeout(15_000),
        headers: { "user-agent": "WorkBuddyHub-LinkCheck/1.0" },
      });
      results.push({
        name: resource.name,
        url: resource.url,
        status: response.status,
        ok: response.ok,
      });
    } catch (error) {
      results.push({
        name: resource.name,
        url: resource.url,
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const failures = results.filter((result) => !result.ok);
  console.log(
    JSON.stringify(
      {
        checked: results.length,
        passed: results.length - failures.length,
        failed: failures.length,
        failures,
      },
      null,
      2,
    ),
  );
  if (failures.length) process.exitCode = 1;
}

async function main() {
  const images = await uploadScreenshots();
  const brandImages = await uploadBrandImages();
  const transaction = client.transaction();

  for (const brandAsset of brandAssets) {
    const image =
      brandAsset.imageGroup === "brand"
        ? brandImages.get(brandAsset.imageKey)
        : images.get(brandAsset.imageKey);
    if (!image) {
      throw new Error(`品牌素材缺少图片：${brandAsset.title}`);
    }

    transaction.createOrReplace({
      _id: docId("brand-asset", brandAsset.slug),
      _type: "brandAsset",
      title: brandAsset.title,
      slug: { _type: "slug", current: brandAsset.slug },
      description: brandAsset.description,
      assetType: brandAsset.assetType,
      image,
      sourceUrl: brandAsset.sourceUrl,
      sourceName: brandAsset.sourceName,
      sourceKind: brandAsset.sourceKind,
      usageNotes: brandAsset.usageNotes,
      rightsNote: brandAsset.rightsNote,
      sourceCheckedAt: checkedAt,
      status: "published",
      featured: brandAsset.featured,
    });
  }

  for (const resource of resources) {
    const scoreBreakdown = resource.scoreBreakdown || defaultCommunityScore;
    transaction.createOrReplace({
      _id: docId("resource", resource.slug),
      _type: "item",
      name: resource.name,
      slug: { _type: "slug", current: resource.slug },
      description: resource.description,
      summary: resource.description,
      introduction: `## 为什么值得读\n\n${resource.description}\n\n## 读完就做\n\n${resource.learning.map((item) => `- ${item}`).join("\n")}\n\n## 来源与核验\n\n来源：${resource.sourceName}\n\n本站最后核验：2026-09-12。请通过“访问原始资源”查看最新版本。`,
      link: resource.url,
      creator: resource.sourceName,
      sourceName: resource.sourceName,
      sourceKind: resource.sourceKind,
      verificationNote:
        resource.verificationNote ||
        "链接、标题与页面可访问性已于 2026-09-12 核验；产品界面和功能可能继续更新。",
      resourceType: resource.resourceType,
      difficulty: resource.difficulty,
      language: "chinese",
      duration: resource.duration,
      scoreBreakdown,
      score: scoreTotal(scoreBreakdown),
      lastChecked: checkedAt,
      outdated: false,
      hubFeatures: resource.features.map((slug) =>
        keyedRef(docId("feature", slug)),
      ),
      categories: [keyedRef(docId("category", resource.category))],
      tags: resource.tags.map((slug) => keyedRef(docId("tag", slug))),
      collections: (resource.collections || []).map((slug) =>
        keyedRef(docId("collection", slug)),
      ),
      image: resource.screenshot ? images.get(resource.screenshot) : undefined,
      publishDate: checkedAt,
      featured: resource.featured || false,
      forceHidden: false,
      paid: false,
      pricePlan: "free",
      freePlanStatus: "approved",
    });
  }

  for (const study of caseStudies) {
    transaction.createOrReplace({
      _id: study.id,
      _type: "caseStudy",
      title: study.title,
      slug: { _type: "slug", current: study.slug },
      description: study.description,
      userBackground: study.userBackground,
      previousWorkflow: study.previousWorkflow,
      painPoints: study.painPoints,
      solution: study.solution,
      process: study.process,
      result: study.result,
      improvements: study.improvements,
      difficulty: "intermediate",
      category: study.category,
      features: study.features.map((slug) => keyedRef(docId("feature", slug))),
      tags: [keyedRef(docId("tag", "workflow"))],
      status: "published",
      featured: true,
      score: study.score,
      icon: "chart",
      updatedAt: checkedAt,
      sourceUrl: "https://cloud.tencent.com/product/workbuddy",
      sourceName: "腾讯云 WorkBuddy 官方产品页",
      sourceKind: "official",
      sourceCheckedAt: checkedAt,
      verificationNote: study.verificationNote,
      coverImage: images.get("product"),
    });
  }

  for (const recipe of recipeUpdates) {
    const { slug, cover, ...fields } = recipe;
    transaction.patch(docId("recipe", recipe.slug), (patch) =>
      patch.set({
        ...fields,
        slug: { _type: "slug", current: slug },
        sourceKind: "official",
        sourceCheckedAt: checkedAt,
        verificationNote:
          "步骤由本站依据所列官方实践页面整理；页面未公开的业务数据不作推断。",
        coverImage: images.get(cover),
        updatedAt: checkedAt,
      }),
    );
  }

  for (const guide of guideUpdates) {
    const { slug, cover, ...fields } = guide;
    transaction.patch(docId("guide", guide.slug), (patch) =>
      patch.set({
        ...fields,
        slug: { _type: "slug", current: slug },
        sourceKind: "official",
        sourceCheckedAt: checkedAt,
        verificationNote:
          "正文为本站基于所列官方文档的可执行整理，功能与界面以官方最新版本为准。",
        coverImage: images.get(cover),
        updatedAt: checkedAt,
      }),
    );
  }

  for (const useCase of useCaseUpdates) {
    const { slug, cover, ...fields } = useCase;
    transaction.patch(docId("use-case", slug), (patch) =>
      patch.set({
        ...fields,
        slug: { _type: "slug", current: slug },
        sourceKind: "official",
        sourceCheckedAt: checkedAt,
        verificationNote:
          "操作建议由本站依据所列官方页面整理；实际界面、权限与可用能力以当前客户端为准。",
        coverImage: images.get(cover),
        updatedAt: checkedAt,
      }),
    );
  }

  await transaction.commit({ returnDocuments: false });

  const audit = await client.fetch<{
    resources: number;
    sourcedResources: number;
    screenshotResources: number;
    verifiedCases: number;
    sourcedRecipes: number;
    sourcedGuides: number;
    sourcedUseCases: number;
    brandAssets: number;
    completeBrandAssets: number;
  }>(`{
    "resources": count(*[_type == "item" && _id match "workbuddy.resource.*" && forceHidden != true && defined(publishDate)]),
    "sourcedResources": count(*[_type == "item" && _id match "workbuddy.resource.*" && defined(link) && defined(sourceName) && defined(lastChecked)]),
    "screenshotResources": count(*[_type == "item" && _id match "workbuddy.resource.*" && defined(image.asset)]),
    "verifiedCases": count(*[_type == "caseStudy" && _id match "workbuddy.case.*" && defined(sourceUrl) && defined(verificationNote)]),
    "sourcedRecipes": count(*[_type == "recipe" && _id match "workbuddy.recipe.*" && defined(sourceUrl) && defined(verificationNote)]),
    "sourcedGuides": count(*[_type == "guide" && _id match "workbuddy.guide.*" && defined(sourceUrl) && defined(verificationNote)]),
    "sourcedUseCases": count(*[_type == "useCase" && _id match "workbuddy.use-case.*" && defined(sourceUrl) && defined(verificationNote)]),
    "brandAssets": count(*[_type == "brandAsset" && _id match "workbuddy.brand-asset.*"]),
    "completeBrandAssets": count(*[_type == "brandAsset" && _id match "workbuddy.brand-asset.*" && status == "published" && defined(image.asset) && defined(usageNotes) && defined(rightsNote)])
  }`);

  console.log(
    JSON.stringify(
      {
        projectId,
        dataset,
        curatedResources: resources.length,
        uploadedOrReusedScreenshots: images.size,
        uploadedOrReusedBrandImages: brandImages.size,
        brandAssets: brandAssets.length,
        caseStudies: caseStudies.length,
        enrichedRecipes: recipeUpdates.length,
        enrichedGuides: guideUpdates.length,
        enrichedUseCases: useCaseUpdates.length,
        audit,
      },
      null,
      2,
    ),
  );
}

const command = process.argv.includes("--check-links") ? verifyLinks : main;

command().catch((error) => {
  console.error("WorkBuddy Hub curation failed:", error);
  process.exitCode = 1;
});
