import {
  cases,
  categoryDefinitions,
  collectionDefinitions,
  guides,
  recipes,
  resources,
  tagDefinitions,
  useCases,
} from "@/content/workbuddy";
import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date("2026-09-03");
  const staticRoutes = [
    "",
    "/start",
    "/learn",
    "/workbuddy-map",
    "/recipes",
    "/use-cases",
    "/guides",
    "/cases",
    "/discover",
    "/collection",
    "/category",
    "/tag",
    "/about",
    "/privacy",
  ];

  const dynamicRoutes = [
    ...recipes.map((item) => `/recipes/${item.slug}`),
    ...useCases.map((item) => `/use-cases/${item.slug}`),
    ...guides.map((item) => `/guides/${item.slug}`),
    ...cases.map((item) => `/cases/${item.slug}`),
    ...resources.map((item) => `/resources/${item.slug}`),
    ...collectionDefinitions.map((item) => `/collection/${item.slug}`),
    ...categoryDefinitions.map((item) => `/category/${item.slug}`),
    ...tagDefinitions.map((item) => `/tag/${item.slug}`),
  ];

  return [...staticRoutes, ...dynamicRoutes].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: updated,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : route.split("/").length === 2 ? 0.8 : 0.7,
  }));
}
