import { BrandMark } from "@/components/hub/hub-ui";
import BackButtonSmall from "@/components/shared/back-button-small";
import { BookOpen, CheckCircle2, Sparkles } from "lucide-react";

/**
 * auth layout is different from other public layouts,
 * so auth directory is not put in (public) directory.
 *
 * https://ui.shadcn.com/blocks#authentication-04
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
        {/* auth form */}
        <div className="flex items-center justify-center relative w-full h-full min-h-screen">
          <BackButtonSmall className="absolute top-6 left-6" />
          <div className="w-full max-w-md px-4">{children}</div>
        </div>

        <div className="relative hidden overflow-hidden bg-slate-950 text-white lg:flex lg:items-center lg:justify-center">
          <div className="absolute -right-24 -top-24 size-96 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-24 size-[480px] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute left-[14%] top-[16%] size-24 rounded-full border border-white/10" />
          <div className="absolute bottom-[12%] right-[12%] size-44 rounded-full border border-dashed border-emerald-400/20" />
          <div className="relative w-full max-w-xl px-16">
            <div className="flex items-center gap-3">
              <BrandMark className="size-11" />
              <span className="text-xl font-black">WorkBuddy Hub</span>
            </div>
            <p className="mt-10 text-xs font-bold uppercase tracking-[0.22em] text-emerald-400">
              Learn by doing
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight tracking-[-0.04em] xl:text-5xl">
              把“它能做什么”
              <br />
              变成“我现在就会做”
            </h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-slate-400">
              保存真正有用的方法，跟着学习路径持续实践，也把你的经验分享给更多
              WorkBuddy 用户。
            </p>
            <div className="mt-10 grid gap-3 text-sm text-slate-300">
              {[
                [BookOpen, "系统学习路径与深度指南"],
                [Sparkles, "可直接复用的实战配方"],
                [CheckCircle2, "经过编辑审核的精选资源"],
              ].map(([Icon, label]) => {
                const ItemIcon = Icon as typeof BookOpen;
                return (
                  <div
                    key={label as string}
                    className="flex items-center gap-3"
                  >
                    <span className="grid size-8 place-items-center rounded-lg bg-white/5 text-emerald-400">
                      <ItemIcon className="size-4" />
                    </span>
                    {label as string}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
