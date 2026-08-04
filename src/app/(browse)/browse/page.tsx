import type { Metadata } from "next";
import BrowseClient from "@/components/browse/BrowseClient";

export const metadata: Metadata = {
  title: "Parcourir les documents — Cours, EFF, EFM OFPPT",
  description: "Parcourez et filtrez tous les documents pédagogiques OFPPT : cours, TD, TP, EFM, EFF par niveau, filière, module et catégorie. Accès gratuit.",
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

async function getInitialDocuments(searchParams: Record<string, string | string[] | undefined>) {
  const get = (key: string) => {
    const v = searchParams[key];
    return Array.isArray(v) ? v[0] : v;
  };

  const q = get("q")?.trim() || "";
  const levelId = get("levelId") || "";
  const filiereId = get("filiereId") || "";
  const categoryId = get("categoryId") || "";
  const sort = get("sort") || "popular";
  const page = Math.max(1, Number(get("page")) || 1);

  const params: Record<string, string> = { sort, page: String(page), limit: "20" };
  if (q) params.q = q;
  if (levelId) params.levelId = levelId;
  if (filiereId) params.filiereId = filiereId;
  if (categoryId) params.categoryId = categoryId;

  try {
    const url = new URL(`${API_BASE}/documents`);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    const docs = (data.docs || []).map(({ storageUrl, thumbnailUrl, ...rest }: any) => ({
      ...rest,
      hasThumbnail: Boolean(thumbnailUrl),
    }));
    return { ...data, docs, params };
  } catch {
    return null;
  }
}

export default async function BrowsePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const initial = await getInitialDocuments(sp);

  return <BrowseClient initialData={initial} />;
}
