"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Mail, Trash2, Eye, Clock, User } from "lucide-react";
import { motion } from "framer-motion";
import { useToastStore } from "@/stores/toast-store";
import { useState } from "react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

function MessageCard({ msg, onMarkRead, onDelete }: { msg: any; onMarkRead: (id: string) => void; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      variants={item}
      className={`rounded-xl border p-5 shadow-sm transition-all ${
        msg.read ? "border-gray-200/80 bg-white" : "border-purple-200 bg-purple-50/40"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full ${
              msg.read ? "bg-gray-100" : "bg-purple-100"
            }`}>
              <User className={`h-4 w-4 ${msg.read ? "text-gray-500" : "text-purple-600"}`} />
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-medium truncate ${msg.read ? "text-gray-900" : "text-gray-900"}`}>
                {msg.name}
                {!msg.read && <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-purple-500" />}
              </p>
              <p className="text-xs text-gray-400">{msg.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <Clock className="h-3 w-3" />
            {new Date(msg.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric", month: "long", year: "numeric",
              hour: "2-digit", minute: "2-digit",
            })}
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              {msg.subject}
            </span>
          </div>
          <p className={`text-sm text-gray-600 ${expanded ? "" : "line-clamp-2"}`}>{msg.message}</p>
          {msg.message.length > 150 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-1 text-xs font-medium text-purple-600 hover:text-purple-700"
            >
              {expanded ? "Réduire" : "Lire la suite"}
            </button>
          )}
        </div>
        <div className="flex shrink-0 gap-1">
          {!msg.read && (
            <button
              onClick={() => onMarkRead(msg.id)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-purple-100 hover:text-purple-600 transition-all"
              title="Marquer comme lu"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => onDelete(msg.id)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-100 hover:text-red-500 transition-all"
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminMessagesPage() {
  const queryClient = useQueryClient();
  const { add: toast } = useToastStore();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const { data: messages, isLoading } = useQuery({
    queryKey: ["admin", "messages"],
    queryFn: () => api.get<any[]>("/messages"),
  });

  const markReadMut = useMutation({
    mutationFn: (id: string) => api.post(`/messages/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });
      toast("Marqué comme lu", "success");
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => api.delete(`/messages/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });
      toast("Message supprimé", "success");
    },
  });

  const filtered = messages
    ? filter === "unread"
      ? messages.filter((m: any) => !m.read)
      : messages
    : [];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="mt-1 text-sm text-gray-500">
            {messages ? `${messages.length} message${messages.length > 1 ? "s" : ""}` : ""}
            {messages && messages.filter((m: any) => !m.read).length > 0 && (
              <span className="ml-2 text-purple-600 font-medium">
                &middot; {messages.filter((m: any) => !m.read).length} non lu{messages.filter((m: any) => !m.read).length > 1 ? "s" : ""}
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              filter === "all" ? "bg-purple-600 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              filter === "unread" ? "bg-purple-600 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Non lus
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Mail className="mb-4 h-16 w-16" />
          <p className="text-lg font-medium">Aucun message</p>
          <p className="text-sm">
            {filter === "unread" ? "Tous les messages ont été lus" : "Aucun message reçu pour le moment"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg: any) => (
            <MessageCard
              key={msg.id}
              msg={msg}
              onMarkRead={(id) => markReadMut.mutate(id)}
              onDelete={(id) => deleteMut.mutate(id)}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
