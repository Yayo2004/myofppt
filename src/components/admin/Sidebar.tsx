"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, GraduationCap, BookOpen, Layers, Tags, LogOut, LayoutDashboard, X, Mail } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/documents", label: "Documents", icon: FileText },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/filieres", label: "Filières", icon: GraduationCap },
  { href: "/admin/modules", label: "Modules", icon: BookOpen },
  { href: "/admin/niveaux", label: "Niveaux", icon: Layers },
  { href: "/admin/categories", label: "Catégories", icon: Tags },
];

export function Sidebar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: unreadCount } = useQuery({
    queryKey: ["admin", "messages", "unread"],
    queryFn: () => api.get<number>("/messages/unread-count"),
    refetchInterval: 30000,
  });

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-full flex-col border-r border-gray-200/80 bg-white/80 backdrop-blur-xl
          transition-transform duration-300 md:relative md:translate-x-0 md:w-64
          ${mobileOpen ? "translate-x-0 w-64" : "-translate-x-full"}
        `}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-100 px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white text-sm font-bold">
              O
            </div>
            <span className="text-sm font-bold text-gray-900">Admin</span>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="md:hidden text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "text-blue-700 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-blue-50"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <link.icon className={`relative z-10 h-4 w-4 ${active ? "text-blue-600" : ""}`} />
                <span className="relative z-10">{link.label}</span>
                {link.label === "Messages" && unreadCount !== undefined && unreadCount > 0 && (
                  <span className="relative z-10 ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-purple-500 px-1.5 text-[10px] font-bold text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-100 p-3">
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-gray-200 shadow-sm md:hidden"
      >
        <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </>
  );
}
