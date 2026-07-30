"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Sidebar } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";
import { LogoutModal } from "@/components/admin/LogoutModal";
import { ToastContainer } from "@/components/admin/Toast";

const titles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/documents": "Documents",
  "/admin/messages": "Messages",
  "/admin/filieres": "Filières",
  "/admin/modules": "Modules",
  "/admin/niveaux": "Niveaux",
  "/admin/categories": "Catégories",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { token, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false);

  useEffect(() => {
    if (!token) router.push("/admin");
  }, [token, router]);

  if (!token) return null;

  return (
    <ThemeProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar onLogout={() => setLogoutOpen(true)} />
        <div className="flex flex-1 flex-col">
          <Topbar title={titles[pathname] || "Administration"} />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
      <LogoutModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={() => { logout(); router.push("/admin"); }}
      />
      <ToastContainer />
    </ThemeProvider>
  );
}
