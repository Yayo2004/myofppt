"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const TYPING_WORDS = ["Résumés", "Cours", "EFM", "EFF", "Contrôles"];
const TYPING_SPEED = 90;
const DELETING_SPEED = 55;
const PAUSE_AFTER_TYPING = 1500;
const PAUSE_AFTER_DELETING = 300;

const PLACEHOLDERS = [
  { text: "Rechercher un EFM...", category: "EFM" },
  { text: "Trouver un contrôle...", category: "Contrôles" },
  { text: "Chercher un cours...", category: "Cours" },
  { text: "Rechercher une fiche de révision...", category: "Résumés" },
  { text: "Explorer une EFF...", category: "EFF" },
];

interface Props {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function HeroSection({ searchQuery, onSearchChange }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [displayText, setDisplayText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [placeholder, setPlaceholder] = useState(0);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const currentWord = TYPING_WORDS[wordIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < currentWord.length) {
            setDisplayText(currentWord.slice(0, displayText.length + 1));
          } else {
            setIsDeleting(true);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setWordIndex((prev) => (prev + 1) % TYPING_WORDS.length);
          }
        }
      },
      isDeleting
        ? displayText.length === 0 ? PAUSE_AFTER_DELETING : DELETING_SPEED
        : displayText.length === currentWord.length ? PAUSE_AFTER_TYPING : TYPING_SPEED,
    );
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, wordIndex]);

  useEffect(() => {
    const pi = setInterval(() => setPlaceholder((i) => (i + 1) % PLACEHOLDERS.length), 3000);
    return () => clearInterval(pi);
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) router.push(`/browse?q=${encodeURIComponent(q)}`);
    else router.push("/browse");
  }

  const searchGlow = focused ? "shadow-blue-500/25" : "shadow-black/5";

  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-16 md:pt-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute -right-40 top-20 h-[400px] w-[400px] rounded-full bg-purple-500/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-blue-200/50 bg-blue-50/80 px-4 py-1.5 text-xs font-medium text-blue-700 backdrop-blur-sm"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Plateforme pédagogique OFPPT
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-6xl leading-tight"
        >
          Votre succès commence ici{" "}
          <br className="hidden sm:block" />
          avec vos{" "}
          <span className="relative inline-flex items-center">
            <span
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
              style={{ filter: "drop-shadow(0 0 12px rgba(99,102,241,0.35))" }}
            >
              {displayText || "\u00A0"}
            </span>
            <span className="ml-0.5 inline-block h-[1em] w-[3px] animate-pulse rounded-full bg-gradient-to-b from-blue-600 to-purple-600" />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mb-10 max-w-2xl text-lg text-gray-500 md:text-xl"
        >
          Accédez instantanément aux ressources essentielles pour réussir votre formation OFPPT.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          onSubmit={handleSubmit}
          className="mx-auto mb-8 max-w-2xl"
        >
          <div
            className={`group relative transition-all duration-300 ${searchGlow} hover:shadow-xl`}
          >
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 blur-lg transition-opacity duration-300 group-focus-within:opacity-100" />
            <div className="relative flex items-center rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur-xl px-5 py-3.5 shadow-lg transition-all duration-300 focus-within:border-blue-400/50 focus-within:bg-white">
              <Search className="mr-3 h-5 w-5 shrink-0 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={PLACEHOLDERS[placeholder].text}
                className="w-full bg-transparent text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />
              <button
                type="submit"
                className="ml-2 flex shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 active:scale-95"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Rechercher</span>
              </button>
            </div>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <button
            onClick={() => router.push("/filtrer")}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-blue-500/30 active:scale-95"
          >
            Trouvez vos cours en quelques secondes
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => router.push("/browse")}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200/60 bg-white/70 px-6 py-3 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-gray-300/80 hover:bg-white hover:shadow-md active:scale-95"
          >
            Explorer toutes les ressources
          </button>
        </motion.div>
      </div>
    </section>
  );
}
