import { ResourceSubmitForm } from "@/components/submit/resource-submit-form";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "提交资源",
  description: "向 WorkBuddy Hub 推荐高质量教程、指南、视频、案例与社区资源。",
  canonicalUrl: `${siteConfig.url}/submit`,
});

export default function SubmitPage() {
  return <ResourceSubmitForm />;
}
