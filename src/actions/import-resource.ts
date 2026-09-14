"use server";

import { deepseek } from "@ai-sdk/deepseek";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { xai } from "@ai-sdk/xai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateObject } from "ai";
import { z } from "zod";

const importedResourceSchema = z.object({
  title: z.string().max(80),
  summary: z.string().max(500),
  resourceType: z.enum([
    "tutorial",
    "recipe",
    "guide",
    "video",
    "course",
    "article",
    "case",
    "official-documentation",
    "community-resource",
  ]),
  workbuddyFeatures: z.array(z.string()).max(8),
  useCases: z.array(z.string()).max(8),
  tags: z.array(z.string()).max(12),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  language: z.enum(["chinese", "english", "bilingual"]),
  creator: z.string().max(80),
  qualityScore: z.number().min(0).max(100),
  seoDescription: z.string().max(180),
});

export type ImportedResource = z.infer<typeof importedResourceSchema>;

type ImportResourceResponse =
  | { status: "success"; data: ImportedResource }
  | { status: "error"; message: string };

// Provider packages currently resolve two compatible AI SDK minor type copies.
// biome-ignore lint/suspicious/noExplicitAny: normalize provider models at this boundary
function getModel(): any {
  if (
    process.env.DEFAULT_AI_PROVIDER === "google" &&
    process.env.GOOGLE_GENERATIVE_AI_API_KEY
  ) {
    return google("gemini-2.0-flash", { structuredOutputs: true });
  }
  if (
    process.env.DEFAULT_AI_PROVIDER === "deepseek" &&
    process.env.DEEPSEEK_API_KEY
  ) {
    return deepseek("deepseek-chat");
  }
  if (
    process.env.DEFAULT_AI_PROVIDER === "openai" &&
    process.env.OPENAI_API_KEY
  ) {
    return openai("gpt-4o-mini", { structuredOutputs: true });
  }
  if (process.env.DEFAULT_AI_PROVIDER === "xai" && process.env.XAI_API_KEY) {
    return xai("grok-3");
  }
  if (
    process.env.DEFAULT_AI_PROVIDER === "openrouter" &&
    process.env.OPENROUTER_API_KEY &&
    process.env.OPENROUTER_MODEL
  ) {
    return createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY })(
      process.env.OPENROUTER_MODEL,
    );
  }
  return null;
}

function parsePublicUrl(rawUrl: string) {
  const url = new URL(rawUrl);
  if (!["http:", "https:"].includes(url.protocol))
    throw new Error("协议不受支持");

  const hostname = url.hostname.toLowerCase();
  const blocked =
    hostname === "localhost" ||
    hostname === "0.0.0.0" ||
    hostname === "::1" ||
    hostname.endsWith(".local") ||
    /^127\./.test(hostname) ||
    /^10\./.test(hostname) ||
    /^192\.168\./.test(hostname) ||
    /^169\.254\./.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(hostname);
  if (blocked) throw new Error("不能分析本地或内网地址");
  return url;
}

function compactHtml(html: string) {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 24_000);
}

export async function importResource(
  rawUrl: string,
): Promise<ImportResourceResponse> {
  try {
    const model = getModel();
    if (!model) {
      return {
        status: "error",
        message:
          "尚未配置 AI 服务，请先手动填写，或在环境变量中配置 AI 提供商。",
      };
    }

    const url = parsePublicUrl(rawUrl);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "WorkBuddyHub-Resource-Importer/1.0" },
      redirect: "follow",
    }).finally(() => clearTimeout(timeout));

    if (!response.ok) throw new Error(`网页返回 ${response.status}`);
    const contentType = response.headers.get("content-type") || "";
    if (
      !contentType.includes("text/html") &&
      !contentType.includes("text/plain")
    ) {
      throw new Error("该链接不是可分析的网页");
    }

    const content = compactHtml(await response.text());
    if (content.length < 80) throw new Error("网页正文过短，无法可靠分析");

    const result = await generateObject({
      model,
      schema: importedResourceSchema,
      prompt: `你是 WorkBuddy Hub 的中文资源编辑。请分析下面的公开网页，判断它如何帮助用户学习或使用 WorkBuddy。只根据页面证据填写，不要虚构。标题和摘要使用自然、克制的中文；功能、场景和标签使用简短中文词组。质量分综合考虑实用性、完整性、可信度与时效性。\n\n来源网址：${url.toString()}\n\n网页正文：\n${content}`,
    });

    return { status: "success", data: result.object };
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";
    console.error("importResource failed:", message);
    return { status: "error", message: `AI 分析失败：${message}` };
  }
}
