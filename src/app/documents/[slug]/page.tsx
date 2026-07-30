import type { Metadata } from "next";
import DocumentViewerClient from "@/components/document/DocumentViewerClient";
import { siteConfig } from "@/config/site";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

async function getDocument(slug: string) {
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
  const module = doc.module?.name || doc.moduleName || "";
  const category = doc.category?.name || doc.categoryName || "";

  const title = `${doc.title}${filiere ? ` — ${filiere}` : ""}${module ? `, ${module}` : ""}`;
  const description = doc.description
    ? doc.description.slice(0, 155)
    : `Consultez et téléchargez "${doc.title}" (${category}) pour la filière ${filiere}${module ? `, module ${module}` : ""}. Document pédagogique OFPPT gratuit.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
  };
}

export default async function DocumentPage({ params }: Props) {
  const { slug } = await params;
  const doc = await getDocument(slug);

  let breadcrumbLd = "";

  if (doc) {
    const filiere = doc.filiere?.name || doc.filiereName || "";
    const module = doc.module?.name || doc.moduleName || "";

    const items = [
      { name: "Accueil", url: siteConfig.url },
    ];

    if (filiere) {
      items.push({ name: filiere, url: `${siteConfig.url}/browse?filiereId=${doc.filiereId}` });
    }

    if (module && doc.moduleId) {
      items.push({ name: module, url: `${siteConfig.url}/browse?moduleId=${doc.moduleId}` });
    }

    items.push({ name: doc.title, url: `${siteConfig.url}/documents/${slug}` });

    breadcrumbLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        item: item.url,
      })),
    });
  }

  return <DocumentViewerClient breadcrumbLd={breadcrumbLd} />;
}
