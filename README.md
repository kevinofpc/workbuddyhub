# WorkBuddy Hub

WorkBuddy Hub 是一个 WorkBuddy 学习、案例与最佳实践中心。项目基于 [Mkdirs](https://github.com/MkdirsHQ/mkdirs) 二次开发，帮助用户通过学习路径、实战配方、场景指南、真实案例和精选资源，快速掌握如何用 WorkBuddy 完成具体任务。

## 产品边界

WorkBuddy 负责执行任务；WorkBuddy Hub 负责学习、理解、发现和复制最佳实践。本项目不提供工作流执行、自动化运行或技能安装市场。

## 已实现页面

- `/`：任务搜索驱动的首页
- `/start`、`/learn`：新手入门与分级学习路径
- `/workbuddy-map`：助手、项目、专家、技能、连接器、自动化和资料库功能地图
- `/recipes`、`/recipes/[slug]`：实战配方列表与详情
- `/use-cases`、`/use-cases/[slug]`：场景中心
- `/guides`、`/guides/[slug]`：深度指南
- `/cases`、`/cases/[slug]`：真实案例
- `/discover`、`/resources/[slug]`：资源搜索、筛选与详情
- `/submit`：登录后提交 URL、标题和简介，可选 AI 自动分析并进入审核队列
- `/studio`：Sanity 内容管理后台

## CMS 内容模型

Sanity Studio 中已增加以下模型：

- `Learning Path`
- `Recipe`
- `Use Case`
- `Guide`
- `Case Study`
- `WorkBuddy Feature`
- `Brand Asset`
- `Resource`（由 Mkdirs 原有 Item 扩展）

Resource 支持类型、创作者、难度、语言、时长、WorkBuddy Hub Score、最后检查时间、过期标记、功能与场景关联。Brand Asset 集中管理站点 Logo、社交分享图和带权利说明的官方品牌参考素材。

## 技术栈

- Next.js 14 / React 18 / TypeScript
- Tailwind CSS / Radix UI / Lucide
- Sanity CMS
- Auth.js
- Vercel AI SDK
- Resend / Stripe / OpenPanel（可选）

## 本地运行

建议使用 Node.js 20 LTS（项目包含 `.nvmrc`；支持 Node.js 20–22）。Next.js 14 的生产 Edge Middleware 与 Node.js 26 不兼容。

安装依赖：

```bash
pnpm install
```

复制环境变量并至少配置 Sanity 与 Auth：

```bash
cp .env.example .env.local
```

```dotenv
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
SANITY_API_TOKEN=your_token
AUTH_SECRET=your_auth_secret
AUTH_TRUST_HOST=true
```

启动开发服务器：

```bash
pnpm dev
```

访问 `http://localhost:3000`。如果未配置 Sanity，公开学习中心仍可显示内置演示内容；Studio、登录、收藏与投稿存储需要有效的 Sanity 配置。

资源投稿页的“AI 智能分析”是可选能力。启用时，在 `.env.local` 中设置 `DEFAULT_AI_PROVIDER`（支持 `google`、`deepseek`、`openai`、`xai`、`openrouter`），并配置对应的 API Key；未配置时仍可手动填写并提交资源。邮件订阅与账户邮件需要配置 `.env.example` 中的 Resend 变量。

投稿记录会以 `pending` 状态进入 `/studio` 的 `Pending Resource Review`。管理员可在 Studio 中编辑、复制、拒绝或批准；批准时将 `freePlanStatus` 设为 `approved` 并填写 `publishDate`，资源才会进入公开资源中心。

## 初始化真实 CMS 内容

在配置好真实 Sanity Project ID、Dataset 和 Editor Token 后，使用 Node.js 20–22 执行：

```bash
pnpm seed:workbuddy
```

WorkBuddy Hub 在 `/studio` 中嵌入了 Sanity Studio，Schema 会随网站代码加载，无需单独部署远程 Schema。种子脚本会创建首批 WorkBuddy 功能、分类、标签、专题、配方、指南、案例、使用场景与资源。它使用固定的 `workbuddy.*` 文档 ID，仅创建缺失文档；可以安全重复执行，不会覆盖编辑后来在 Studio 中修改的内容。

种子数据建立后，可导入经过来源核验的 P0 精选内容：

```bash
pnpm curate:workbuddy
```

该脚本会更新固定 ID 的 WorkBuddy Hub 首批内容：写入真实外链、来源类型、核验日期、评分拆分、官方/社区截图、腾讯云官方页面公开的团队实践数据，以及站点品牌标志、社交分享图和官方品牌参考素材。截图位于 `output/playwright/`，站点自有品牌文件位于 `public/`；上传前会按原文件名复用已有 Sanity Asset。与只创建缺失项的种子脚本不同，精选脚本会覆盖其负责的 `workbuddy.resource.*`、4 个首批案例、3 个品牌素材及指定重点配方/指南；在 Studio 手工修改这些固定条目前，应先同步更新脚本中的内容。

只检查脚本内全部资源链接、不写入 CMS：

```bash
pnpm curate:workbuddy --check-links
```

所有外部资料在页面中标注官方或社区来源。社区内容不代表 WorkBuddy 官方立场；公开案例只展示来源确实披露的指标，并同时保留口径限制和待补数据。

## 验证

```bash
pnpm exec tsc --noEmit
pnpm build
```

完整生产构建需要 `.env.example` 中列出的服务变量。当前页面已在 1440px 桌面与 390px 移动视口进行浏览器检查。

## 目录说明

- `src/content/workbuddy.ts`：首批演示内容与前端数据结构
- `src/components/hub/`：WorkBuddy Hub 通用组件
- `src/app/(website)/(public)/`：公开页面
- `src/sanity/schemas/documents/hub-content.ts`：Hub CMS 模型
- `src/sanity/schemas/documents/directory/item.ts`：扩展后的 Resource 模型

## License

本项目沿用 Mkdirs 的 Apache License 2.0。Mkdirs 名称、Logo 和商标不包含在授权范围内；本项目仅在文档中说明其技术来源。
