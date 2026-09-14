import { HubIconView, PageIntro } from "@/components/hub/hub-ui";
import { collectionDefinitions } from "@/content/workbuddy";
import { constructMetadata } from "@/lib/metadata";
import { ArrowRight, Layers3 } from "lucide-react";
import Link from "next/link";

export const metadata = constructMetadata({ title: "专题合集" });

export default function CollectionIndexPage() {
  return (
    <>
      <PageIntro
        eyebrow="Collections"
        title="围绕一个目标"
        accent="系统学习"
        description="编辑把分散的配方、指南、案例与资源重新编排成可连续学习的专题。"
      />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          {collectionDefinitions.map((collection, index) => (
            <Link
              key={collection.slug}
              href={`/collection/${collection.slug}`}
              className="group relative min-h-64 overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 p-7 text-white shadow-lg"
            >
              <div
                className={`absolute inset-0 opacity-50 ${["bg-[radial-gradient(circle_at_80%_20%,#10b981,transparent_35%)]", "bg-[radial-gradient(circle_at_80%_20%,#3b82f6,transparent_35%)]", "bg-[radial-gradient(circle_at_80%_20%,#a855f7,transparent_35%)]", "bg-[radial-gradient(circle_at_80%_20%,#f59e0b,transparent_35%)]"][index]}`}
              />
              <div className="relative flex h-full flex-col">
                <span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-emerald-300 backdrop-blur">
                  <HubIconView name={collection.icon} className="size-5" />
                </span>
                <p className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  <Layers3 className="size-3.5" /> 编辑专题
                </p>
                <h2 className="mt-2 text-2xl font-black">{collection.title}</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                  {collection.description}
                </p>
                <span className="mt-auto flex items-center gap-1 pt-6 text-sm font-bold text-emerald-300">
                  打开合集{" "}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
