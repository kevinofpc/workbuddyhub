"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

export function HubSearch({
  compact = false,
  initialValue = "",
}: {
  compact?: boolean;
  initialValue?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialValue);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    router.push(
      value ? `/discover?q=${encodeURIComponent(value)}` : "/discover",
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,.08)] transition focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-500/10 ${
        compact ? "h-11" : "h-14"
      }`}
    >
      <Search className="ml-4 size-5 shrink-0 self-center text-slate-400" />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="我想用 WorkBuddy 做什么？"
        aria-label="搜索 WorkBuddy 案例、配方、指南和资源"
        className="min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 md:text-base"
      />
      <button
        type="submit"
        className="m-1.5 grid aspect-square place-items-center rounded-lg bg-emerald-500 text-white transition hover:bg-emerald-600"
        aria-label="搜索"
      >
        <Search className="size-5" />
      </button>
    </form>
  );
}
