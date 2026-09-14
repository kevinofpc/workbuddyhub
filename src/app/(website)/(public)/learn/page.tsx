import { HubIconView, PageIntro } from "@/components/hub/hub-ui";
import { learningSteps } from "@/content/workbuddy";
import { constructMetadata } from "@/lib/metadata";
import { ArrowRight, Award, BookOpen, Clock3 } from "lucide-react";
import Link from "next/link";

export const metadata = constructMetadata({ title: "学习路径" });

const paths = [
  {
    level: "Beginner",
    label: "新手入门",
    time: "约 10 分钟",
    description: "认识核心功能，完成第一个实战任务。",
    color: "emerald",
    href: "/start",
  },
  {
    level: "Intermediate",
    label: "进阶提升",
    time: "约 30 分钟",
    description: "学习功能组合、项目实践与自动化设计。",
    color: "blue",
    href: "/guides",
  },
  {
    level: "Advanced",
    label: "高级应用",
    time: "约 60 分钟+",
    description: "掌握复杂任务拆解与系统化工作流。",
    color: "violet",
    href: "/recipes",
  },
];

export default function LearnPage() {
  return (
    <>
      <PageIntro
        eyebrow="Learning paths"
        title="从入门到高阶，"
        accent="一步步掌握"
        description="不需要先了解所有功能。选择适合你的阶段，在一条清晰路径中边学边完成真实任务。"
      />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {paths.map((path, index) => (
            <Link
              key={path.level}
              href={path.href}
              className="group hub-panel relative overflow-hidden p-6 transition hover:-translate-y-1 hover:border-emerald-200"
            >
              <span className="text-6xl font-black text-slate-100">
                0{index + 1}
              </span>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">
                {path.level}
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">
                {path.label}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                {path.description}
              </p>
              <div className="mt-6 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock3 className="size-3.5" />
                  {path.time}
                </span>
                <ArrowRight className="size-4 text-emerald-600 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
        <section className="mt-16">
          <div className="mb-6 flex items-center gap-3">
            <BookOpen className="size-5 text-emerald-600" />
            <h2 className="text-2xl font-black text-slate-950">新手路径预览</h2>
          </div>
          <div className="hub-panel grid overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
            {learningSteps.map((step, index) => (
              <div
                key={step.title}
                className="flex gap-4 border-b border-slate-100 p-5 last:border-b-0 sm:border-r"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-50 text-xs font-black text-emerald-600">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {step.description}
                  </p>
                  <span className="mt-3 flex items-center gap-1 text-[11px] text-slate-400">
                    <HubIconView name={step.icon} className="size-3" />
                    {step.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
        <div className="mt-12 flex flex-col items-center rounded-2xl bg-emerald-50 p-8 text-center">
          <Award className="size-8 text-emerald-600" />
          <h2 className="mt-4 text-xl font-black text-slate-950">
            准备好了吗？10 分钟完成第一次实践
          </h2>
          <Link
            href="/start"
            className="mt-5 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-600"
          >
            从第一步开始
          </Link>
        </div>
      </main>
    </>
  );
}
