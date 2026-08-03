import { siteConfig } from "@/config/site";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const dynamic = "force-dynamic";

interface SitemapDoc {
  id: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface SitemapFiliere {
  id: string;
}

interface SitemapModule {
  id: string;
  updatedAt?: string;
}

interface SitemapLevel {
  id: string;
}

async function fetchAllDocuments(): Promise<SitemapDoc[]> {
  const docs: SitemapDoc[] = [];
  try {
    const first = await fetch(`${API_BASE}/documents?page=1&limit=500`, { cache: "no-store" });
    const firstData = await first.json();
    docs.push(...(firstData.docs || []));
    const totalPages = firstData.totalPages || 1;
    for (let p = 2; p <= totalPages; p++) {
      const res = await fetch(`${API_BASE}/documents?page=${p}&limit=500`, { cache: "no-store" });
      const data = await res.json();
      docs.push(...(data.docs || []));
    }
  } catch {
    // API not available, continue with what we have
  }
  return docs;
}

export async function GET() {
  let docs: SitemapDoc[] = [];
  let filieres: SitemapFiliere[] = [];
  let modules: SitemapModule[] = [];
  let levels: SitemapLevel[] = [];
  try {
    const [docData, filiereRes, moduleRes, levelRes] = await Promise.all([
      fetchAllDocuments(),
      fetch(`${API_BASE}/filieres`, { cache: "no-store" }),
      fetch(`${API_BASE}/modules`, { cache: "no-store" }),
      fetch(`${API_BASE}/levels`, { cache: "no-store" }),
    ]);
    const filiereData = await filiereRes.json();
    const moduleData = await moduleRes.json();
    const levelData = await levelRes.json();
    docs = docData;
    filieres = Array.isArray(filiereData) ? filiereData : filiereData.filieres || [];
    modules = moduleData.data || moduleData.modules || [];
    levels = Array.isArray(levelData) ? levelData : levelData.levels || [];
  } catch {
    // API not available, return basic sitemap
  }

  const siteUrl = siteConfig.url;

  const staticPages = [
    { loc: siteUrl, priority: "1.0" },
    { loc: `${siteUrl}/about`, priority: "0.7" },
    { loc: `${siteUrl}/contact`, priority: "0.6" },
    { loc: `${siteUrl}/browse`, priority: "0.9" },
    { loc: `${siteUrl}/filtrer`, priority: "0.9" },
    { loc: `${siteUrl}/privacy`, priority: "0.3" },
    { loc: `${siteUrl}/terms`, priority: "0.3" },
  ];

  const filiereUrls = filieres.map(
    (f) =>
      `<url><loc>${siteUrl}/browse?filiereId=${f.id}</loc><priority>0.8</priority></url>`
  );

  const moduleUrls = modules.map(
    (m) =>
      `<url><loc>${siteUrl}/browse?moduleId=${m.id}</loc><lastmod>${m.updatedAt || new Date().toISOString()}</lastmod><priority>0.7</priority></url>`
  );

  const levelUrls = levels.map(
    (l) =>
      `<url><loc>${siteUrl}/browse?levelId=${l.id}</loc><priority>0.6</priority></url>`
  );

  const docUrls = docs.map(
    (d) =>
      `<url><loc>${siteUrl}/documents/${d.slug || d.id}</loc><lastmod>${d.updatedAt || d.createdAt || new Date().toISOString()}</lastmod><priority>0.6</priority></url>`
  );

  const urls = [
    ...staticPages.map(
      (p) => `<url><loc>${p.loc}</loc><priority>${p.priority}</priority></url>`
    ),
    ...filiereUrls,
    ...moduleUrls,
    ...levelUrls,
    ...docUrls,
  ];

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`,
    { headers: { "Content-Type": "application/xml" } }
  );
}
