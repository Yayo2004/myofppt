import Link from "next/link";
import Image from "next/image";
import { BookOpen, Sparkles, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-gray-100 bg-gradient-to-b from-gray-50 to-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 -top-40 h-[300px] w-[300px] rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute -right-40 -bottom-40 h-[300px] w-[300px] rounded-full bg-purple-500/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-16 pb-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="myofppt — Bibliothèque numérique OFPPT"
                width={220}
                height={60}
                className="h-14 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-500">
              Bibliothèque numérique des ressources pédagogiques OFPPT. Cours, EFF, EFM, Controle gratuits.
            </p>
            <div className="mt-5 flex gap-3">
              <Link href="/filtrer" className="uiverse-btn">
                <div className="wrapper flex items-center gap-1.5">
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
              <Link
                href="/browse"
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md active:scale-95"
              >
                Documents
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/filtrer" className="group inline-flex items-center gap-1 text-sm text-gray-600 transition-colors hover:text-gray-900">
                  Filtrer
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </li>
              <li>
                <Link href="/browse" className="group inline-flex items-center gap-1 text-sm text-gray-600 transition-colors hover:text-gray-900">
                  Documents
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">Informations</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="group inline-flex items-center gap-1 text-sm text-gray-600 transition-colors hover:text-gray-900">
                  À propos
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </li>
              <li>
                <Link href="/contact" className="group inline-flex items-center gap-1 text-sm text-gray-600 transition-colors hover:text-gray-900">
                  Contact
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="group inline-flex items-center gap-1 text-sm text-gray-600 transition-colors hover:text-gray-900">
                  Confidentialité
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </li>
              <li>
                <Link href="/terms" className="group inline-flex items-center gap-1 text-sm text-gray-600 transition-colors hover:text-gray-900">
                  Conditions
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-6 sm:flex-row">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} OFPPT Platforme. Ressources pédagogiques libres.
          </p>
          <p className="text-xs text-gray-400">
            Fait avec ❤️ pour la formation professionnelle
          </p>
        </div>
      </div>
    </footer>
  );
}
