import type { DashboardConfig } from "@/types";

export const dashboardConfig: DashboardConfig = {
  menus: [
    {
      title: "首页",
      href: "/",
      icon: "home",
    },
    {
      title: "我的内容",
      href: "/dashboard",
      icon: "dashboard",
    },
    {
      title: "账户设置",
      href: "/settings",
      icon: "settings",
    },
    {
      title: "提交资源",
      href: "/submit",
      icon: "submit",
    },
  ],
};
