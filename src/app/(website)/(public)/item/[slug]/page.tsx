import { redirect } from "next/navigation";

interface ItemPageProps {
  params: { slug: string };
}

export default function ItemPage({ params }: ItemPageProps) {
  redirect(`/resources/${params.slug}`);
}
