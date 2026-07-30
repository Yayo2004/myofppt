import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/contact",
          "/browse",
          "/filtrer",
          "/documents/",
          "/privacy",
          "/terms",
        ],
        disallow: [
          "/admin/",
          "/api/",
        ],
      },
    ],
    sitemap: "https://ofppt-platforme.vercel.app/sitemap.xml",
  };
}
