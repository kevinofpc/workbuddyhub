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
  sourceLicense?: string;
  sourceRepository?: string;
  sourcePath?: string;
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
  caseType?: "real" | "tutorial" | "story";
  dataNature?: "real" | "anonymized" | "synthetic" | "not-applicable";
  contentOrigin?: "original" | "imported" | "community" | "editorial";
  verificationStatus?:
    | "imported"
    | "edited"
    | "verified"
    | "community_verified"
    | "outdated";
  verifiedAt?: string;
  prerequisites?: string[];
  acceptance?: string;
  deliverables?: string[];
  safety?: string;
  limitations?: string;
  relatedRecipes?: HubRelation[];
  relatedGuides?: HubRelation[];
  relatedUseCases?: HubRelation[];
};

export type HubRelation = {
  slug: string;
  title: string;
  description?: string;
  difficulty?: HubItem["difficulty"];
  icon?: HubIcon;
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
    slug: "tea-shop-sales-analysis",
    title: "用 WorkBuddy 清洗 119 份 Excel 并生成运营看板",
    description:
      "一套可完整复现的数据清洗练习：合并多门店表格、检查异常、统一口径并生成分析看板。",
    icon: "sheet",
    category: "教学实操",
    difficulty: "中级",
    feature: ["项目", "技能", "表格"],
    time: "45 分钟",
    score: 98,
    caseType: "tutorial",
    dataNature: "synthetic",
    contentOrigin: "imported",
    verificationStatus: "edited",
    sourceUrl:
      "https://workbuddy.homes/cases/submissions/tea-shop-sales-analysis/",
    sourceName: "WorkBuddy Guide 社区案例",
    sourceKind: "community",
    sourceLicense: "MIT",
    sourceRepository: "https://github.com/AlephAITech/WorkBuddyGuide",
    sourcePath: "docs/cases/submissions/tea-shop-sales-analysis/index.md",
    updatedAt: "2026-09-14T00:00:00.000Z",
    userBackground:
      "本案例以虚构茶饮品牌“茗悦茶舍”的教学数据为背景。119 份 Excel 文件模拟多门店、多日期的销售明细，适合练习真实工作中常见的批量表格治理。",
    previousWorkflow:
      "人工逐个打开文件、复制粘贴到总表，再手工统一列名和日期格式。文件数量增加后，重复数据、空值和口径不一致很难被及时发现。",
    painPoints:
      "- 文件数量多，人工合并容易漏文件或重复导入。\n- 不同门店的字段、日期和金额格式不一致。\n- 清洗结果若没有日志和验收清单，很难证明数据可靠。",
    solution:
      "把原始文件放进独立项目目录，让 WorkBuddy 先只读盘点，再生成清洗规则和执行预览。确认后批量合并，最后输出汇总表、异常清单、处理日志与运营看板。",
    process:
      "1. 复制原始文件到独立工作目录，保留一份不可修改的备份。\n2. 要求 WorkBuddy 只读扫描文件数量、表头、Sheet、行数和字段类型。\n3. 根据扫描结果确认统一字段、日期格式、金额单位、去重主键和空值处理规则。\n4. 先用 3—5 个样本文件试跑，输出变更预览和异常项。\n5. 确认规则后处理全部文件，同时保存脚本或公式、处理日志和失败文件列表。\n6. 对关键指标抽样复算，再生成门店、日期和商品维度的运营看板。",
    prompt:
      "你将处理【原始数据目录】中的 Excel 文件。先只读扫描，不要修改任何文件。请输出：文件数、Sheet 数、每个文件的行列数、字段差异、日期/金额格式差异、空值、重复值和异常值。然后提出统一口径、去重主键、异常处理方式和验收清单，等我确认后再执行。执行时把结果、异常清单、处理日志和可复用脚本保存到【输出目录】，不得覆盖原文件。",
    result:
      "参考案例将 119 份文件中的 186,308 行原始记录整理为 182,500 行有效数据，并生成 8 个分析 Sheet、165 个公式及运营看板。数字来自教学案例，不代表真实企业项目。",
    improvements:
      "可进一步把字段映射、抽样复算和失败重试封装成固定配方；真实业务数据还应增加权限、脱敏、版本和审计要求。",
    prerequisites: [
      "119 份或一组同结构 Excel",
      "独立工作目录",
      "明确的统计口径",
    ],
    deliverables: ["清洗后的汇总表", "异常清单", "处理日志", "运营看板"],
    acceptance:
      "- 原文件未被覆盖。\n- 输入文件与处理日志数量一致。\n- 关键字段格式统一，重复与空值处理有记录。\n- 汇总行数能够解释，关键指标完成抽样复算。\n- 看板数字可追溯到清洗后的明细表。",
    safety:
      "真实数据必须先脱敏，并限制 WorkBuddy 只在指定目录内工作；任何覆盖、删除或外发动作都需要人工确认。",
    limitations:
      "这是教学模拟数据。实际企业表格可能包含更复杂的权限、公式、合并单元格和历史口径，不能直接套用结果数字。",
    verificationNote:
      "本站已核对来源结构并做可执行化整理；当前状态为编辑完成，尚未以相同数据包独立复现，因此不标记为“本站已验证”。",
    relatedRecipes: [
      {
        slug: "excel-analysis",
        title: "Excel 数据分析",
        description: "从表格盘点、清洗到可视化的通用配方。",
        difficulty: "初级",
        icon: "sheet",
      },
    ],
    relatedGuides: [
      {
        slug: "prompt-best-practices",
        title: "WorkBuddy Prompt 最佳实践",
        difficulty: "初级",
        icon: "pen",
      },
    ],
    relatedUseCases: [
      {
        slug: "excel",
        title: "WorkBuddy 分析 Excel",
        difficulty: "初级",
        icon: "sheet",
      },
    ],
  },
  {
    slug: "daily-ai-news",
    title: "用 WorkBuddy 生成带来源的每日 AI 资讯简报",
    description:
      "从一次可靠的手动检索开始，建立可追溯、可去重、可逐步自动化的每日资讯工作流。",
    icon: "mail",
    category: "教学实操",
    difficulty: "入门",
    feature: ["技能", "自动化", "Web"],
    time: "20 分钟",
    score: 96,
    caseType: "tutorial",
    dataNature: "not-applicable",
    contentOrigin: "imported",
    verificationStatus: "edited",
    sourceUrl: "https://workbuddy.homes/cases/submissions/daily-ai-news/",
    sourceName: "WorkBuddy Guide 社区案例",
    sourceKind: "community",
    sourceLicense: "MIT",
    sourceRepository: "https://github.com/AlephAITech/WorkBuddyGuide",
    sourcePath: "docs/cases/submissions/daily-ai-news/index.md",
    updatedAt: "2026-09-14T00:00:00.000Z",
    userBackground:
      "适合需要每天跟踪 AI 产品、模型发布和行业动态的研究、产品与内容从业者。参考来源是一篇带完整步骤的社区示例。",
    previousWorkflow:
      "每天重复打开多个网站和社交平台，手工筛选与复制链接；相同事件容易重复，摘要也常常缺少发布时间和原始出处。",
    painPoints:
      "信息源分散、重复度高、时效性强。如果一开始就做无人值守自动化，失效链接、低质量来源和空结果会被直接放大。",
    solution:
      "先安装并测试资讯检索技能，用固定时间范围和来源字段生成单次简报；人工确认质量稳定后，再配置低频自动化和异常提示。",
    process:
      "1. 明确主题、时间范围、语言和优先来源。\n2. 先运行最近 7 天查询，观察来源质量与重复情况。\n3. 再运行过去 24 小时版本，固定摘要、链接、发布时间与关注理由字段。\n4. 检查重复事件、失效链接和无法核验的信息。\n5. 单次运行稳定后再创建自动化，并保留失败和零结果状态。",
    prompt:
      "汇总过去 24 小时【主题】的重要资讯。优先发布方官网、论文或产品公告；合并描述同一事件的重复报道。每条包含：标题、两句摘要、来源、发布时间、原始链接、为什么值得关注。把推断和无法确认的信息单独列出。先生成一次供我确认，不要自动发送。",
    result:
      "得到一份按重要性排序、每条都有原始链接和时间信息的简报，并明确列出重复、失效或待核验内容。自动发送属于后续增强，不是本案例已证明的结果。",
    improvements:
      "稳定后可以增加关注主题、可信来源白名单、重复事件指纹和每周复盘，但仍应定期抽查来源质量。",
    prerequisites: [
      "可用的网页检索或资讯技能",
      "主题与来源范围",
      "简报保存位置",
    ],
    deliverables: ["每日资讯简报", "来源链接清单", "异常与待核验项"],
    acceptance:
      "- 每条信息都有可打开的原始链接与发布时间。\n- 相同事件已合并。\n- 事实、推断和待核验项明确区分。\n- 无结果或来源失败时显示状态，不生成看似完整的空洞简报。",
    safety:
      "在单次运行尚未稳定前不要自动对外发送；任何邮箱、群聊或文档写入都应使用最小权限并保留人工确认。",
    limitations:
      "来源是一篇社区示例，展示了技能安装和单次检索；持续无人值守自动化需要另行配置并验证。",
    verificationNote:
      "本站依据社区示例重组为站内实践教程，并明确保留单次运行与自动化之间的证据边界。",
    relatedRecipes: [
      {
        slug: "ai-daily-news-brief",
        title: "自动生成每日 AI 新闻简报",
        description: "把稳定的单次查询升级为可观察的定时任务。",
        difficulty: "入门",
        icon: "mail",
      },
    ],
    relatedGuides: [
      {
        slug: "automation-principles",
        title: "自动化任务设计原则",
        difficulty: "中级",
        icon: "timer",
      },
    ],
    relatedUseCases: [
      {
        slug: "daily-briefing",
        title: "WorkBuddy 每日简报",
        difficulty: "初级",
        icon: "mail",
      },
    ],
  },
  {
    slug: "competitor-analysis-pm-process",
    title: "捷顺科技：把 WorkBuddy 推广到 15 个部门",
    description: "腾讯云官方产品页公开的跨部门推广反馈与可复用落地方法。",
    icon: "chart",
    category: "团队落地",
    difficulty: "中级",
    feature: ["项目", "专家", "技能"],
    score: 92,
    caseType: "story",
    dataNature: "not-applicable",
    contentOrigin: "editorial",
    verificationStatus: "edited",
    relatedRecipes: [
      {
        slug: "competitor-analysis",
        title: "自动竞品分析",
        difficulty: "中级",
        icon: "search",
      },
    ],
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
    caseType: "story",
    dataNature: "not-applicable",
    contentOrigin: "editorial",
    verificationStatus: "edited",
    relatedRecipes: [
      {
        slug: "ppt-from-brief",
        title: "自动制作 PPT",
        difficulty: "初级",
        icon: "presentation",
      },
      {
        slug: "excel-analysis",
        title: "Excel 数据分析",
        difficulty: "初级",
        icon: "sheet",
      },
    ],
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
    caseType: "story",
    dataNature: "not-applicable",
    contentOrigin: "editorial",
    verificationStatus: "edited",
    relatedRecipes: [
      {
        slug: "weekly-report",
        title: "自动生成周报",
        difficulty: "入门",
        icon: "file",
      },
    ],
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
    caseType: "story",
    dataNature: "not-applicable",
    contentOrigin: "editorial",
    verificationStatus: "edited",
    relatedRecipes: [
      {
        slug: "github-pr-review",
        title: "GitHub PR Review",
        difficulty: "中级",
        icon: "code",
      },
    ],
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
