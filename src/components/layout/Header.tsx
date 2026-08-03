"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, FileText, Compass, Info, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 20); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  if (!mounted) return null;

  const navLinks = [
    { href: "/browse", label: "Documents", icon: FileText },
    { href: "/filtrer", label: "Trouver mes cours", icon: Compass },
    { href: "/about", label: "À propos", icon: Info },
    { href: "/contact", label: "Contact", icon: Phone },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || open
            ? "bg-white/80 shadow-lg shadow-black/[0.03] backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:py-4">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="myofppt — Accueil"
              width={200}
              height={56}
              className="h-12 w-auto"
              priority
              unoptimized
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1.5 md:flex">
            <Link
              href="/browse"
              aria-current={pathname === "/browse" ? "page" : undefined}
              className={`group relative rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-white/60 hover:text-gray-900 ${
                scrolled ? "text-gray-500" : "text-gray-700"
              }`}
            >
              <span className="relative z-10">Documents</span>
            </Link>

            <Link href="/filtrer" className="uiverse-btn">
              <div className="wrapper">
                <span>Trouver mes cours</span>
                <div className="circle circle-12" />
                <div className="circle circle-11" />
                <div className="circle circle-10" />
                <div className="circle circle-9" />
                <div className="circle circle-8" />
                <div className="circle circle-7" />
                <div className="circle circle-6" />
                <div className="circle circle-5" />
                <div className="circle circle-4" />
                <div className="circle circle-3" />
                <div className="circle circle-2" />
                <div className="circle circle-1" />
              </div>
            </Link>
          </nav>

          {/* Mobile trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <Link href="/filtrer" className="uiverse-btn">
              <div className="wrapper">
                <span>Trouver mes cours</span>
                <div className="circle circle-12" />
                <div className="circle circle-11" />
                <div className="circle circle-10" />
                <div className="circle circle-9" />
                <div className="circle circle-8" />
                <div className="circle circle-7" />
                <div className="circle circle-6" />
                <div className="circle circle-5" />
                <div className="circle circle-4" />
                <div className="circle circle-3" />
                <div className="circle circle-2" />
                <div className="circle circle-1" />
              </div>
            </Link>
            <button
              className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 backdrop-blur-sm active:scale-95 ${
                scrolled || open
                  ? "border-gray-200/60 bg-white/60 text-gray-500 hover:bg-white hover:text-gray-700"
                  : "border-white/30 bg-white/10 text-gray-200 hover:bg-white/20 hover:text-white"
              }`}
              onClick={() => setOpen(!open)}
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            >
              <motion.div
                key={open ? "close" : "menu"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </motion.div>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed left-3 right-3 top-[64px] z-50 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl shadow-black/[0.08] md:hidden"
            >
              <div className="p-3">
                {navLinks.map((link, i) => {
                  const Icon = link.icon;
                  const isPrimary = link.href === "/filtrer";
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.2 }}
                    >
                      <Link
                        href={link.href}
                        aria-current={pathname === link.href ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                          isPrimary
                            ? "mt-1 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 text-purple-700 hover:from-purple-100 hover:via-pink-100 hover:to-purple-100"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${isPrimary ? "text-purple-500" : "text-gray-400"}`} />
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
