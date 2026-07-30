"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, GraduationCap, BookOpen, FileText, Layers, FileArchive } from "lucide-react";
import { useLevels, useFilieres, useFiliere, useCategories, useDocuments } from "@/hooks/use-documents";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CategoryBadge } from "@/components/ui/category-badge";
import { CATEGORY_META } from "@/lib/category-meta";
import { cn, formatFileSize } from "@/lib/utils";
import { useFilterStore } from "@/stores/filter-store";
import { getFileUrl, api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const stepVariants = {
  enter: { x: 60, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -60, opacity: 0 },
};

export function FilterWizard() {
  const store = useFilterStore();

  const titles = ["Choisissez votre niveau et votre année", "Sélectionnez votre filière", "Quel module souhaitez-vous explorer ?", "Que souhaitez-vous découvrir ?", "Type de Contenu", "Ressources du Module"];

  const [filiereSearch, setFiliereSearch] = useState("");
  const [moduleSearch, setModuleSearch] = useState("");

  const { data: levels, isLoading: levelsLoading } = useLevels();
  const { data: filieres, isLoading: filieresLoading } = useFilieres();
  const { data: allCategories } = useCategories();
  const { data: filiereData } = useFiliere(store.filiereSlug || "");

  const { data: moduleDocs } = useQuery({
    queryKey: ["documents", "categories-for", { levelId: store.levelId, filiereId: store.filiereId, moduleId: store.moduleId }],
    queryFn: () =>
      api.get<{ docs: any[]; total: number }>("/documents", {
        levelId: store.levelId || "",
        filiereId: store.filiereId || "",
        moduleId: store.moduleId || "",
        limit: "999",
      }),
    enabled: store.step === 3 && !!store.moduleId,
  });

  const { data: effDocs } = useQuery({
    queryKey: ["documents", "categories-for-eff", { levelId: store.levelId, filiereId: store.filiereId }],
    queryFn: () =>
      api.get<{ docs: any[]; total: number }>("/documents", {
        levelId: store.levelId || "",
        filiereId: store.filiereId || "",
        limit: "999",
      }),
    enabled: store.step === 3 && !!store.filiereId,
  });

  const categories = useMemo(() => {
    if (!allCategories) return [];
    const docCatIds = new Set((moduleDocs?.docs ?? []).map((d: any) => d.categoryId).filter(Boolean));
    const effCatIds = new Set((effDocs?.docs ?? []).map((d: any) => d.categoryId).filter(Boolean));
    const effCategory = allCategories.find((cat: any) => cat.name === "EFF");
    return allCategories.filter((cat: any) => {
      if (effCategory && cat.id === effCategory.id) return effCatIds.has(cat.id);
      return docCatIds.has(cat.id);
    });
  }, [allCategories, moduleDocs, effDocs]);

  const filteredFilieres = useMemo(() => {
    if (!filieres) return [];
    let result = filieres;
    if (store.levelId) {
      result = result.filter((f: any) => f.levelId === store.levelId);
    }
    if (filiereSearch) {
      const q = filiereSearch.toLowerCase();
      result = result.filter(
        (f: any) => f.name.toLowerCase().includes(q) || f.code.toLowerCase().includes(q)
      );
    }
    return result;
  }, [filieres, filiereSearch, store.levelId]);

  const filteredModules = useMemo(() => {
    if (!filiereData?.modules) return [];
    if (!moduleSearch) return filiereData.modules;
    const q = moduleSearch.toLowerCase();
    return filiereData.modules.filter(
      (m: any) => m.name.toLowerCase().includes(q) || m.code.toLowerCase().includes(q)
    );
  }, [filiereData, moduleSearch]);

  const isEffCategory = store.categoryName === "EFF";

  const { data: docsData, isLoading: docsLoading } = useDocuments({
    levelId: store.levelId || undefined,
    filiereId: store.filiereId || undefined,
    moduleId: isEffCategory ? undefined : (store.moduleId || undefined),
    categoryId: store.categoryId || undefined,
    limit: 50,
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 pt-20">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {store.step > 0 && store.step < 4 && (
            <button onClick={store.back} className="flex items-center gap-1 text-sm font-medium text-gray-400 transition-colors hover:text-gray-700">
              <ArrowLeft className="h-4 w-4" /> Retour
            </button>
          )}
          {store.step === 4 && (
            <button onClick={() => store.goToStep(3)} className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-blue-500/30 active:scale-95">
              <ArrowLeft className="h-4 w-4" /> Modifier les filtres
            </button>
          )}
        </div>
        {store.step < 4 && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 shadow-sm",
                  s === store.step + 1
                    ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-blue-500/20 scale-110"
                    : s < store.step + 1
                    ? "bg-gradient-to-br from-blue-100 to-purple-100 text-purple-600"
                    : "bg-gray-100 text-gray-300"
                )}
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={store.step}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.2 }}
        >
          {store.step < 4 && (
            <h1 className="mb-8 text-center text-2xl font-bold text-gray-900">
              {titles[store.step]}
            </h1>
          )}

          {store.step === 0 && (
            <StepLevel levels={levels ?? []} loading={levelsLoading} onSelect={store.setLevel} />
          )}
          {store.step === 1 && (
            <StepFiliere
              filieres={filteredFilieres ?? []}
              loading={filieresLoading}
              search={filiereSearch}
              onSearchChange={setFiliereSearch}
              onSelect={(id: string, name: string, code: string) => {
                setFiliereSearch("");
                const f = filieres?.find((f: any) => f.id === id);
                store.setFiliere(id, name, code, f?.slug || "");
              }}
            />
          )}
          {store.step === 2 && (
            <StepModule
              modules={filteredModules ?? []}
              loading={!filiereData}
              search={moduleSearch}
              onSearchChange={setModuleSearch}
              onSelect={(id, name) => {
                setModuleSearch("");
                store.setModule(id, name);
              }}
            />
          )}
          {store.step === 3 && (
            <StepCategory
              categories={categories ?? []}
              loading={!moduleDocs}
              onSelect={store.setCategory}
            />
          )}
          {store.step === 4 && (
            <StepResults docs={docsData?.docs ?? []} loading={docsLoading} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function StepLevel({ levels, loading, onSelect }: { levels: any[]; loading: boolean; onSelect: (id: string, name: string) => void }) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {levels?.map((level: any) => (
        <motion.button
          key={level.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(level.id, level.name)}
          className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-white p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] via-transparent to-purple-500/[0.03] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative z-10">
            <GraduationCap className="mx-auto mb-4 h-12 w-12 text-purple-600 transition-all duration-300 group-hover:scale-110" />
            <h3 className="text-lg font-semibold text-gray-900">{level.name}</h3>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

function StepFiliere({ filieres, loading, search, onSearchChange, onSelect }: { filieres: any[]; loading: boolean; search: string; onSearchChange: (v: string) => void; onSelect: (id: string, name: string, code: string) => void }) {
  return (
    <div>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Rechercher une filière..." className="pl-10" />
      </div>
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filieres?.map((f: any) => (
            <motion.button
              key={f.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(f.id, f.name, f.code)}
              className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-white p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] via-transparent to-purple-500/[0.02] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="mb-2 flex items-center justify-between">
                  <BookOpen className="h-8 w-8 text-purple-600 transition-all duration-300 group-hover:scale-110" />
                  <span className="rounded-full bg-gradient-to-r from-blue-50 to-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-600">{f.code}</span>
                </div>
                <h3 className="font-semibold text-gray-900">{f.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{f._count?.modules || f.moduleCount || 0} modules · {f._count?.documents || 0} docs</p>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}

function StepModule({ modules, loading, search, onSearchChange, onSelect }: { modules: any[]; loading: boolean; search: string; onSearchChange: (v: string) => void; onSelect: (id: string, name: string) => void }) {
  return (
    <div>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Rechercher un module..." className="pl-10" />
      </div>
      {loading ? (
        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {modules?.map((m: any) => (
            <motion.button
              key={m.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelect(m.id, m.name)}
              className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-white p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] via-transparent to-purple-500/[0.02] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-gray-900">{m.name}</h3>
                  <p className="text-sm text-gray-500">{m.code}{m.hours ? ` · ${m.hours}h` : ""}</p>
                </div>
                <Layers className="ml-3 h-5 w-5 shrink-0 text-gray-300 transition-all duration-300 group-hover:scale-110 group-hover:text-purple-500" />
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}

function StepCategory({ categories, loading, onSelect }: { categories: any[]; loading: boolean; onSelect: (id: string, name: string) => void }) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="py-16 text-center">
        <Layers className="mx-auto mb-4 h-16 w-16 text-gray-300" />
        <h2 className="text-xl font-semibold text-gray-500">Aucune ressource disponible</h2>
        <p className="mt-2 text-gray-400">Il n&apos;y a pas de documents pour ce module. Essayez un autre module.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {categories?.map((cat: any) => {
        const meta = CATEGORY_META[cat.name] || CATEGORY_META["Cours"];
        const Icon = meta.icon;
        return (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(cat.id, cat.name)}
            className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            style={{
              borderColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${meta.bgHover} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
            <div className={`absolute -inset-px rounded-xl bg-gradient-to-br ${meta.borderHover} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
            <div className="relative z-10">
              <div className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${meta.bgIcon} transition-all duration-300 group-hover:scale-110`}>
                <Icon className={`h-7 w-7 ${meta.textColor}`} />
              </div>
              <h3 className="font-semibold text-gray-900">{cat.name}</h3>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

function StepResults({ docs, loading }: { docs: any[]; loading: boolean }) {
  const [previewId, setPreviewId] = useState<string | null>(null);
  async function handleDownload(doc: any) {
    const url = getFileUrl(doc.storageUrl) || `/files/${doc.fileName}`;
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = doc.fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {}
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  if (docs.length === 0) {
    return (
      <div className="py-16 text-center">
        <FileText className="mx-auto mb-4 h-16 w-16 text-gray-300" />
        <h2 className="text-xl font-semibold text-gray-500">Aucun document trouvé</h2>
        <p className="mt-2 text-gray-400">Essayez de modifier vos filtres de recherche.</p>
        <button className="mt-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-purple-500/30 active:scale-95" onClick={() => useFilterStore.getState().goToStep(3)}>Modifier les filtres</button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Ressources du Module</h1>
        <p className="mt-1 text-sm text-gray-500">{docs.length} document{docs.length > 1 ? "s" : ""} trouvé{docs.length > 1 ? "s" : ""}</p>
      </div>
      <div className="space-y-4">
        {docs.map((doc: any) => {
          const isOpen = previewId === doc.id;
          return (
            <Card key={doc.id} className="w-full overflow-hidden">
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 sm:text-base">{doc.title}</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {doc.module && <Badge variant="outline">{doc.module.name}</Badge>}
                      {doc.category && <CategoryBadge name={doc.category.name || doc.categoryName} />}
                      {doc.level && <Badge variant="secondary">{doc.level.name || doc.levelName}</Badge>}
                    </div>
                    <p className="mt-1.5 text-xs text-gray-400">
                      {formatFileSize(doc.fileSize)} · {doc.views} vues · {doc.downloads} téléch.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      onClick={() => setPreviewId(isOpen ? null : doc.id)}
                      className="uiverse-btn uiverse-btn-outline"
                    >
                      <div className="wrapper flex items-center justify-center gap-1.5">
                        {isOpen ? (
                          <span className="hidden sm:inline text-white">Masquer</span>
                        ) : (
                          <span className="hidden sm:inline text-white">Voir</span>
                        )}
                        <div className="circle circle-12" />
                        <div className="circle circle-11" />
                        <div className="circle circle-10" />
                        <div className="circle circle-9" />
                        <div className="circle circle-8" />
                        <div className="circle circle-7" />
                        <div className="circle circle-6" />
                        <div className="circle circle-5" />
                        <div className="circle circle-4" />
                        <div className="circle circle-3" />
                        <div className="circle circle-2" />
                        <div className="circle circle-1" />
                      </div>
                    </button>
                    <button
                      onClick={() => handleDownload(doc)}
                      className="uiverse-btn"
                    >
                      <div className="wrapper flex items-center justify-center gap-1.5">
                        <span className="hidden sm:inline">Télécharger</span>
                        <div className="circle circle-12" />
                        <div className="circle circle-11" />
                        <div className="circle circle-10" />
                        <div className="circle circle-9" />
                        <div className="circle circle-8" />
                        <div className="circle circle-7" />
                        <div className="circle circle-6" />
                        <div className="circle circle-5" />
                        <div className="circle circle-4" />
                        <div className="circle circle-3" />
                        <div className="circle circle-2" />
                        <div className="circle circle-1" />
                      </div>
                    </button>
                  </div>
                </div>
                {isOpen && (
                  <div className="mt-3 overflow-hidden rounded-lg border border-gray-200">
                    {doc.fileType === "zip" ? (
                      <div className="flex h-[200px] items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 sm:h-[300px]">
                        <div className="flex flex-col items-center gap-3">
                          <FileArchive className="h-16 w-16 text-orange-500 sm:h-20 sm:w-20" />
                          <span className="rounded-md bg-orange-500 px-2 py-0.5 text-xs font-bold text-white">ZIP</span>
                          <p className="text-sm text-orange-600">Prévisualisation non disponible</p>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full overflow-hidden" style={{ paddingBottom: "min(85%, 700px)" }}>
                        <iframe
                          src={getFileUrl(doc.storageUrl) || `/files/${doc.fileName}`}
                          className="absolute inset-0 h-full w-full"
                          title={doc.title}
                        />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="mt-6 text-center">
        <button onClick={() => useFilterStore.getState().reset()} className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-purple-500/30 active:scale-95">
          Recommencer la recherche
        </button>
      </div>
    </div>
  );
}