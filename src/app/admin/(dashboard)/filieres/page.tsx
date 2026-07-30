"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Modal } from "@/components/admin/Modal";
import { useToastStore } from "@/stores/toast-store";
import { motion } from "framer-motion";
import { Search, Plus, GraduationCap, BookOpen, Trash2, Edit3 } from "lucide-react";
import { useLevels } from "@/hooks/use-documents";

export default function AdminFilieresPage() {
  const qc = useQueryClient();
  const toast = useToastStore();
  const [search, setSearch] = useState("");

  const { data: filieres, isLoading } = useQuery({
    queryKey: ["admin", "filieres"],
    queryFn: () => api.get<any[]>("/filieres"),
  });

  const { data: levels } = useLevels();

  const filtered = filieres?.filter((f: any) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.code?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const [addOpen, setAddOpen] = useState(false);
  const [editFiliere, setEditFiliere] = useState<any>(null);
  const [deleteFiliere, setDeleteFiliere] = useState<any>(null);
  const [form, setForm] = useState({ name: "", code: "", levelId: "" });

  function resetForm() { setForm({ name: "", code: "", levelId: "" }); }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.levelId) { toast.add("Veuillez sélectionner un niveau", "error"); return; }
    try {
      await api.post("/filieres", form);
      toast.add("Filière ajoutée", "success");
      setAddOpen(false); resetForm();
      qc.invalidateQueries({ queryKey: ["admin", "filieres"] });
    } catch { toast.add("Erreur", "error"); }
  }

  async function handleEdit() {
    try {
      await api.put(`/filieres/${editFiliere.id}`, form);
      toast.add("Filière modifiée", "success");
      setEditFiliere(null); resetForm();
      qc.invalidateQueries({ queryKey: ["admin", "filieres"] });
    } catch { toast.add("Erreur", "error"); }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/filieres/${id}`);
      toast.add("Filière supprimée", "success");
      setDeleteFiliere(null);
      qc.invalidateQueries({ queryKey: ["admin", "filieres"] });
    } catch { toast.add("Erreur", "error"); }
  }

  const totalModules = filtered.reduce((s: number, f: any) => s + (f._count?.modules || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Filières</h2>
          <p className="text-sm text-gray-500">{filtered.length} filière{filtered.length > 1 ? "s" : ""} · {totalModules} modules</p>
        </div>
        <button onClick={() => { resetForm(); setAddOpen(true); }} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 hover:from-blue-700 hover:to-purple-700 transition-all">
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-gray-400">
          <GraduationCap className="mb-3 h-12 w-12 text-gray-200" />
          <p className="text-sm font-medium">Aucune filière</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((f: any, i: number) => (
            <motion.div key={f.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="group rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 text-blue-600">
                        <GraduationCap className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{f.name}</p>
                        <p className="text-xs text-gray-400">{f.code}</p>
                        {f.level && <span className="text-[10px] text-purple-500 font-medium">{f.level.name}</span>}
                      </div>
                    </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditFiliere(f); setForm({ name: f.name, code: f.code, levelId: f.levelId || "" }); }} className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => setDeleteFiliere(f)} className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{f._count?.modules || 0} modules</span>
                <span className="flex items-center gap-1"><GraduationCap className="h-3 w-3" />{f._count?.documents || 0} docs</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Ajouter une filière">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nom *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Développement Digital" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Code *</label>
            <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="DD" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Niveau *</label>
            <select value={form.levelId} onChange={(e) => setForm({ ...form, levelId: e.target.value })} required className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Sélectionner un niveau</option>
              {levels?.map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setAddOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">Annuler</button>
            <button type="submit" className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Ajouter</button>
          </div>
        </form>
      </Modal>

      <Modal open={!!editFiliere} onClose={() => setEditFiliere(null)} title="Modifier la filière">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nom</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Code</label>
            <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Niveau</label>
            <select value={form.levelId} onChange={(e) => setForm({ ...form, levelId: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Sélectionner un niveau</option>
              {levels?.map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setEditFiliere(null)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">Annuler</button>
            <button onClick={handleEdit} className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Enregistrer</button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteFiliere} onClose={() => setDeleteFiliere(null)} title="Confirmer la suppression" size="sm">
        <p className="text-sm text-gray-600">Supprimer <strong>{deleteFiliere?.name}</strong> ?</p>
        <div className="flex justify-end gap-3 pt-4">
          <button onClick={() => setDeleteFiliere(null)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">Annuler</button>
          <button onClick={() => handleDelete(deleteFiliere?.id)} className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700">Supprimer</button>
        </div>
      </Modal>
    </div>
  );
}
