"use client";

import { BrandMark } from "@/components/hub/hub-ui";
import type { DashboardConfig, MarketingConfig } from "@/types";
import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavBarProps {
  scroll?: boolean;
  config: DashboardConfig | MarketingConfig;
}

export function Navbar({ config }: NavBarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = config.menus.filter((item) => !item.disabled);
  const active = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <BrandMark className="size-8 rounded-[10px]" />
          <span className="text-[19px] font-black tracking-[-0.035em] text-slate-950">
            WorkBuddy Hub
          </span>
        </Link>
        <nav
          className="hidden h-full items-center gap-1 lg:flex"
          aria-label="主导航"
        >
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex h-full items-center px-3 text-sm font-semibold transition-colors ${active(item.href) ? "text-emerald-600 after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-emerald-500" : "text-slate-600 hover:text-slate-950"}`}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 sm:flex">
          <Link
            href="/discover"
            className="grid size-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="搜索"
          >
            <Search className="size-5" />
          </Link>
          <Link
            href="/#newsletter"
            className="rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(16,185,129,.2)] transition hover:-translate-y-0.5 hover:bg-emerald-600"
          >
            订阅更新
          </Link>
        </div>
        <button
          type="button"
          className="grid size-10 place-items-center rounded-lg border border-slate-200 text-slate-700 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "关闭导航" : "打开导航"}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-slate-100 bg-white px-4 py-4 lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-3 text-sm font-semibold ${active(item.href) ? "bg-emerald-50 text-emerald-700" : "text-slate-600"}`}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
