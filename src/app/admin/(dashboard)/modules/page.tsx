"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Modal } from "@/components/admin/Modal";
import { motion } from "framer-motion";
import {
  Search, Plus, Trash2, Edit3, BookOpen, Filter,
  ChevronLeft, ChevronRight, ArrowUpDown,
} from "lucide-react";

const SORT_FIELDS = [
  { value: "name", label: "Nom" },
  { value: "code", label: "Code" },
  { value: "hours", label: "Heures" },
  { value: "createdAt", label: "Date" },
];

export default function AdminModulesPage() {
  const qc = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterLevelId, setFilterLevelId] = useState("");
  const [filterFiliereId, setFilterFiliereId] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const queryKey = ["admin", "modules", page, debouncedSearch, filterLevelId, filterFiliereId, filterStatus, sortBy, sortOrder];

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () =>
      api.get<{
        data: any[];
        meta: { total: number; page: number; limit: number; totalPages: number };
      }>("/modules", Object.fromEntries(
        Object.entries({
          page: String(page),
          limit: "10",
          search: debouncedSearch,
          levelId: filterLevelId,
          filiereId: filterFiliereId,
          status: filterStatus,
          sortBy,
          sortOrder,
        }).filter(([_, v]) => v)
      )),
  });

  const { data: levels } = useQuery({
    queryKey: ["levels"],
    queryFn: () => api.get<any[]>("/levels"),
    staleTime: 300000,
  });

  const { data: filieres } = useQuery({
    queryKey: ["filieres"],
    queryFn: () => api.get<any[]>("/filieres"),
    staleTime: 300000,
  });

  const filteredFilieres = filieres?.filter(
    (f: any) => !filterLevelId || f.levelId === filterLevelId
  );

  // Modal state
  const [addOpen, setAddOpen] = useState(false);
  const [editModule, setEditModule] = useState<any>(null);
  const [deleteModule, setDeleteModule] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    code: "",
    hours: "",
    filiereId: "",
    description: "",
    status: "Active",
  });

  function resetForm() {
    setForm({ name: "", code: "", hours: "", filiereId: "", description: "", status: "Active" });
  }

  function toggleSort(field: string) {
    if (sortBy === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.filiereId) return;
    try {
      await api.post("/modules", {
        ...form,
        hours: parseInt(form.hours, 10),
      });
      setAddOpen(false);
      resetForm();
      qc.invalidateQueries({ queryKey: ["admin", "modules"] });
    } catch {
      alert("Erreur lors de l'ajout");
    }
  }

  async function handleEdit() {
    try {
      await api.put(`/modules/${editModule.id}`, {
        ...form,
        hours: parseInt(form.hours, 10),
      });
      setEditModule(null);
      resetForm();
      qc.invalidateQueries({ queryKey: ["admin", "modules"] });
    } catch {
      alert("Erreur lors de la modification");
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/modules/${id}`);
      setDeleteModule(null);
      qc.invalidateQueries({ queryKey: ["admin", "modules"] });
    } catch {
      alert("Erreur lors de la suppression");
    }
  }

  const modules = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPages: 0 };

  // sort indicator
  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field) return <ArrowUpDown className="ml-1 h-3 w-3 text-gray-300" />;
    return (
      <ArrowUpDown
        className={`ml-1 h-3 w-3 ${sortOrder === "asc" ? "text-blue-600 rotate-180" : "text-blue-600"}`}
      />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Modules</h2>
          <p className="text-sm text-gray-500">{meta.total} module{meta.total > 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => { resetForm(); setAddOpen(true); }}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 hover:from-blue-700 hover:to-purple-700 transition-all"
        >
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom..."
            className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterLevelId}
          onChange={(e) => { setFilterLevelId(e.target.value); setFilterFiliereId(""); setPage(1); }}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tous les niveaux</option>
          {levels?.map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
        <select
          value={filterFiliereId}
          onChange={(e) => { setFilterFiliereId(e.target.value); setPage(1); }}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Toutes les filières</option>
          {filteredFilieres?.map((f: any) => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tous les statuts</option>
          <option value="Active">Actif</option>
          <option value="Inactive">Inactif</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th
                className="cursor-pointer px-4 py-3 text-left font-medium text-gray-500 hover:text-gray-700"
                onClick={() => toggleSort("code")}
              >
                <span className="flex items-center">Code <SortIcon field="code" /></span>
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-left font-medium text-gray-500 hover:text-gray-700"
                onClick={() => toggleSort("name")}
              >
                <span className="flex items-center">Module <SortIcon field="name" /></span>
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-left font-medium text-gray-500 hover:text-gray-700"
                onClick={() => toggleSort("hours")}
              >
                <span className="flex items-center">Heures <SortIcon field="hours" /></span>
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Filière</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Niveau</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Statut</th>
              <th
                className="cursor-pointer px-4 py-3 text-left font-medium text-gray-500 hover:text-gray-700"
                onClick={() => toggleSort("createdAt")}
              >
                <span className="flex items-center">Date <SortIcon field="createdAt" /></span>
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse border-b border-gray-50">
                  <td colSpan={8} className="px-4 py-4">
                    <div className="h-4 w-full rounded bg-gray-100" />
                  </td>
                </tr>
              ))
            ) : modules.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                  <BookOpen className="mx-auto mb-2 h-8 w-8 text-gray-200" />
                  <p className="text-sm font-medium">Aucun module trouvé</p>
                </td>
              </tr>
            ) : (
              modules.map((m: any, i: number) => (
                <motion.tr
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs font-medium text-gray-700">{m.code}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{m.name}</td>
                  <td className="px-4 py-3 text-gray-600">{m.hours}h</td>
                  <td className="px-4 py-3 text-gray-600">{m.filiere?.name || "—"}</td>
                  <td className="px-4 py-3">
                    {m.filiere?.level?.name ? (
                      <span className="inline-block rounded-full bg-purple-50 px-2.5 py-0.5 text-[10px] font-medium text-purple-600">
                        {m.filiere.level.name}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                        m.status === "Active"
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {m.status === "Active" ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(m.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => {
                          setEditModule(m);
                          setForm({
                            name: m.name,
                            code: m.code,
                            hours: String(m.hours),
                            filiereId: m.filiereId,
                            description: m.description || "",
                            status: m.status,
                          });
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteModule(m)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Page {meta.page} sur {meta.totalPages} ({meta.total} résultats)
          </p>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" /> Précédent
            </button>
            <button
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Suivant <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Ajouter un module" size="lg">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Code *</label>
              <input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="M101"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Heures *</label>
              <input
                type="number"
                min="1"
                value={form.hours}
                onChange={(e) => setForm({ ...form, hours: e.target.value })}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="60"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nom *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Développement web"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Filière *</label>
            <select
              value={form.filiereId}
              onChange={(e) => setForm({ ...form, filiereId: e.target.value })}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner une filière</option>
              {filieres?.map((f: any) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.code})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description optionnelle..."
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Statut</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Active">Actif</option>
              <option value="Inactive">Inactif</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setAddOpen(false)}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Ajouter
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editModule} onClose={() => setEditModule(null)} title="Modifier le module" size="lg">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Code *</label>
              <input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Heures *</label>
              <input
                type="number"
                min="1"
                value={form.hours}
                onChange={(e) => setForm({ ...form, hours: e.target.value })}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nom *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Filière *</label>
            <select
              value={form.filiereId}
              onChange={(e) => setForm({ ...form, filiereId: e.target.value })}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner une filière</option>
              {filieres?.map((f: any) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.code})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Statut</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Active">Actif</option>
              <option value="Inactive">Inactif</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setEditModule(null)}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={handleEdit}
              className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        open={!!deleteModule}
        onClose={() => setDeleteModule(null)}
        title="Confirmer la suppression"
        size="sm"
      >
        <p className="text-sm text-gray-600">
          Supprimer le module <strong>{deleteModule?.name}</strong> ({deleteModule?.code}) ?
        </p>
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={() => setDeleteModule(null)}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={() => handleDelete(deleteModule?.id)}
            className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
          >
            Supprimer
          </button>
        </div>
      </Modal>
    </div>
  );
}
