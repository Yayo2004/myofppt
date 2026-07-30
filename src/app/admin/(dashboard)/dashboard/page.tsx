"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { FileText, GraduationCap, Layers, Tags, Eye, Download, ArrowUp, Clock, Mail } from "lucide-react";
import { motion } from "framer-motion";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

function StatCard({ icon: Icon, label, value, color, bg }: { icon: any; label: string; value: number | string; color: string; bg: string }) {
  return (
    <motion.div variants={item} className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${bg}`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminDashboardPage() {
  const { data: filieres } = useQuery({ queryKey: ["admin", "filieres"], queryFn: () => api.get<any[]>("/filieres") });
  const { data: levels } = useQuery({ queryKey: ["admin", "levels"], queryFn: () => api.get<any[]>("/levels") });
  const { data: categories } = useQuery({ queryKey: ["admin", "categories"], queryFn: () => api.get<any[]>("/categories") });
  const { data: docs } = useQuery({ queryKey: ["admin", "docs"], queryFn: () => api.get<any>("/documents", { limit: "100" }) });
  const { data: messages } = useQuery({ queryKey: ["admin", "messages"], queryFn: () => api.get<any[]>("/messages") });

  const documents = (docs as any)?.docs || [];
  const totalDocs = (docs as any)?.total || 0;
  const totalViews = documents.reduce((s: number, d: any) => s + (d.views || 0), 0);
  const totalDownloads = documents.reduce((s: number, d: any) => s + (d.downloads || 0), 0);
  const recentDocs = [...documents].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  const unreadMessages = messages?.filter((m: any) => !m.read).length || 0;

  const stats = [
    { icon: Mail, label: "Messages non lus", value: unreadMessages, color: "text-purple-600", bg: "bg-purple-50" },
    { icon: FileText, label: "Documents", value: totalDocs, color: "text-blue-600", bg: "bg-blue-50" },
    { icon: GraduationCap, label: "Filières", value: filieres?.length || 0, color: "text-emerald-600", bg: "bg-emerald-50" },
    { icon: Layers, label: "Niveaux", value: levels?.length || 0, color: "text-purple-600", bg: "bg-purple-50" },
    { icon: Tags, label: "Catégories", value: categories?.length || 0, color: "text-orange-600", bg: "bg-orange-50" },
    { icon: Eye, label: "Vues totales", value: totalViews.toLocaleString(), color: "text-cyan-600", bg: "bg-cyan-50" },
    { icon: Download, label: "Téléchargements", value: totalDownloads.toLocaleString(), color: "text-rose-600", bg: "bg-rose-50" },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={item} className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Clock className="h-4 w-4 text-gray-400" />
            Derniers documents
          </h3>
          {recentDocs.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">Aucun document récent</p>
          ) : (
            <div className="space-y-3">
              {recentDocs.map((doc: any) => (
                <div key={doc.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{doc.title}</p>
                    <p className="text-xs text-gray-400">{doc.filiere?.name || "—"}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 ml-3">
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{doc.views}</span>
                    <span className="flex items-center gap-1"><Download className="h-3 w-3" />{doc.downloads}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
            <GraduationCap className="h-4 w-4 text-gray-400" />
            Filières
          </h3>
          {(!filieres || filieres.length === 0) ? (
            <p className="py-8 text-center text-sm text-gray-400">Aucune filière</p>
          ) : (
            <div className="space-y-2">
              {filieres.slice(0, 6).map((f: any) => (
                <div key={f.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 text-[10px] font-bold">
                      {f.code?.slice(0, 2) || "FI"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{f.name}</p>
                      <p className="text-xs text-gray-400">{f.code}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{f._count?.modules || 0} modules</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
