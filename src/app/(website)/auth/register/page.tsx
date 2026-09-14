import { RegisterForm } from "@/components/auth/register-form";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "注册",
  description: "创建 WorkBuddy Hub 账户。",
  canonicalUrl: `${siteConfig.url}/auth/register`,
});

const RegisterPage = () => {
  return <RegisterForm />;
};

export default RegisterPage;
