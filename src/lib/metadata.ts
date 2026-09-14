import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

/**
 * Construct the metadata object for the current page (in docs/guides)
 */
export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  canonicalUrl,
  image = siteConfig.image,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  image?: string;
  noIndex?: boolean;
} = {}): Metadata {
  const fullTitle = title ? `${title} - ${siteConfig.name}` : siteConfig.name;
  return {
    title: fullTitle,
    description,
    keywords: siteConfig.keywords,
    creator: siteConfig.author,
    authors: [
      {
        name: siteConfig.author,
      },
    ],
    alternates: canonicalUrl
      ? {
          canonical: canonicalUrl,
        }
      : undefined,
    openGraph: {
      type: "website",
      locale: "zh_CN",
      url: siteConfig.url,
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      site: siteConfig.url,
      creator: siteConfig.author,
    },
    icons: {
      icon: "/workbuddy-mark.svg",
      shortcut: "/workbuddy-mark.svg",
      apple: "/workbuddy-mark.svg",
    },
    metadataBase: new URL(siteConfig.url),
    manifest: `${siteConfig.url}/site.webmanifest`,
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
