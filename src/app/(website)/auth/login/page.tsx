import { LoginForm } from "@/components/auth/login-form";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "登录",
  description: "登录 WorkBuddy Hub，管理收藏与投稿。",
  canonicalUrl: `${siteConfig.url}/auth/login`,
});

const LoginPage = () => {
  return <LoginForm className="border-none" />;
};

export default LoginPage;
