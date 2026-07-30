"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, getFileUrl } from "@/lib/api";
import { useFilieres, useLevels, useCategories, useFiliere } from "@/hooks/use-documents";
import { Modal } from "@/components/admin/Modal";
import { useToastStore } from "@/stores/toast-store";
import { motion } from "framer-motion";
import { Search, Plus, FileText, Eye, Download, Trash2, Upload, X, Loader2, ArrowUpFromLine } from "lucide-react";
import { formatFileSize, formatDate } from "@/lib/utils";

export default function AdminDocumentsPage() {
  const qc = useQueryClient();
  const toast = useToastStore();
  const { data: levels } = useLevels();
  const { data: filieres } = useFilieres();
  const { data: categories } = useCategories();

  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [filiereFilter, setFiliereFilter] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);

  // Modal states
  const [addOpen, setAddOpen] = useState(false);
  const [editDoc, setEditDoc] = useState<any>(null);
  const [deleteDoc, setDeleteDoc] = useState<any>(null);

  // Form state
  const [form, setForm] = useState({ title: "", description: "", levelId: "", filiereId: "", moduleId: "", categoryId: "" });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const { data: filiereDetail } = useFiliere(
    filieres?.find((f: any) => f.id === filiereFilter)?.slug || ""
  );
  const { data: formFiliereDetail } = useFiliere(
    filieres?.find((f: any) => f.id === form.filiereId)?.slug || ""
  );

  const filterParams: Record<string, string> = {};
  if (search.trim()) filterParams.q = search.trim();
  if (levelFilter) filterParams.levelId = levelFilter;
  if (filiereFilter) filterParams.filiereId = filiereFilter;
  if (moduleFilter) filterParams.moduleId = moduleFilter;
  if (categoryFilter) filterParams.categoryId = categoryFilter;

  const { data: docsData, isLoading } = useQuery({
    queryKey: ["admin", "documents", filterParams, page],
    queryFn: () => api.get<any>("/documents", { ...filterParams, page: String(page), limit: "15" }),
  });
  const docs = docsData?.docs || [];
  const totalPages = docsData?.totalPages || 1;
  const total = docsData?.total || 0;

  function resetForm() {
    setForm({ title: "", description: "", levelId: "", filiereId: "", moduleId: "", categoryId: "" });
    setFile(null);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!file) { toast.add("Veuillez sélectionner un fichier", "error"); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("levelId", form.levelId);
      fd.append("filiereId", form.filiereId);
      if (form.moduleId) fd.append("moduleId", form.moduleId);
      fd.append("categoryId", form.categoryId);
      await api.upload("/documents", fd);
      toast.add("Document ajouté avec succès", "success");
      setAddOpen(false);
      resetForm();
      qc.invalidateQueries({ queryKey: ["admin", "documents"] });
      qc.invalidateQueries({ queryKey: ["documents"] });
    } catch { toast.add("Erreur lors de l'ajout", "error"); }
    finally { setUploading(false); }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/documents/${id}`);
      toast.add("Document supprimé", "success");
      setDeleteDoc(null);
      qc.invalidateQueries({ queryKey: ["admin", "documents"] });
      qc.invalidateQueries({ queryKey: ["documents"] });
    } catch { toast.add("Erreur lors de la suppression", "error"); }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Documents</h2>
          <p className="text-sm text-gray-500">{total} document{total > 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => { resetForm(); setAddOpen(true); }} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 hover:from-blue-700 hover:to-purple-700 transition-all">
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Rechercher..." className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={levelFilter} onChange={(e) => { setLevelFilter(e.target.value); setPage(1); }} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Niveau</option>
          {levels?.map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
        <select value={filiereFilter} onChange={(e) => { setFiliereFilter(e.target.value); setModuleFilter(""); setPage(1); }} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Filière</option>
          {filieres?.filter((f: any) => !levelFilter || f.levelId === levelFilter)?.map((f: any) => <option key={f.id} value={f.id}>{f.code}</option>)}
        </select>
        <select value={moduleFilter} onChange={(e) => { setModuleFilter(e.target.value); setPage(1); }} disabled={!filiereFilter} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40">
          <option value="">Module</option>
          {filiereDetail?.modules?.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Type</option>
          {categories?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-sm">
        {isLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-gray-100" />
            ))}
          </div>
        ) : docs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <FileText className="mb-3 h-12 w-12 text-gray-200" />
            <p className="text-sm font-medium">Aucun document trouvé</p>
            <p className="text-xs mt-1">Ajoutez un document ou modifiez vos filtres</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Titre</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 hidden md:table-cell">Filière</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 hidden lg:table-cell">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 hidden md:table-cell">Taille</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 hidden lg:table-cell">Vues</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 hidden lg:table-cell">Date</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {docs.map((doc: any) => (
                  <motion.tr key={doc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 truncate max-w-[200px]">{doc.title}</p>
                          <p className="text-xs text-gray-400">{doc.level?.name || ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-gray-600">{doc.filiere?.code || "—"}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                        {doc.category?.name || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-500">{formatFileSize(doc.fileSize || 0)}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="flex items-center gap-1 text-gray-500"><Eye className="h-3 w-3" />{doc.views}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs">{formatDate(doc.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <a href={getFileUrl(doc.storageUrl) || "#"} target="_blank" className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                          <Eye className="h-3.5 w-3.5" />
                        </a>
                        <button onClick={() => { setEditDoc(doc); setForm({ title: doc.title, description: doc.description || "", levelId: doc.levelId, filiereId: doc.filiereId, moduleId: doc.moduleId || "", categoryId: doc.categoryId }); }} className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => setDeleteDoc(doc)} className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-colors">
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`flex h-9 min-w-[36px] items-center justify-center rounded-lg text-sm font-medium transition-colors ${p === page ? "bg-blue-600 text-white shadow-sm" : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}>
              {p}
            </button>
          ))}
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-colors">
            ›
          </button>
        </div>
      )}

      {/* Add Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Ajouter un document" size="lg">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Titre *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Titre du document" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={6} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Description optionnelle (sauts de ligne et puces conservés)" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Niveau *</label>
              <select value={form.levelId} onChange={(e) => { setForm({ ...form, levelId: e.target.value, filiereId: "", moduleId: "" }); }} required className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Sélectionner</option>
                {levels?.map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Filière *</label>
              <select value={form.filiereId} onChange={(e) => { setForm({ ...form, filiereId: e.target.value, moduleId: "" }); }} required className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Sélectionner</option>
                {filieres?.filter((f: any) => !form.levelId || f.levelId === form.levelId)?.map((f: any) => <option key={f.id} value={f.id}>{f.code} — {f.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Module</label>
                <select value={form.moduleId} onChange={(e) => setForm({ ...form, moduleId: e.target.value })} disabled={!form.filiereId} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40">
                  <option value="">Optionnel</option>
                  {formFiliereDetail?.modules?.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Type *</label>
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Sélectionner</option>
                {categories?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Upload area */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Fichier *</label>
            {file ? (
              <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Upload className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button onClick={() => setFile(null)} className="text-gray-400 hover:text-red-500">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); setFile(e.dataTransfer.files[0]); }}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 transition-all ${dragOver ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:border-gray-300 bg-gray-50"}`}
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <ArrowUpFromLine className={`mb-2 h-8 w-8 ${dragOver ? "text-blue-500" : "text-gray-300"}`} />
                <p className="text-sm font-medium text-gray-600">Déposez votre fichier ici</p>
                <p className="text-xs text-gray-400 mt-1">ou cliquez pour parcourir</p>
              </div>
            )}
            <input id="file-upload" type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setAddOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button type="submit" disabled={uploading} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {uploading ? "Upload..." : "Ajouter"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editDoc} onClose={() => setEditDoc(null)} title="Modifier le document" size="md">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Titre</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={6} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setEditDoc(null)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
              Annuler
            </button>
            <button onClick={async () => {
              try {
                await api.put(`/documents/${editDoc.id}`, { title: form.title, description: form.description });
                toast.add("Document mis à jour", "success");
                setEditDoc(null);
                qc.invalidateQueries({ queryKey: ["admin", "documents"] });
              } catch { toast.add("Erreur", "error"); }
            }} className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
              Enregistrer
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete confirmation */}
      <Modal open={!!deleteDoc} onClose={() => setDeleteDoc(null)} title="Confirmer la suppression" size="sm">
        <p className="text-sm text-gray-600">Êtes-vous sûr de vouloir supprimer <strong>{deleteDoc?.title}</strong> ? Cette action est irréversible.</p>
        <div className="flex justify-end gap-3 pt-4">
          <button onClick={() => setDeleteDoc(null)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
            Annuler
          </button>
          <button onClick={() => handleDelete(deleteDoc?.id)} className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700">
            Supprimer
          </button>
        </div>
      </Modal>
    </div>
  );
}
