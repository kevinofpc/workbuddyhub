"use client";

import { subscribeToNewsletter } from "@/actions/subscribe-to-newsletter";
import { LoaderCircle } from "lucide-react";
import { type FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";

export function HubNewsletterForm() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const result = await subscribeToNewsletter({ email });
      if (result.status === "success") {
        setEmail("");
        toast.success("订阅成功，欢迎加入 WorkBuddy Weekly");
        return;
      }
      toast.error(result.message || "订阅失败，请稍后重试");
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative mt-7 flex w-full max-w-md gap-2 md:mt-0"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        邮箱地址
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="输入你的邮箱地址"
        className="h-12 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-400"
      />
      <button
        type="submit"
        disabled={isPending}
        className="flex h-12 shrink-0 items-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-bold transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
        {isPending ? "提交中" : "订阅更新"}
      </button>
    </form>
  );
}
