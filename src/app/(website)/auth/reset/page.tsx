import { ResetForm } from "@/components/auth/reset-form";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "重置密码",
  description: "找回你的 WorkBuddy Hub 账户。",
  canonicalUrl: `${siteConfig.url}/auth/reset`,
});

const ResetPage = () => {
  return <ResetForm />;
};

export default ResetPage;
