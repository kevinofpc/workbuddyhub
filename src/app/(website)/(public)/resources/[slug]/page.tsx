import { HubDetailPage } from "@/components/hub/detail-page";
import { getHubItem } from "@/data/hub";
import { constructMetadata } from "@/lib/metadata";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const item = await getHubItem("resources", params.slug);
  return constructMetadata({
    title: item?.title || "精选资源",
    description: item?.description,
  });
}

export default async function ResourcePage({ params }: { params: { slug: string } }) {
  const item = await getHubItem("resources", params.slug);
  if (!item) notFound();
  return <HubDetailPage item={item} type="resources" />;
}
