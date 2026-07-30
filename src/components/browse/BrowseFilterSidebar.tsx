"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, RotateCcw, GraduationCap, BookOpen, Layers, ArrowUpDown } from "lucide-react";
import { useLevels, useFilieres, useCategories } from "@/hooks/use-documents";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface FilterState {
  levelId: string;
  filiereId: string;
  categoryId: string;
  sort: string;
}

interface BrowseFilterSidebarProps {
  filters: FilterState;
  onChange: (key: keyof FilterState, value: string) => void;
  onClear: () => void;
  activeCount: number;
  mobileOpen: boolean;
  onMobileOpen: () => void;
  onMobileClose: () => void;
}

function FilterSelect({
  icon: Icon,
  label,
  value,
  onChange,
  options,
  placeholder,
  loading,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full appearance-none rounded-xl border px-4 py-3 pr-10 text-sm font-medium transition-all duration-200 outline-none",
            value
              ? "border-purple-200 bg-purple-50/60 text-purple-700 shadow-sm shadow-purple-500/5"
              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
          )}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-purple-100 text-purple-500 transition-colors hover:bg-purple-200"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}

function FilterContent({
  filters,
  onChange,
  onClear,
  activeCount,
}: {
  filters: FilterState;
  onChange: (key: keyof FilterState, value: string) => void;
  onClear: () => void;
  activeCount: number;
}) {
  const { data: levels, isLoading: levelsLoading } = useLevels();
  const { data: filieres, isLoading: filieresLoading } = useFilieres();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const filteredFilieres = filieres?.filter(
    (f: any) => !filters.levelId || f.levelId === filters.levelId
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-purple-600" />
          <span className="text-sm font-bold text-gray-900">Filtres</span>
          {activeCount > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-purple-600 px-1.5 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <RotateCcw className="h-3 w-3" />
            Tout effacer
          </button>
        )}
      </div>

      <div className="h-px bg-gray-100" />

      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
        <FilterSelect
          icon={GraduationCap}
          label="Niveau"
          value={filters.levelId}
          onChange={(v) => {
            onChange("levelId", v);
            onChange("filiereId", "");
          }}
          options={levels?.map((l: any) => ({ value: l.id, label: l.name })) ?? []}
          placeholder="Tous les niveaux"
          loading={levelsLoading}
        />

        <FilterSelect
          icon={BookOpen}
          label="Filière"
          value={filters.filiereId}
          onChange={(v) => onChange("filiereId", v)}
          options={filteredFilieres?.map((f: any) => ({ value: f.id, label: `${f.code} — ${f.name}` })) ?? []}
          placeholder="Toutes les filières"
          loading={filieresLoading}
        />

        <FilterSelect
          icon={Layers}
          label="Catégorie"
          value={filters.categoryId}
          onChange={(v) => onChange("categoryId", v)}
          options={categories?.map((c: any) => ({ value: c.id, label: c.name })) ?? []}
          placeholder="Toutes les catégories"
          loading={categoriesLoading}
        />

        <FilterSelect
          icon={ArrowUpDown}
          label="Trier par"
          value={filters.sort}
          onChange={(v) => onChange("sort", v)}
          options={[
            { value: "popular", label: "Les plus populaires" },
            { value: "latest", label: "Les plus récents" },
          ]}
          placeholder="Tri"
        />
      </div>
    </div>
  );
}

export function BrowseFilterSidebar(props: BrowseFilterSidebarProps) {
  const { mobileOpen, onMobileClose } = props;

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 h-[calc(100vh-7rem)] w-72 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm shadow-gray-200/50">
          <FilterContent {...props} />
        </div>
      </aside>

      {/* Mobile filter trigger button */}
      <button
        onClick={props.onMobileOpen}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-purple-500/40 active:scale-95 lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filtres
        {props.activeCount > 0 && (
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white/25 px-1.5 text-[10px] font-bold text-white">
            {props.activeCount}
          </span>
        )}
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={onMobileClose}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white shadow-2xl lg:hidden"
            >
              <div className="flex h-full flex-col">
                <FilterContent {...props} />
                <div className="h-px bg-gray-100" />
                <div className="flex gap-3 px-5 py-4">
                  <button
                    onClick={onMobileClose}
                    className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={onMobileClose}
                    className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:shadow-xl"
                  >
                    Appliquer
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
