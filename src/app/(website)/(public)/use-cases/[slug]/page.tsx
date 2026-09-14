import { HubDetailPage } from "@/components/hub/detail-page";
import { getHubItem } from "@/data/hub";
import { constructMetadata } from "@/lib/metadata";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const item = await getHubItem("use-cases", params.slug);
  return constructMetadata({
    title: item?.title || "使用场景",
    description: item?.description,
  });
}

export default async function UseCasePage({ params }: { params: { slug: string } }) {
  const item = await getHubItem("use-cases", params.slug);
  if (!item) notFound();
  return <HubDetailPage item={item} type="use-cases" />;
}
