"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Modal } from "@/components/admin/Modal";
import { useToastStore } from "@/stores/toast-store";
import { motion } from "framer-motion";
import { Search, Plus, Layers, Trash2, ArrowUp } from "lucide-react";

export default function AdminNiveauxPage() {
  const qc = useQueryClient();
  const toast = useToastStore();
  const [search, setSearch] = useState("");

  const { data: levels, isLoading } = useQuery({
    queryKey: ["admin", "levels"],
    queryFn: () => api.get<any[]>("/levels"),
  });

  const filtered = levels?.filter((l: any) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const [addOpen, setAddOpen] = useState(false);
  const [deleteLevel, setDeleteLevel] = useState<any>(null);
  const [form, setForm] = useState({ name: "", order: 0 });

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    try {
      await api.post("/levels", { name: form.name, order: form.order || filtered.length + 1 });
      toast.add("Niveau ajouté", "success");
      setAddOpen(false); setForm({ name: "", order: 0 });
      qc.invalidateQueries({ queryKey: ["admin", "levels"] });
    } catch { toast.add("Erreur", "error"); }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/levels/${id}`);
      toast.add("Niveau supprimé", "success");
      setDeleteLevel(null);
      qc.invalidateQueries({ queryKey: ["admin", "levels"] });
    } catch { toast.add("Erreur", "error"); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Niveaux</h2>
          <p className="text-sm text-gray-500">{filtered.length} niveau{filtered.length > 1 ? "x" : ""}</p>
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-gray-400">
          <Layers className="mb-3 h-12 w-12 text-gray-200" />
          <p className="text-sm font-medium">Aucun niveau</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((l: any, i: number) => (
            <motion.div key={l.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="group flex items-center justify-between rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm hover:shadow-md hover:border-purple-200 transition-all">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 text-purple-600">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{l.name}</p>
                  <p className="text-xs text-gray-400">Ordre {l.order}</p>
                </div>
              </div>
              <button onClick={() => setDeleteLevel(l)} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Ajouter un niveau">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nom *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="1ère Année" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setAddOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">Annuler</button>
            <button type="submit" className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Ajouter</button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteLevel} onClose={() => setDeleteLevel(null)} title="Confirmer la suppression" size="sm">
        <p className="text-sm text-gray-600">Supprimer le niveau <strong>{deleteLevel?.name}</strong> ?</p>
        <div className="flex justify-end gap-3 pt-4">
          <button onClick={() => setDeleteLevel(null)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">Annuler</button>
          <button onClick={() => handleDelete(deleteLevel?.id)} className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700">Supprimer</button>
        </div>
      </Modal>
    </div>
  );
}
