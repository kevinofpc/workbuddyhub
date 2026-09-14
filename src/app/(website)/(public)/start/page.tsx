import { HubIconView } from "@/components/hub/hub-ui";
import { learningSteps } from "@/content/workbuddy";
import { constructMetadata } from "@/lib/metadata";
import { ArrowRight, Check, Clock3, Flag, Rocket } from "lucide-react";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "Start Here - 10 分钟了解 WorkBuddy",
});

export default function StartPage() {
  return (
    <main className="bg-[radial-gradient(circle_at_60%_0%,rgba(167,243,208,.28),transparent_28%)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <p className="hub-kicker">Start Here</p>
            <h1 className="mt-4 text-5xl font-black leading-tight tracking-[-0.05em] text-slate-950">
              10 分钟了解 <span className="text-emerald-500">WorkBuddy</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-500">
              为第一次使用 WorkBuddy
              的你设计。认识核心能力，并完成一个可以立刻复用的实战任务。
            </p>
            <div className="mt-8 hub-panel flex items-center gap-4 p-5">
              <span className="grid size-12 place-items-center rounded-full bg-emerald-500 text-xl font-black text-white">
                1
              </span>
              <div className="flex-1">
                <strong className="text-slate-950">Beginner · 新手入门</strong>
                <p className="mt-1 text-sm text-slate-500">
                  完成 9 个短步骤，约 10 分钟
                </p>
              </div>
              <Clock3 className="size-5 text-emerald-600" />
            </div>
            <section className="mt-6 hub-panel p-5 sm:p-7">
              <h2 className="text-xl font-black text-slate-950">
                Beginner · 新手入门
              </h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {learningSteps.map((step, index) => (
                  <article
                    key={step.title}
                    className="group rounded-xl border border-slate-200 p-4 transition hover:border-emerald-200 hover:bg-emerald-50/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-emerald-600">
                        {index + 1}
                      </span>
                      <HubIconView
                        name={step.icon}
                        className="size-5 text-slate-400 group-hover:text-emerald-600"
                      />
                    </div>
                    <h3 className="mt-5 text-sm font-bold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {step.description}
                    </p>
                    <p className="mt-4 text-[11px] text-slate-400">
                      {step.time}
                    </p>
                  </article>
                ))}
              </div>
            </section>
            <section className="mt-6">
              <h2 className="mb-4 text-lg font-black text-slate-950">
                继续学习
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  ["配方库", "浏览可直接复用的任务配方", "/recipes"],
                  ["操作指南", "理解功能与最佳实践", "/guides"],
                  ["真实案例", "学习团队如何解决问题", "/cases"],
                ].map(([title, desc, href]) => (
                  <Link key={title} href={href} className="group hub-panel p-5">
                    <Rocket className="size-5 text-emerald-600" />
                    <h3 className="mt-4 font-bold text-slate-900">{title}</h3>
                    <p className="mt-2 text-sm text-slate-500">{desc}</p>
                    <span className="mt-5 flex items-center gap-1 text-xs font-bold text-emerald-600">
                      开始探索{" "}
                      <ArrowRight className="size-3.5 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          </div>
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="hub-panel p-5">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-black">
                  <Flag className="size-4 text-emerald-600" />
                  推荐起步顺序
                </h2>
                <strong className="text-emerald-600">10 分钟</strong>
              </div>
              <ol className="mt-5 space-y-3">
                {learningSteps.map((step, index) => (
                  <li
                    key={step.title}
                    className="flex items-center gap-3 text-xs"
                  >
                    <span className="grid size-5 place-items-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="flex-1 text-slate-600">{step.title}</span>
                    <span className="text-slate-400">{step.time}</span>
                  </li>
                ))}
              </ol>
              <button
                type="button"
                className="mt-6 w-full rounded-xl border border-emerald-300 py-3 text-sm font-bold text-emerald-600 hover:bg-emerald-50"
              >
                从第一步开始学习
              </button>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-slate-950">
                  第一个实战任务
                </h2>
                <span className="rounded-full bg-emerald-500 px-2 py-1 text-[10px] font-bold text-white">
                  推荐
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                创建一个“每周团队摘要”自动化，每周一早上自动整理进展并生成邮件。
              </p>
              <div className="mt-4 flex gap-2">
                {["自动化", "邮箱", "项目"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-white px-2 py-1 text-[10px] text-emerald-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href="/recipes/weekly-report"
                className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-bold text-white"
              >
                开始实践 <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="hub-panel p-5">
              <h2 className="text-sm font-black text-slate-900">
                完成后你将能够
              </h2>
              <ul className="mt-4 space-y-3">
                {[
                  "判断该用哪个功能",
                  "写出清晰的任务指令",
                  "建立第一个自动化",
                ].map((text) => (
                  <li
                    key={text}
                    className="flex items-center gap-2 text-xs text-slate-500"
                  >
                    <Check className="size-4 text-emerald-600" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
