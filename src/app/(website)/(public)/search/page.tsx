import { redirect } from "next/navigation";

export default function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const query = typeof searchParams?.q === "string" ? searchParams.q : "";
  redirect(query ? `/discover?q=${encodeURIComponent(query)}` : "/discover");
}
