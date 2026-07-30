import { siteConfig } from "@/config/site";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function GET() {
  let docs: any[] = [];
  let filieres: any[] = [];
  try {
    const [docRes, filiereRes] = await Promise.all([
      fetch(`${API_BASE}/documents?limit=1000`),
      fetch(`${API_BASE}/filieres`),
    ]);
    const docData = await docRes.json();
    const filiereData = await filiereRes.json();
    docs = docData.docs || [];
    filieres = filiereData || (filiereData.filieres || []);
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
    (f: any) =>
      `<url><loc>${siteUrl}/browse?filiereId=${f.id}</loc><priority>0.8</priority></url>`
  );

  const docUrls = docs.map(
    (d: any) =>
      `<url><loc>${siteUrl}/documents/${d.slug || d.id}</loc><lastmod>${d.updatedAt || d.createdAt || new Date().toISOString()}</lastmod><priority>0.6</priority></url>`
  );

  const urls = [
    ...staticPages.map(
      (p) => `<url><loc>${p.loc}</loc><priority>${p.priority}</priority></url>`
    ),
    ...filiereUrls,
    ...docUrls,
  ];

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`,
    { headers: { "Content-Type": "application/xml" } }
  );
}
