"use client";

import {
  type ImportedResource,
  importResource,
} from "@/actions/import-resource";
import { submitResource } from "@/actions/submit-resource";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type ResourceSubmitData, ResourceSubmitSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle, ShieldCheck, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const typeLabels: Record<ImportedResource["resourceType"], string> = {
  tutorial: "教程",
  recipe: "实战配方",
  guide: "指南",
  video: "视频",
  course: "课程",
  article: "文章",
  case: "案例",
  "official-documentation": "官方文档",
  "community-resource": "社区资源",
};

const difficultyLabels = {
  beginner: "入门",
  intermediate: "中级",
  advanced: "高级",
};

export function ResourceSubmitForm() {
  const router = useRouter();
  const [isSubmitting, startSubmitting] = useTransition();
  const [isAnalyzing, startAnalyzing] = useTransition();
  const [analysis, setAnalysis] = useState<ImportedResource | null>(null);

  const form = useForm<ResourceSubmitData>({
    resolver: zodResolver(ResourceSubmitSchema),
    defaultValues: {
      url: "",
      title: "",
      description: "",
      suggestedFeatures: [],
      suggestedUseCases: [],
      suggestedTags: [],
    },
  });

  function handleAnalyze() {
    startAnalyzing(async () => {
      const valid = await form.trigger("url");
      if (!valid) return;

      const result = await importResource(form.getValues("url"));
      if (result.status === "error") {
        toast.error(result.message);
        return;
      }

      const data = result.data;
      setAnalysis(data);
      form.setValue("title", data.title, { shouldValidate: true });
      form.setValue("description", data.summary, { shouldValidate: true });
      form.setValue("resourceType", data.resourceType);
      form.setValue("difficulty", data.difficulty);
      form.setValue("language", data.language);
      form.setValue("creator", data.creator);
      form.setValue("qualityScore", data.qualityScore);
      form.setValue("seoDescription", data.seoDescription);
      form.setValue("suggestedFeatures", data.workbuddyFeatures);
      form.setValue("suggestedUseCases", data.useCases);
      form.setValue("suggestedTags", data.tags);
      toast.success("AI 已生成建议，请确认后提交");
    });
  }

  const onSubmit = form.handleSubmit((data) => {
    startSubmitting(async () => {
      const result = await submitResource(data);
      if (result.status === "error") {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.push("/dashboard");
      router.refresh();
    });
  });

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="space-y-6 p-6 md:p-8">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>资源链接</FormLabel>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://example.com/workbuddy-guide"
                          className="h-11 flex-1 rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        disabled={isAnalyzing || isSubmitting}
                        onClick={handleAnalyze}
                      >
                        {isAnalyzing ? (
                          <LoaderCircle className="animate-spin" />
                        ) : (
                          <Sparkles />
                        )}
                        {isAnalyzing ? "正在分析" : "AI 分析链接"}
                      </Button>
                    </div>
                    <FormDescription>
                      AI 分析是可选的；即使未配置 AI，也可以手动完成投稿。
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>标题</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="用一句清楚的话概括资源"
                        className="h-11 rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>资源简介</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="它解决什么问题、适合谁、为什么值得收录？"
                        className="min-h-36 resize-y rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <div className="flex justify-between gap-4">
                      <FormDescription>
                        请勿粘贴整篇原文，重点说明它对 WorkBuddy 用户的价值。
                      </FormDescription>
                      <span className="shrink-0 text-xs text-slate-400">
                        {form.watch("description")?.length || 0}/500
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {analysis ? (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 font-semibold text-emerald-900">
                      <Sparkles className="size-4" /> AI 编辑建议
                    </div>
                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-emerald-700 shadow-sm">
                      质量分 {analysis.qualityScore}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-white px-3 py-1.5 text-slate-600">
                      {typeLabels[analysis.resourceType]}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1.5 text-slate-600">
                      {difficultyLabels[analysis.difficulty]}
                    </span>
                    {[...analysis.workbuddyFeatures, ...analysis.tags]
                      .slice(0, 8)
                      .map((label) => (
                        <span
                          key={label}
                          className="rounded-full bg-white px-3 py-1.5 text-slate-600"
                        >
                          {label}
                        </span>
                      ))}
                  </div>
                </div>
              ) : null}
            </CardContent>

            <CardFooter className="flex flex-col items-start justify-between gap-4 border-t border-slate-100 bg-slate-50/70 px-6 py-5 sm:flex-row sm:items-center md:px-8">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <ShieldCheck className="size-4 text-emerald-600" />
                投稿只进入审核队列，不会自动发布
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting || isAnalyzing}
                className="rounded-xl bg-emerald-600 px-6 hover:bg-emerald-700"
              >
                {isSubmitting ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <ArrowRight />
                )}
                {isSubmitting ? "正在提交" : "提交审核"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
          收录标准
        </p>
        <h2 className="mt-2 text-lg font-bold text-slate-950">
          什么资源值得推荐？
        </h2>
        <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
          <li>内容与 WorkBuddy 学习、实战或案例直接相关。</li>
          <li>有明确作者与原始出处，不提交搬运或聚合链接。</li>
          <li>能帮助读者完成一个具体任务，而非只有宣传信息。</li>
          <li>链接可公开访问，且内容仍然有效。</li>
        </ul>
        <p className="mt-6 border-t border-slate-100 pt-5 text-xs leading-5 text-slate-400">
          编辑会检查重复项、事实准确性和时效性，并可能调整标题与分类。
        </p>
      </aside>
    </div>
  );
}
