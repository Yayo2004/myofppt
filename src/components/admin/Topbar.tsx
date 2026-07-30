"use client";

import { Moon, Sun, Bell, Search } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuthStore } from "@/stores/auth-store";
import { useState } from "react";

interface TopbarProps {
  title: string;
}

export function Topbar({ title }: TopbarProps) {
  const { theme, toggle } = useTheme();
  const admin = useAuthStore((s) => s.admin);
  const [notifOpen, setNotifOpen] = useState(false);

  const initials = admin?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "A";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200/80 bg-white/70 backdrop-blur-xl px-6">
      <h1 className="text-lg font-semibold text-gray-900 ml-14 md:ml-0">{title}</h1>

      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white" />
          </button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-12 z-40 w-72 rounded-xl border border-gray-200 bg-white shadow-xl">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">Notifications</p>
                </div>
                <div className="p-4 text-center text-sm text-gray-400">Aucune notification</div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-bold">
            {initials}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900 leading-tight">{admin?.name || "Admin"}</p>
            <p className="text-xs text-gray-400">{admin?.email || ""}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
