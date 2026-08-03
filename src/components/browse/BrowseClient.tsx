"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, ArrowLeft } from "lucide-react";
import { useDocuments } from "@/hooks/use-documents";
import { DocumentCard } from "@/components/document/DocumentCard";
import { AdBanner } from "@/components/ads/AdBanner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { BrowseFilterSidebar } from "@/components/browse/BrowseFilterSidebar";
import { cn } from "@/lib/utils";
import type { DocumentsPage } from "@/types/document";

export default function BrowseClient({ initialData }: { initialData?: DocumentsPage | null }) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-8"><Skeleton className="h-96 rounded-xl" /></div>}>
      <BrowsePage initialData={initialData} />
    </Suspense>
  );
}

function BrowsePage({ initialData }: { initialData?: DocumentsPage | null }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [levelId, setLevelId] = useState(searchParams.get("levelId") || "");
  const [filiereId, setFiliereId] = useState(searchParams.get("filiereId") || "");
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "popular");
  const [page, setPage] = useState(1);
  const [mobileOpen, setMobileOpen] = useState(false);

  const filters = { levelId, filiereId, categoryId, sort };
  const activeFilterCount = [levelId, filiereId, categoryId].filter(Boolean).length;

  function handleFilterChange(key: string, value: string) {
    if (key === "levelId") setLevelId(value);
    else if (key === "filiereId") setFiliereId(value);
    else if (key === "categoryId") setCategoryId(value);
    else if (key === "sort") setSort(value);
    setPage(1);
  }

  function clearFilters() {
    setLevelId("");
    setFiliereId("");
    setCategoryId("");
    setPage(1);
  }

  const params: Record<string, string> = {};
  if (query.trim()) params.q = query.trim();
  if (levelId) params.levelId = levelId;
  if (filiereId) params.filiereId = filiereId;
  if (categoryId) params.categoryId = categoryId;

  const { data, isLoading } = useDocuments({ ...params, sort, page, limit: 20 } as any, initialData);

  function applySearch() {
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-28">
        {/* Back + Header */}
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-5 flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Tous les documents</h1>
          <p className="mt-1 text-sm text-gray-500">Parcourez et filtrez l&apos;ensemble des ressources pédagogiques</p>
        </div>

        {/* Search bar */}
        <div className="mb-8 relative max-w-lg">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applySearch()}
            placeholder="Rechercher un document..."
            className="h-11 pl-10 pr-4 text-sm rounded-xl border-gray-200 bg-white shadow-sm focus:border-purple-400 focus:ring-4 focus:ring-purple-50"
          />
        </div>

        {/* Active filter pills (mobile friendly) */}
        {activeFilterCount > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {levelId && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700">
                Niveau sélectionné
                <button onClick={() => handleFilterChange("levelId", "")} className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-purple-200">
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </span>
            )}
            {filiereId && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700">
                Filière sélectionnée
                <button onClick={() => handleFilterChange("filiereId", "")} className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-purple-200">
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </span>
            )}
            {categoryId && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700">
                Catégorie sélectionnée
                <button onClick={() => handleFilterChange("categoryId", "")} className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-purple-200">
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </span>
            )}
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar */}
          <BrowseFilterSidebar
            filters={filters}
            onChange={handleFilterChange}
            onClear={clearFilters}
            activeCount={activeFilterCount}
            mobileOpen={mobileOpen}
            onMobileOpen={() => setMobileOpen(true)}
            onMobileClose={() => setMobileOpen(false)}
          />

          {/* Main content */}
          <div className="min-w-0 flex-1">
            <AdBanner slotKey="browseSidebar" className="mb-6" />

            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
              </div>
            ) : !data?.docs?.length ? (
              <div className="py-16 text-center">
                <Search className="mx-auto mb-4 h-16 w-16 text-gray-200" />
                <h2 className="text-xl font-semibold text-gray-400">Aucun document trouvé</h2>
                <p className="mt-1 text-sm text-gray-400">Essayez de modifier vos filtres</p>
              </div>
            ) : (
              <>
                <p className="mb-4 text-sm text-gray-500">{data.total} document{data.total > 1 ? "s" : ""}</p>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {data.docs.map((doc: any, i: number) => (
                    <DocumentCard key={doc.id} doc={doc} index={i} />
                  ))}
                </div>

                {/* Pagination */}
                {data.totalPages > 1 && (() => {
                  const pages: (number | "...")[] = [];
                  const total = data.totalPages;
                  const maxVisible = 4;

                  if (total <= maxVisible + 2) {
                    for (let i = 1; i <= total; i++) pages.push(i);
                  } else {
                    pages.push(1);
                    let start = Math.max(2, page - 1);
                    let end = Math.min(total - 1, start + maxVisible - 1);
                    if (end - start < maxVisible - 1) start = Math.max(2, end - maxVisible + 1);
                    if (start > 2) pages.push("...");
                    for (let i = start; i <= end; i++) pages.push(i);
                    if (end < total - 1) pages.push("...");
                    pages.push(total);
                  }

                  return (
                    <div className="mt-10 flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1}
                        className="flex h-10 items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 hover:border-gray-300 disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
                        <span className="hidden sm:inline">Précédent</span>
                      </button>
                      <div className="flex items-center gap-1">
                        {pages.map((p, i) =>
                          p === "..." ? (
                            <span key={`dots-${i}`} className="flex h-10 w-8 items-center justify-center text-sm text-gray-300">...</span>
                          ) : (
                            <button
                              key={p}
                              onClick={() => setPage(p)}
                              className={cn(
                                "h-10 min-w-[40px] rounded-xl text-sm font-medium transition-all duration-200",
                                p === page
                                  ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/20"
                                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                              )}
                            >
                              {p}
                            </button>
                          )
                        )}
                      </div>
                      <button
                        onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                        disabled={page >= data.totalPages}
                        className="flex h-10 items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 hover:border-gray-300 disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <span className="hidden sm:inline">Suivant</span>
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg>
                      </button>
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
