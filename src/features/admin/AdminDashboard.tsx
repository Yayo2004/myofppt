"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload, Trash2, Plus } from "lucide-react";
import { useDocuments, useFilieres, useLevels, useCategories } from "@/hooks/use-documents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CategoryBadge } from "@/components/ui/category-badge";
import { api } from "@/lib/api";
import { formatDate, formatFileSize } from "@/lib/utils";

export function AdminDashboard() {
  const client = useQueryClient();
  const [tab, setTab] = useState<"documents" | "filieres" | "modules" | "levels" | "categories">("documents");

  return (
    <div>
      <div className="mb-6 flex gap-2 border-b border-gray-200 pb-2">
        {[
          { key: "documents", label: "Documents" },
          { key: "filieres", label: "Filières" },
          { key: "modules", label: "Modules" },
          { key: "levels", label: "Niveaux" },
          { key: "categories", label: "Catégories" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              tab === t.key ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "documents" && <DocumentsTab />}
      {tab === "filieres" && <FilieresTab />}
      {tab === "modules" && <ModulesTab />}
      {tab === "levels" && <LevelsTab />}
      {tab === "categories" && <CategoriesTab />}
    </div>
  );
}

function DocumentsTab() {
  const client = useQueryClient();
  const { data, isLoading } = useDocuments({ limit: 50, sort: "popular" });
  const { data: filieres } = useFilieres();
  const { data: levels } = useLevels();
  const { data: categories } = useCategories();
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedLevelId, setSelectedLevelId] = useState("");
  const [selectedFiliereId, setSelectedFiliereId] = useState("");
  const [modules, setModules] = useState<any[]>([]);

  const filteredFilieres = filieres?.filter((f: any) => !selectedLevelId || f.levelId === selectedLevelId);

  async function handleFiliereChange(filiereId: string) {
    setSelectedFiliereId(filiereId);
    const f = filieres?.find((f: any) => f.id === filiereId);
    if (f?.slug) {
      try {
        const detail = await api.get<any>(`/filieres/${f.slug}`);
        setModules(detail.modules || []);
      } catch {
        setModules([]);
      }
    } else {
      setModules([]);
    }
  }

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    try {
      await api.upload("/documents", fd);
      form.reset();
      setShowForm(false);
      setSelectedFiliereId("");
      setModules([]);
      client.invalidateQueries({ queryKey: ["documents"] });
    } catch {
      alert("Erreur lors de l'upload");
    }
    setUploading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce document ?")) return;
    try {
      await api.delete(`/documents/${id}`);
      client.invalidateQueries({ queryKey: ["documents"] });
    } catch {
      alert("Erreur");
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">{data?.total || 0} documents</p>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-1 h-4 w-4" /> Ajouter
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <form onSubmit={handleUpload} className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="md:col-span-2">
                  <input name="title" placeholder="Titre" required className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="md:col-span-2">
                  <textarea name="description" placeholder="Description (sauts de ligne conservés)" rows={4} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <Select name="levelId" required value={selectedLevelId} onChange={(e) => { setSelectedLevelId(e.target.value); setSelectedFiliereId(""); setModules([]); }}>
                  <option value="">Niveau</option>
                  {levels?.map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
                </Select>
                <Select name="filiereId" required value={selectedFiliereId} onChange={(e) => handleFiliereChange(e.target.value)}>
                  <option value="">Filière</option>
                  {filteredFilieres?.map((f: any) => <option key={f.id} value={f.id}>{f.name}</option>)}
                </Select>
                <Select name="moduleId" disabled={!modules.length}>
                  <option value="">Module (optionnel)</option>
                  {modules?.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </Select>
                <Select name="categoryId" required>
                  <option value="">Type</option>
                  {categories?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
                <Input name="file" type="file" accept=".pdf,.zip,.docx,.pptx" required />
              </div>
              <Button type="submit" disabled={uploading}>
                <Upload className="mr-1 h-4 w-4" /> {uploading ? "Upload..." : "Uploader"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {data?.docs?.map((doc: any) => (
          <div key={doc.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate">{doc.title}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {doc.category && <CategoryBadge name={doc.category.name} />}
                {doc.level && <Badge variant="secondary">{doc.level.name}</Badge>}
                {doc.filiere && <Badge variant="outline">{doc.filiere.code}</Badge>}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {formatFileSize(doc.fileSize)} · {doc.views} vues · {doc.downloads} téléch. · {formatDate(doc.createdAt)}
              </p>
            </div>
            <Button variant="danger" size="sm" onClick={() => handleDelete(doc.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilieresTab() {
  const client = useQueryClient();
  const { data: filieres } = useFilieres();
  const { data: levels } = useLevels();
  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newLevelId, setNewLevelId] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newLevelId) { alert("Veuillez sélectionner un niveau"); return; }
    try {
      await api.post("/filieres", { name: newName, code: newCode, levelId: newLevelId });
      setNewName("");
      setNewCode("");
      setNewLevelId("");
      client.invalidateQueries({ queryKey: ["filieres"] });
    } catch {
      alert("Erreur");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette filière ?")) return;
    try {
      await api.delete(`/filieres/${id}`);
      client.invalidateQueries({ queryKey: ["filieres"] });
    } catch {
      alert("Erreur");
    }
  }

  return (
    <div>
      <form onSubmit={handleAdd} className="mb-6 flex flex-wrap gap-3">
        <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nom" required className="flex-1 min-w-[160px]" />
        <Input value={newCode} onChange={(e) => setNewCode(e.target.value)} placeholder="Code" required className="w-24" />
        <Select value={newLevelId} onChange={(e) => setNewLevelId(e.target.value)} required className="min-w-[180px]">
          <option value="">Niveau</option>
          {levels?.map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </Select>
        <Button type="submit"><Plus className="mr-1 h-4 w-4" /> Ajouter</Button>
      </form>
      <div className="grid gap-3 md:grid-cols-2">
        {filieres?.map((f: any) => (
          <div key={f.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
            <div>
              <p className="font-medium">{f.name}</p>
              <p className="text-sm text-gray-500">{f.code}</p>
              <p className="text-xs text-gray-400">{f.level?.name || "—"} · {f._count?.modules || 0} modules</p>
            </div>
            <Button variant="danger" size="sm" onClick={() => handleDelete(f.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModulesTab() {
  const client = useQueryClient();
  const { data: modules, isLoading } = useQuery({
    queryKey: ["admin", "modules", "dashboard"],
    queryFn: () => api.get<{ data: any[]; meta: any }>("/modules", { limit: "50", sortBy: "createdAt", sortOrder: "desc" }),
    staleTime: 30000,
  });
  const { data: filieres } = useFilieres();
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newHours, setNewHours] = useState("");
  const [newFiliereId, setNewFiliereId] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newFiliereId) { alert("Veuillez sélectionner une filière"); return; }
    try {
      await api.post("/modules", {
        code: newCode,
        name: newName,
        hours: parseInt(newHours, 10),
        filiereId: newFiliereId,
      });
      setNewCode("");
      setNewName("");
      setNewHours("");
      setNewFiliereId("");
      client.invalidateQueries({ queryKey: ["admin", "modules"] });
    } catch {
      alert("Erreur");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce module ?")) return;
    try {
      await api.delete(`/modules/${id}`);
      client.invalidateQueries({ queryKey: ["admin", "modules"] });
    } catch {
      alert("Erreur");
    }
  }

  return (
    <div>
      <form onSubmit={handleAdd} className="mb-6 flex flex-wrap gap-3">
        <Input value={newCode} onChange={(e) => setNewCode(e.target.value)} placeholder="Code" required className="w-24" />
        <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nom du module" required className="flex-1 min-w-[160px]" />
        <Input value={newHours} onChange={(e) => setNewHours(e.target.value)} type="number" min="1" placeholder="Heures" required className="w-24" />
        <Select value={newFiliereId} onChange={(e) => setNewFiliereId(e.target.value)} required className="min-w-[180px]">
          <option value="">Filière</option>
          {filieres?.map((f: any) => <option key={f.id} value={f.id}>{f.name} ({f.code})</option>)}
        </Select>
        <Button type="submit"><Plus className="mr-1 h-4 w-4" /> Ajouter</Button>
      </form>
      <div className="space-y-2">
        {isLoading ? (
          <p className="text-sm text-gray-400">Chargement...</p>
        ) : modules?.data?.length === 0 ? (
          <p className="text-sm text-gray-400">Aucun module</p>
        ) : (
          modules?.data?.map((m: any) => (
            <div key={m.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{m.name}</span>
                  <span className="text-xs text-gray-400 font-mono">{m.code}</span>
                </div>
                <p className="text-xs text-gray-400">
                  {m.hours}h · {m.filiere?.name || "—"}
                  {m.filiere?.level?.name && <span> · {m.filiere.level.name}</span>}
                </p>
              </div>
              <Button variant="danger" size="sm" onClick={() => handleDelete(m.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function LevelsTab() {
  const client = useQueryClient();
  const { data: levels } = useLevels();
  const [newName, setNewName] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post("/levels", { name: newName, order: (levels?.length || 0) + 1 });
      setNewName("");
      client.invalidateQueries({ queryKey: ["levels"] });
    } catch {
      alert("Erreur");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce niveau ?")) return;
    try {
      await api.delete(`/levels/${id}`);
      client.invalidateQueries({ queryKey: ["levels"] });
    } catch {
      alert("Erreur");
    }
  }

  return (
    <div>
      <form onSubmit={handleAdd} className="mb-6 flex gap-3">
        <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nom" required className="flex-1" />
        <Button type="submit"><Plus className="mr-1 h-4 w-4" /> Ajouter</Button>
      </form>
      <div className="space-y-2">
        {levels?.map((l: any) => (
          <div key={l.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
            <span className="font-medium">{l.name}</span>
            <Button variant="danger" size="sm" onClick={() => handleDelete(l.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoriesTab() {
  const client = useQueryClient();
  const { data: categories } = useCategories();
  const [newName, setNewName] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post("/categories", { name: newName });
      setNewName("");
      client.invalidateQueries({ queryKey: ["categories"] });
    } catch {
      alert("Erreur");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette catégorie ?")) return;
    try {
      await api.delete(`/categories/${id}`);
      client.invalidateQueries({ queryKey: ["categories"] });
    } catch {
      alert("Erreur");
    }
  }

  return (
    <div>
      <form onSubmit={handleAdd} className="mb-6 flex gap-3">
        <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nom" required className="flex-1" />
        <Button type="submit"><Plus className="mr-1 h-4 w-4" /> Ajouter</Button>
      </form>
      <div className="space-y-2">
        {categories?.map((c: any) => (
          <div key={c.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
            <span className="font-medium">{c.name}</span>
            <Button variant="danger" size="sm" onClick={() => handleDelete(c.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
