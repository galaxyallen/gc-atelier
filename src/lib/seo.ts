import type { Metadata } from "next";

const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

export function createMetadata({
  title,
  description,
  path = "",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const fullTitle = title === "GC ATELIER" ? title : `${title} — GC ATELIER`;
  const url = `${siteUrl}${path}`;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: "GC ATELIER",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
