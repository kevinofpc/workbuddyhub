export type HubIcon =
  | "bot"
  | "folder"
  | "user"
  | "wand"
  | "link"
  | "timer"
  | "database"
  | "presentation"
  | "sheet"
  | "search"
  | "file"
  | "pen"
  | "video"
  | "code"
  | "mail"
  | "chart";

export type HubItem = {
  slug: string;
  title: string;
  description: string;
  icon: HubIcon;
  category: string;
  difficulty: "入门" | "初级" | "中级" | "高级";
  feature: string[];
  time?: string;
  score?: number;
  views?: string;
  sourceUrl?: string;
  sourceName?: string;
  sourceKind?: "official" | "community" | "editorial";
  creator?: string;
  verificationNote?: string;
  updatedAt?: string;
  language?: "中文" | "英文" | "双语";
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
};

export const categoryDefinitions = [
  {
    slug: "getting-started",
    title: "新手入门",
    description: "从核心概念到第一次完整实践。",
    icon: "wand" as const,
    keywords: ["入门", "基础", "官方"],
  },
  {
    slug: "automation",
    title: "自动化实践",
    description: "定时、触发与多步骤工作流。",
    icon: "timer" as const,
    keywords: ["自动化", "工作流", "连接器"],
  },
  {
    slug: "research",
    title: "研究与检索",
    description: "搜索、整理、分析并形成可信结论。",
    icon: "search" as const,
    keywords: ["研究", "检索", "分析", "资料库"],
  },
  {
    slug: "content",
    title: "内容创作",
    description: "从选题、写作到多渠道发布。",
    icon: "pen" as const,
    keywords: ["内容", "写作", "公众号", "视频"],
  },
  {
    slug: "office",
    title: "办公效率",
    description: "文档、表格、演示与日常协作。",
    icon: "presentation" as const,
    keywords: ["办公", "表格", "PPT", "周报"],
  },
  {
    slug: "development",
    title: "开发协作",
    description: "代码、需求、测试与技术文档。",
    icon: "code" as const,
    keywords: ["开发", "代码", "API", "技术"],
  },
];

export const tagDefinitions = [
  { slug: "automation", title: "自动化" },
  { slug: "workflow", title: "工作流" },
  { slug: "connector", title: "连接器" },
  { slug: "beginner", title: "新手入门" },
  { slug: "research", title: "深度研究" },
  { slug: "writing", title: "内容写作" },
  { slug: "presentation", title: "PPT" },
  { slug: "spreadsheet", title: "表格" },
  { slug: "knowledge", title: "资料库" },
  { slug: "prompt", title: "Prompt" },
  { slug: "api", title: "API" },
  { slug: "template", title: "模板" },
];

export const collectionDefinitions = [
  {
    slug: "starter-kit",
    title: "WorkBuddy 新手必学",
    description: "用最短路径理解核心能力，并完成第一次真实任务。",
    icon: "wand" as const,
    query: "入门",
  },
  {
    slug: "automation-playbook",
    title: "自动化实战手册",
    description: "从定时任务到跨工具协作的可复用方法。",
    icon: "timer" as const,
    query: "自动化",
  },
  {
    slug: "creator-toolkit",
    title: "内容创作者工具箱",
    description: "选题、研究、写作、视觉和发布的完整链路。",
    icon: "pen" as const,
    query: "内容",
  },
  {
    slug: "research-stack",
    title: "Research 最佳实践",
    description: "提高资料发现、证据判断和报告产出的可靠性。",
    icon: "search" as const,
    query: "研究",
  },
];

export const features = [
  {
    slug: "assistant",
    title: "助手",
    description: "适合快速发起、即时交付的单次任务",
    icon: "bot" as const,
    tint: "violet",
  },
  {
    slug: "project",
    title: "项目",
    description: "组织长期工作、文件与持续上下文",
    icon: "folder" as const,
    tint: "amber",
  },
  {
    slug: "expert",
    title: "专家",
    description: "为任务引入稳定的角色判断与方法论",
    icon: "user" as const,
    tint: "blue",
  },
  {
    slug: "skill",
    title: "技能",
    description: "完成某个具体操作的标准化能力",
    icon: "wand" as const,
    tint: "purple",
  },
  {
    slug: "connector",
    title: "连接器",
    description: "连接邮箱、文档与外部业务系统",
    icon: "link" as const,
    tint: "cyan",
  },
  {
    slug: "automation",
    title: "自动化",
    description: "让任务按计划或条件自动运行",
    icon: "timer" as const,
    tint: "green",
  },
  {
    slug: "knowledge",
    title: "资料库",
    description: "沉淀可长期复用的知识与素材",
    icon: "database" as const,
    tint: "emerald",
  },
];

export const goals = [
  {
    slug: "ppt",
    title: "做 PPT",
    description: "从大纲到专业演示文稿",
    icon: "presentation" as const,
    color: "orange",
  },
  {
    slug: "excel",
    title: "分析 Excel",
    description: "清洗数据并生成洞察",
    icon: "sheet" as const,
    color: "emerald",
  },
  {
    slug: "research",
    title: "做竞品研究",
    description: "收集信息并输出结构化报告",
    icon: "search" as const,
    color: "blue",
  },
  {
    slug: "weekly-report",
    title: "生成周报",
    description: "整合工作进展，自动成稿",
    icon: "file" as const,
    color: "violet",
  },
  {
    slug: "wechat",
    title: "写公众号",
    description: "选题、写作、排版一站完成",
    icon: "pen" as const,
    color: "green",
  },
  {
    slug: "video",
    title: "做视频",
    description: "从文章到脚本与成片",
    icon: "video" as const,
    color: "red",
  },
  {
    slug: "files",
    title: "自动整理文件",
    description: "分类、重命名与归档",
    icon: "folder" as const,
    color: "amber",
  },
  {
    slug: "developer",
    title: "写代码",
    description: "研究、开发与代码审查",
    icon: "code" as const,
    color: "blue",
  },
];

export const recipes: HubItem[] = [
  {
    slug: "ai-daily-news-brief",
    title: "自动生成每日 AI 新闻简报",
    description: "自动收集、筛选与摘要 AI 领域最新资讯，并按时发送到邮箱。",
    icon: "mail",
    category: "自动化",
    difficulty: "入门",
    feature: ["自动化", "连接器", "Web"],
    time: "15 分钟",
    score: 98,
    views: "12.3k",
  },
  {
    slug: "weekly-report",
    title: "自动生成周报",
    description: "从项目与文档中汇总本周进展，一键生成结构清晰的工作周报。",
    icon: "file",
    category: "办公",
    difficulty: "入门",
    feature: ["项目", "自动化"],
    time: "10 分钟",
    score: 97,
    views: "9.8k",
  },
  {
    slug: "competitor-analysis",
    title: "自动竞品分析",
    description: "抓取竞品信息，比较功能、定价与定位，生成研究报告。",
    icon: "search",
    category: "研究",
    difficulty: "中级",
    feature: ["专家", "连接器", "技能"],
    time: "25 分钟",
    score: 96,
    views: "8.7k",
  },
  {
    slug: "ppt-from-brief",
    title: "自动制作 PPT",
    description: "基于主题自动完成大纲、内容、版式与演示文稿导出。",
    icon: "presentation",
    category: "办公",
    difficulty: "初级",
    feature: ["助手", "项目", "技能"],
    time: "12 分钟",
    score: 96,
    views: "7.6k",
  },
  {
    slug: "meeting-notes",
    title: "会议纪要整理",
    description: "从录音或文字记录中提取结论、待办事项和责任人。",
    icon: "file",
    category: "办公",
    difficulty: "入门",
    feature: ["助手", "技能"],
    time: "5 分钟",
    score: 94,
    views: "6.4k",
  },
  {
    slug: "wechat-content",
    title: "公众号内容生产",
    description: "完成选题研究、资料整理、长文写作与发布前检查。",
    icon: "pen",
    category: "内容",
    difficulty: "中级",
    feature: ["项目", "专家", "技能"],
    time: "30 分钟",
    score: 95,
    views: "5.9k",
  },
  {
    slug: "excel-analysis",
    title: "Excel 数据分析",
    description: "自动识别表格结构、发现异常并生成图表与分析结论。",
    icon: "sheet",
    category: "办公",
    difficulty: "初级",
    feature: ["助手", "技能"],
    time: "8 分钟",
    score: 95,
    views: "8.1k",
  },
  {
    slug: "github-pr-review",
    title: "GitHub PR Review",
    description: "检查代码变更、识别风险并给出可执行的审查建议。",
    icon: "code",
    category: "开发",
    difficulty: "中级",
    feature: ["专家", "连接器"],
    time: "10 分钟",
    score: 93,
    views: "4.8k",
  },
];

export const guides: HubItem[] = [
  {
    slug: "complete-beginner-guide",
    title: "WorkBuddy 完全入门指南",
    description: "从第一次打开 WorkBuddy 到独立完成复杂任务的系统指南。",
    icon: "file",
    category: "入门",
    difficulty: "入门",
    feature: ["全部功能"],
    time: "18 分钟",
  },
  {
    slug: "experts-vs-skills-vs-connectors",
    title: "专家 vs 技能 vs 连接器",
    description: "一篇讲清三者的定位、区别、典型场景与推荐搭配。",
    icon: "link",
    category: "基础概念",
    difficulty: "初级",
    feature: ["专家", "技能", "连接器"],
    time: "8 分钟",
  },
  {
    slug: "automation-principles",
    title: "自动化任务设计原则",
    description: "如何设计稳定、可观察、可恢复的自动化任务。",
    icon: "timer",
    category: "自动化",
    difficulty: "中级",
    feature: ["自动化"],
    time: "12 分钟",
  },
  {
    slug: "prompt-best-practices",
    title: "WorkBuddy Prompt 最佳实践",
    description: "用目标、上下文、约束和验收标准写出高质量指令。",
    icon: "pen",
    category: "效率",
    difficulty: "初级",
    feature: ["助手", "专家"],
    time: "10 分钟",
  },
  {
    slug: "projects-vs-assistants",
    title: "项目 vs 助手",
    description: "判断什么时候直接开任务，什么时候应该建立长期项目。",
    icon: "folder",
    category: "基础概念",
    difficulty: "入门",
    feature: ["助手", "项目"],
    time: "6 分钟",
  },
  {
    slug: "knowledge-base",
    title: "资料库最佳实践",
    description: "组织长期知识，避免重复、过期和上下文污染。",
    icon: "database",
    category: "知识管理",
    difficulty: "中级",
    feature: ["资料库", "项目"],
    time: "14 分钟",
  },
];

export const cases: HubItem[] = [
  {
    slug: "competitor-analysis-pm-process",
    title: "捷顺科技：把 WorkBuddy 推广到 15 个部门",
    description: "腾讯云官方产品页公开的跨部门推广反馈与可复用落地方法。",
    icon: "chart",
    category: "团队落地",
    difficulty: "中级",
    feature: ["项目", "专家", "技能"],
    score: 92,
    sourceUrl: "https://cloud.tencent.com/product/workbuddy",
    sourceName: "腾讯云 WorkBuddy 官方产品页",
    sourceKind: "official",
    updatedAt: "2026-09-12T00:00:00.000Z",
    userBackground: "公开反馈者为赵婉清，产品经理，所属企业为捷顺科技。",
    result:
      "可确认的公开结果是向 15 个部门推广应用；官方页面未披露活跃率或节省工时。",
    verificationNote:
      "具名背景与推广范围来自腾讯云官方产品页，流程建议为本站编辑整理。",
  },
  {
    slug: "content-studio",
    title: "麦芽传媒：办公场景单环节提效 90% 以上",
    description:
      "公开反馈涵盖 PPT、文档数据分析和图片设计，并明确提到重试与卡顿。",
    icon: "pen",
    category: "内容与办公",
    difficulty: "中级",
    feature: ["项目", "技能", "专家"],
    score: 94,
    sourceUrl: "https://cloud.tencent.com/product/workbuddy",
    sourceName: "腾讯云 WorkBuddy 官方产品页",
    sourceKind: "official",
    updatedAt: "2026-09-12T00:00:00.000Z",
    userBackground: "公开反馈者为周文博，产品运营，所属企业为麦芽传媒。",
    result:
      "公开反馈称单个环节提效在 90% 以上，同时说明有时会出现报错重试和卡顿。",
    verificationNote:
      "效率数字与局限均来自官方公开反馈，不代表完整流程或所有团队的通用结果。",
  },
  {
    slug: "sales-daily",
    title: "奔驰项目团队：用手机远程衔接电脑任务",
    description: "通过微信、企业微信向 WorkBuddy 发指令的官方公开使用反馈。",
    icon: "search",
    category: "项目协作",
    difficulty: "初级",
    feature: ["助手", "连接器"],
    score: 88,
    sourceUrl: "https://cloud.tencent.com/product/workbuddy",
    sourceName: "腾讯云 WorkBuddy 官方产品页",
    sourceKind: "official",
    updatedAt: "2026-09-12T00:00:00.000Z",
    userBackground: "公开反馈者为陈昊然，项目经理，所属企业标注为奔驰公司。",
    result: "公开反馈确认了微信与企业微信发指令的便利性，未披露量化效率。",
    verificationNote: "具名背景与使用方式来自腾讯云官方产品页。",
  },
  {
    slug: "developer-docs",
    title: "上海教软：非技术产品经理一周完成 Web 应用",
    description: "公开用户反馈中的非技术人员 Web 应用实践与证据边界。",
    icon: "code",
    category: "开发协作",
    difficulty: "高级",
    feature: ["项目", "专家", "技能"],
    score: 90,
    sourceUrl: "https://cloud.tencent.com/product/workbuddy",
    sourceName: "腾讯云 WorkBuddy 官方产品页",
    sourceKind: "official",
    updatedAt: "2026-09-12T00:00:00.000Z",
    userBackground: "公开反馈者为孙嘉禾，产品经理，所属企业为上海教软。",
    result: "公开反馈称借助 WorkBuddy 在一周内实现面向客户和母校的 Web 应用。",
    verificationNote:
      "官方页面未披露代码规模、上线地址或长期维护数据，本站不作额外推断。",
  },
];

export const useCases: HubItem[] = [
  {
    slug: "ppt",
    title: "WorkBuddy 做 PPT",
    description: "从大纲到页面表达，快速完成专业演示文稿。",
    icon: "presentation",
    category: "办公",
    difficulty: "入门",
    feature: ["助手", "项目", "技能"],
  },
  {
    slug: "excel",
    title: "WorkBuddy 分析 Excel",
    description: "让复杂表格快速变成清晰洞察和可视化结论。",
    icon: "sheet",
    category: "办公",
    difficulty: "初级",
    feature: ["助手", "技能"],
  },
  {
    slug: "research",
    title: "WorkBuddy 做深度研究",
    description: "从问题拆解、信息收集到证据驱动的研究报告。",
    icon: "search",
    category: "研究",
    difficulty: "中级",
    feature: ["项目", "专家", "连接器"],
  },
  {
    slug: "content-creation",
    title: "WorkBuddy 做内容",
    description: "建立从选题、研究、写作到分发的内容系统。",
    icon: "pen",
    category: "内容",
    difficulty: "中级",
    feature: ["项目", "专家", "技能"],
  },
  {
    slug: "development",
    title: "WorkBuddy 辅助开发",
    description: "处理需求、研究方案、编写代码、审查与维护文档。",
    icon: "code",
    category: "开发",
    difficulty: "中级",
    feature: ["项目", "专家", "连接器"],
  },
  {
    slug: "daily-briefing",
    title: "WorkBuddy 每日简报",
    description: "把分散信息变成每天准时送达的个人情报流。",
    icon: "mail",
    category: "自动化",
    difficulty: "初级",
    feature: ["自动化", "连接器"],
  },
  {
    slug: "weekly-report",
    title: "WorkBuddy 生成周报",
    description: "自动汇总进展、风险与下周计划，减少重复整理。",
    icon: "file",
    category: "办公",
    difficulty: "入门",
    feature: ["项目", "自动化"],
  },
  {
    slug: "wechat",
    title: "WorkBuddy 写公众号",
    description: "从选题调研到长文写作，建立稳定的内容生产流程。",
    icon: "pen",
    category: "内容",
    difficulty: "中级",
    feature: ["项目", "专家", "技能"],
  },
  {
    slug: "video",
    title: "WorkBuddy 做视频",
    description: "把文章或想法转成脚本、分镜、旁白与视频素材。",
    icon: "video",
    category: "内容",
    difficulty: "中级",
    feature: ["项目", "技能"],
  },
  {
    slug: "files",
    title: "WorkBuddy 整理文件",
    description: "批量识别、分类、重命名并归档本地文件。",
    icon: "folder",
    category: "效率",
    difficulty: "初级",
    feature: ["助手", "技能"],
  },
  {
    slug: "developer",
    title: "WorkBuddy 辅助写代码",
    description: "从需求理解、技术研究到实现、测试与代码审查。",
    icon: "code",
    category: "开发",
    difficulty: "中级",
    feature: ["项目", "专家", "连接器"],
  },
];

export const resources: HubItem[] = [
  {
    slug: "official-docs",
    title: "WorkBuddy 官方文档总览",
    description: "覆盖入门、任务、专家、技能、连接器、资料库与自动化。",
    icon: "file",
    category: "官方文档",
    difficulty: "入门",
    feature: ["全部功能"],
    score: 96,
    sourceUrl: "https://www.workbuddy.cn/docs/workbuddy/Overview",
    sourceName: "WorkBuddy 官方文档",
    sourceKind: "official",
    updatedAt: "2026-09-12T00:00:00.000Z",
  },
  {
    slug: "best-practice-guide",
    title: "WorkBuddy 10 个官方上手技巧",
    description: "需求表达、任务拆解、文件备份、结果检查与自动化建议。",
    icon: "wand",
    category: "指南",
    difficulty: "入门",
    feature: ["助手", "项目"],
    score: 96,
    sourceUrl:
      "https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Efficient-Tips",
    sourceName: "WorkBuddy 官方文档",
    sourceKind: "official",
    updatedAt: "2026-09-12T00:00:00.000Z",
  },
  {
    slug: "automation-video-course",
    title: "自动化任务官方入门指南",
    description: "创建、调度、试运行和审计无人值守任务。",
    icon: "timer",
    category: "教程",
    difficulty: "中级",
    feature: ["自动化"],
    score: 96,
    sourceUrl:
      "https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Automation-Guide",
    sourceName: "WorkBuddy 官方文档",
    sourceKind: "official",
    updatedAt: "2026-09-12T00:00:00.000Z",
  },
  {
    slug: "connector-handbook",
    title: "连接器使用与能力边界",
    description: "了解连接器、授权、凭证和第三方数据共享边界。",
    icon: "link",
    category: "官方文档",
    difficulty: "初级",
    feature: ["连接器"],
    score: 96,
    sourceUrl:
      "https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Connector",
    sourceName: "WorkBuddy 官方文档",
    sourceKind: "official",
    updatedAt: "2026-09-12T00:00:00.000Z",
  },
  {
    slug: "beginner-video",
    title: "开启你的第一个任务（官方图文）",
    description: "从下载、登录、新建任务、描述目标到查看结果。",
    icon: "file",
    category: "教程",
    difficulty: "入门",
    feature: ["助手", "项目"],
    score: 96,
    sourceUrl: "https://www.workbuddy.cn/docs/workbuddy/FirstTask",
    sourceName: "WorkBuddy 官方文档",
    sourceKind: "official",
    updatedAt: "2026-09-12T00:00:00.000Z",
  },
  {
    slug: "content-collection",
    title: "WorkBuddy 实战蓝皮书",
    description: "社区维护的任务驱动实战读本与学习路线。",
    icon: "chart",
    category: "社区资源",
    difficulty: "中级",
    feature: ["助手", "项目", "技能"],
    score: 89,
    sourceUrl: "https://github.com/alankris/WorkBuddy",
    sourceName: "WorkBuddy 实战蓝皮书社区",
    sourceKind: "community",
    updatedAt: "2026-09-12T00:00:00.000Z",
    verificationNote: "社区项目，操作细节需与最新官方文档交叉核验。",
  },
];

export const learningSteps = [
  {
    title: "WorkBuddy 是什么",
    description: "了解核心能力与价值",
    icon: "wand" as const,
    time: "1 分钟",
  },
  {
    title: "创建第一个任务",
    description: "发起并交付你的任务",
    icon: "file" as const,
    time: "1 分钟",
  },
  {
    title: "认识本地助手",
    description: "你的智能协作伙伴",
    icon: "bot" as const,
    time: "1 分钟",
  },
  {
    title: "使用项目",
    description: "组织与管理你的工作",
    icon: "folder" as const,
    time: "1 分钟",
  },
  {
    title: "使用专家",
    description: "借助专家完成任务",
    icon: "user" as const,
    time: "1 分钟",
  },
  {
    title: "使用技能",
    description: "调度技能完成操作",
    icon: "wand" as const,
    time: "1 分钟",
  },
  {
    title: "使用连接器",
    description: "连接应用与系统",
    icon: "link" as const,
    time: "1 分钟",
  },
  {
    title: "使用资料库",
    description: "复用知识与内容",
    icon: "database" as const,
    time: "1 分钟",
  },
  {
    title: "创建第一个自动化",
    description: "让流程自动运行",
    icon: "timer" as const,
    time: "2 分钟",
  },
];

export function findHubItem(slug: string) {
  return [...recipes, ...guides, ...cases, ...useCases, ...resources].find(
    (item) => item.slug === slug,
  );
}
