import type { Metadata } from "next";
import BrowseClient from "@/components/browse/BrowseClient";
import { siteConfig } from "@/config/site";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

type BrowseSearchParams = Record<string, string | string[] | undefined>;

function getParam(searchParams: BrowseSearchParams, key: string): string {
  const v = searchParams[key];
  return Array.isArray(v) ? v[0] || "" : v || "";
}

async function fetchFiliereName(id: string): Promise<string | undefined> {
  try {
    const res = await fetch(`${API_BASE}/filieres`, { cache: "no-store" });
    if (!res.ok) return undefined;
    const data = await res.json();
    const arr = Array.isArray(data) ? data : data.filieres || [];
    return arr.find((f: any) => f.id === id)?.name;
  } catch {
    return undefined;
  }
}

async function fetchModuleName(id: string): Promise<string | undefined> {
  try {
    const res = await fetch(`${API_BASE}/modules/${id}`, { cache: "no-store" });
    if (!res.ok) return undefined;
    const m = await res.json();
    return m?.name;
  } catch {
    return undefined;
  }
}

async function fetchLevelName(id: string): Promise<string | undefined> {
  try {
    const res = await fetch(`${API_BASE}/levels`, { cache: "no-store" });
    if (!res.ok) return undefined;
    const data = await res.json();
    const arr = Array.isArray(data) ? data : data.levels || [];
    return arr.find((l: any) => l.id === id)?.name;
  } catch {
    return undefined;
  }
}

function buildCanonical(searchParams: BrowseSearchParams): string {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    const v = Array.isArray(value) ? value[0] : value;
    if (v) qs.append(key, v);
  }
  const query = qs.toString();
  return `${siteConfig.url}/browse${query ? `?${query}` : ""}`;
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<BrowseSearchParams> }): Promise<Metadata> {
  const sp = await searchParams;
  const filiereId = getParam(sp, "filiereId");
  const moduleId = getParam(sp, "moduleId");
  const levelId = getParam(sp, "levelId");

  const [filiere, module, level] = await Promise.all([
    filiereId ? fetchFiliereName(filiereId) : Promise.resolve(undefined),
    moduleId ? fetchModuleName(moduleId) : Promise.resolve(undefined),
    levelId ? fetchLevelName(levelId) : Promise.resolve(undefined),
  ]);

  let title: string;
  let description: string;

  if (module) {
    title = `Documents - ${module}`;
    description = `Consultez et téléchargez gratuitement les documents du module ${module}${filiere ? ` (filière ${filiere})` : ""} : cours, TD, TP, EFM et EFF de l'OFPPT.`;
  } else if (filiere) {
    title = `Documents - ${filiere}`;
    description = `Consultez et téléchargez gratuitement les documents pédagogiques de la filière ${filiere} : cours, TD, TP, EFM et EFF de l'OFPPT.`;
  } else if (level) {
    title = `Documents - ${level}`;
    description = `Consultez et téléchargez gratuitement les documents pédagogiques du niveau ${level} : cours, TD, TP, EFM et EFF de l'OFPPT.`;
  } else {
    title = "Parcourir les documents — Cours, EFF, EFM OFPPT";
    description = "Parcourez et filtrez tous les documents pédagogiques OFPPT : cours, TD, TP, EFM, EFF par niveau, filière, module et catégorie. Accès gratuit.";
  }

  return {
    title,
    description,
    alternates: { canonical: buildCanonical(sp) },
  };
}

async function getInitialDocuments(searchParams: BrowseSearchParams) {
  const q = getParam(searchParams, "q").trim();
  const levelId = getParam(searchParams, "levelId");
  const filiereId = getParam(searchParams, "filiereId");
  const categoryId = getParam(searchParams, "categoryId");
  const moduleId = getParam(searchParams, "moduleId");
  const sort = getParam(searchParams, "sort") || "latest";
  const page = Math.max(1, Number(getParam(searchParams, "page")) || 1);

  const params: Record<string, string> = { sort, page: String(page), limit: "20" };
  if (q) params.q = q;
  if (levelId) params.levelId = levelId;
  if (filiereId) params.filiereId = filiereId;
  if (categoryId) params.categoryId = categoryId;
  if (moduleId) params.moduleId = moduleId;

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

export default async function BrowsePage({ searchParams }: { searchParams: Promise<BrowseSearchParams> }) {
  const sp = await searchParams;
  const initial = await getInitialDocuments(sp);

  return <BrowseClient initialData={initial} />;
}
