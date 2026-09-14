import { ListingGrid, PageIntro } from "@/components/hub/hub-ui";
import { collectionDefinitions } from "@/content/workbuddy";
import { getResources } from "@/data/hub";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return collectionDefinitions.map(({ slug }) => ({ slug }));
}

export function generateMetadata({
  params,
}: { params: { slug: string } }): Metadata {
  const collection = collectionDefinitions.find(
    (item) => item.slug === params.slug,
  );
  return { title: collection?.title || "专题合集" };
}

export default async function CollectionPage({
  params,
}: { params: { slug: string } }) {
  const collection = collectionDefinitions.find(
    (item) => item.slug === params.slug,
  );
  if (!collection) notFound();
  const resources = await getResources();
  const query = collection.query.toLowerCase();
  const matched = resources.filter((resource) =>
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
  const items = matched.length > 0 ? matched : resources.slice(0, 4);

  return (
    <>
      <PageIntro
        eyebrow="Curated collection"
        title={collection.title}
        description={collection.description}
      />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="mb-6 text-sm text-slate-500">
          按建议顺序学习，共 {items.length} 项精选内容。
        </p>
        <ListingGrid items={items} prefix="resources" />
      </main>
    </>
  );
}
