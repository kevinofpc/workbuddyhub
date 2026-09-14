import { HubDetailPage } from "@/components/hub/detail-page";
import { getHubItem } from "@/data/hub";
import { constructMetadata } from "@/lib/metadata";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const item = await getHubItem("guides", params.slug);
  return constructMetadata({
    title: item?.title || "深度指南",
    description: item?.description,
  });
}

export default async function GuidePage({ params }: { params: { slug: string } }) {
  const item = await getHubItem("guides", params.slug);
  if (!item) notFound();
  return <HubDetailPage item={item} type="guides" />;
}
