import { ListingGrid, PageIntro } from "@/components/hub/hub-ui";
import { tagDefinitions } from "@/content/workbuddy";
import { getResources } from "@/data/hub";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return tagDefinitions.map(({ slug }) => ({ slug }));
}

export function generateMetadata({
  params,
}: { params: { slug: string } }): Metadata {
  const tag = tagDefinitions.find((item) => item.slug === params.slug);
  return { title: tag ? `#${tag.title}` : "内容标签" };
}

export default async function TagPage({
  params,
}: { params: { slug: string } }) {
  const tag = tagDefinitions.find((item) => item.slug === params.slug);
  if (!tag) notFound();

  const resources = await getResources();
  const query = tag.title.toLowerCase();
  const filtered = resources.filter((resource) =>
    [
      resource.title,
      resource.description,
      resource.category,
      ...resource.feature,
    ]
      .join(" ")
      .toLowerCase()
      .includes(query),
  );

  return (
    <>
      <PageIntro
        eyebrow="Tag"
        title={`# ${tag.title}`}
        description={`与“${tag.title}”相关的精选 WorkBuddy 学习内容。`}
      />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {filtered.length ? (
          <ListingGrid items={filtered} prefix="resources" />
        ) : (
          <div className="hub-panel py-16 text-center">
            <h2 className="text-lg font-bold text-slate-900">暂无精确匹配</h2>
            <Link
              href={`/discover?q=${encodeURIComponent(tag.title)}`}
              className="mt-5 inline-flex rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white"
            >
              在资源中心继续搜索
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
