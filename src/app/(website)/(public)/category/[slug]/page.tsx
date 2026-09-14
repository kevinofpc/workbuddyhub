import { ListingGrid, PageIntro } from "@/components/hub/hub-ui";
import { categoryDefinitions } from "@/content/workbuddy";
import { getResources } from "@/data/hub";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return categoryDefinitions.map(({ slug }) => ({ slug }));
}

export function generateMetadata({
  params,
}: { params: { slug: string } }): Metadata {
  const category = categoryDefinitions.find(
    (item) => item.slug === params.slug,
  );
  return { title: category ? `${category.title}分类` : "内容分类" };
}

export default async function CategoryPage({
  params,
}: { params: { slug: string } }) {
  const category = categoryDefinitions.find(
    (item) => item.slug === params.slug,
  );
  if (!category) notFound();

  const resources = await getResources();
  const filtered = resources.filter((resource) =>
    category.keywords.some((keyword) =>
      [
        resource.title,
        resource.description,
        resource.category,
        ...resource.feature,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword.toLowerCase()),
    ),
  );

  return (
    <>
      <PageIntro
        eyebrow="Category"
        title={category.title}
        description={category.description}
      />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {filtered.length ? (
          <ListingGrid items={filtered} prefix="resources" />
        ) : (
          <div className="hub-panel py-16 text-center">
            <h2 className="text-lg font-bold text-slate-900">
              这个分类正在整理
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              先去资源中心搜索相邻主题。
            </p>
            <Link
              href={`/discover?q=${encodeURIComponent(category.keywords[0])}`}
              className="mt-5 inline-flex rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white"
            >
              搜索相关资源
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
