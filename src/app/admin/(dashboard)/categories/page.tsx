"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Modal } from "@/components/admin/Modal";
import { useToastStore } from "@/stores/toast-store";
import { motion } from "framer-motion";
import { Search, Plus, Tags, Trash2, BookOpen, FileText, Award, ClipboardList, FlaskConical, Pencil } from "lucide-react";

const iconMap: Record<string, any> = { BookOpen, FileText, Award, ClipboardList, FlaskConical, Pencil, Tags };

export default function AdminCategoriesPage() {
  const qc = useQueryClient();
  const toast = useToastStore();
  const [search, setSearch] = useState("");

  const { data: categories, isLoading } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: () => api.get<any[]>("/categories"),
  });

  const filtered = categories?.filter((c: any) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const [addOpen, setAddOpen] = useState(false);
  const [deleteCat, setDeleteCat] = useState<any>(null);
  const [form, setForm] = useState({ name: "" });

  const bgColors = ["bg-blue-50 text-blue-600", "bg-orange-50 text-orange-600", "bg-purple-50 text-purple-600", "bg-green-50 text-green-600", "bg-red-50 text-red-600", "bg-teal-50 text-teal-600", "bg-pink-50 text-pink-600"];

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    try {
      await api.post("/categories", { name: form.name });
      toast.add("Catégorie ajoutée", "success");
      setAddOpen(false); setForm({ name: "" });
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
    } catch { toast.add("Erreur", "error"); }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/categories/${id}`);
      toast.add("Catégorie supprimée", "success");
      setDeleteCat(null);
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
    } catch { toast.add("Erreur", "error"); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Catégories</h2>
          <p className="text-sm text-gray-500">{filtered.length} catégorie{filtered.length > 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 hover:from-blue-700 hover:to-purple-700 transition-all">
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-gray-400">
          <Tags className="mb-3 h-12 w-12 text-gray-200" />
          <p className="text-sm font-medium">Aucune catégorie</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((c: any, i: number) => {
            const Icon = iconMap[c.icon as string] || Tags;
            const colors = bgColors[i % bgColors.length];
            return (
              <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="group relative rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colors}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="font-semibold text-gray-900">{c.name}</p>
                </div>
                <button onClick={() => setDeleteCat(c)} className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Ajouter une catégorie">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nom *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Cours" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setAddOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">Annuler</button>
            <button type="submit" className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Ajouter</button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteCat} onClose={() => setDeleteCat(null)} title="Confirmer la suppression" size="sm">
        <p className="text-sm text-gray-600">Supprimer la catégorie <strong>{deleteCat?.name}</strong> ?</p>
        <div className="flex justify-end gap-3 pt-4">
          <button onClick={() => setDeleteCat(null)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">Annuler</button>
          <button onClick={() => handleDelete(deleteCat?.id)} className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700">Supprimer</button>
        </div>
      </Modal>
    </div>
  );
}
