import type { SiteConfig } from "@/types";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const siteConfig: SiteConfig = {
  name: "WorkBuddy Hub",
  tagline: "学会真正用好 WorkBuddy。",
  description:
    "WorkBuddy 学习、案例与最佳实践中心，通过学习路径、实战配方、场景指南与精选资源，帮助你快速掌握 WorkBuddy。",
  keywords: [
    "WorkBuddy",
    "WorkBuddy 教程",
    "WorkBuddy 入门",
    "WorkBuddy 自动化",
    "WorkBuddy Skill",
    "WorkBuddy 最佳实践",
  ],
  author: "WorkBuddy Hub",
  url: SITE_URL,
  logo: "/workbuddy-mark.svg",
  // set the logoDark if you have put the logo-dark.png in the public folder
  // logoDark: "/logo-dark.png",
  // please increase the version number when you update the image
  image: `${SITE_URL}/og-workbuddy.png?v=1`,
  mail: "hello@workbuddyhub.com",
  utm: {
    source: "workbuddyhub.com",
    medium: "referral",
    campaign: "navigation",
  },
  links: {
    // leave it blank if you don't want to show the link (don't delete)
    github: "https://github.com/",
  },
};
