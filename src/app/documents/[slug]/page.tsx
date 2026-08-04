import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DocumentViewerClient from "@/components/document/DocumentViewerClient";
import { siteConfig } from "@/config/site";
import { resolveDescription } from "@/lib/description";
import type { AppDoc } from "@/types/document";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

async function getDocument(slug: string): Promise<AppDoc | null> {
  try {
    const res = await fetch(`${API_BASE}/documents/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDocument(slug);

  if (!doc) {
    return { title: "Document introuvable" };
  }

  const filiere = doc.filiere?.name || doc.filiereName || "";
  const moduleName = doc.module?.name || doc.moduleName || "";

  const title = doc.seoTitle || `${doc.title}${filiere ? ` — ${filiere}` : ""}${moduleName ? `, ${moduleName}` : ""}`;
  const description = doc.seoDesc || resolveDescription(doc).slice(0, 155);

  const pageUrl = `${siteConfig.url}/documents/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description,
      type: "article",
      url: pageUrl,
      siteName: siteConfig.name,
      locale: "fr_FR",
    },
  };
}

export default async function DocumentPage({ params }: Props) {
  const { slug } = await params;
  const doc = await getDocument(slug);

  if (!doc) notFound();

  const initialDoc = { ...doc, storageUrl: undefined, thumbnailUrl: undefined };

  const filiere = doc.filiere?.name || doc.filiereName || "";
  const moduleName = doc.module?.name || doc.moduleName || "";
  const pageUrl = `${siteConfig.url}/documents/${slug}`;

  const items = [
    { name: "Accueil", url: siteConfig.url },
  ];

  if (filiere) {
    items.push({ name: filiere, url: `${siteConfig.url}/browse?filiereId=${doc.filiereId}` });
  }

  if (moduleName && doc.moduleId) {
    items.push({ name: moduleName, url: `${siteConfig.url}/browse?moduleId=${doc.moduleId}` });
  }

  items.push({ name: doc.title, url: pageUrl });

  const breadcrumbLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  });

  return <DocumentViewerClient initialDoc={initialDoc} pageUrl={pageUrl} breadcrumbLd={breadcrumbLd} />;
}
