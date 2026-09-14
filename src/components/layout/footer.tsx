import { BrandMark } from "@/components/hub/hub-ui";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  { title: "学习路径", href: "/learn" },
  { title: "实战配方", href: "/recipes" },
  { title: "场景中心", href: "/use-cases" },
  { title: "深度指南", href: "/guides" },
  { title: "真实案例", href: "/cases" },
  { title: "精选资源", href: "/discover" },
];

export function Footer({ className = "" }: { className?: string }) {
  return (
    <footer className={`border-t border-slate-200 bg-slate-50/70 ${className}`}>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <BrandMark className="size-8" />
            <span className="text-lg font-black tracking-tight text-slate-950">
              WorkBuddy Hub
            </span>
          </div>
          <p className="mt-4 max-w-lg text-sm leading-7 text-slate-500">
            WorkBuddy
            学习、案例与最佳实践中心。帮助你理解功能、找到场景、复制配方，然后回到
            WorkBuddy 真正完成工作。
          </p>
          <p className="mt-4 text-xs text-slate-400">
            内容来自官方文档、公开实践与经过核验的社区资源。
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
          {footerLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-emerald-600"
            >
              {item.title}
              <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-slate-200/80 py-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>
            © {new Date().getFullYear()} WorkBuddy Hub. 内容持续更新。
          </span>
          <div className="flex gap-5">
            <Link href="/about">关于我们</Link>
            <Link href="/privacy">隐私政策</Link>
            <Link href="/submit">提交资源</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
