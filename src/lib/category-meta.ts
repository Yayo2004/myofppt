import { FileText, Award, ClipboardList, BookOpen, FlaskConical } from "lucide-react";

export const CATEGORY_META: Record<string, { icon: any; emoji: string; bgHover: string; borderHover: string; bgIcon: string; textColor: string; badgeBg: string; badgeText: string }> = {
  EFM: { icon: FileText, emoji: "🔥", bgHover: "from-rose-500/12 to-orange-500/[0.06]", borderHover: "from-rose-400/30 to-orange-400/10", bgIcon: "from-rose-500/10 to-orange-500/[0.04]", textColor: "text-rose-600", badgeBg: "bg-rose-100", badgeText: "text-rose-700" },
  EFF: { icon: Award, emoji: "📘", bgHover: "from-blue-500/12 to-indigo-500/[0.06]", borderHover: "from-blue-400/30 to-indigo-400/10", bgIcon: "from-blue-500/10 to-indigo-500/[0.04]", textColor: "text-blue-600", badgeBg: "bg-blue-100", badgeText: "text-blue-700" },
  "Contrôle Continu": { icon: ClipboardList, emoji: "🧠", bgHover: "from-purple-500/12 to-fuchsia-500/[0.06]", borderHover: "from-purple-400/30 to-fuchsia-400/10", bgIcon: "from-purple-500/10 to-fuchsia-500/[0.04]", textColor: "text-purple-600", badgeBg: "bg-purple-100", badgeText: "text-purple-700" },
  Cours: { icon: BookOpen, emoji: "📚", bgHover: "from-emerald-500/12 to-teal-500/[0.06]", borderHover: "from-emerald-400/30 to-teal-400/10", bgIcon: "from-emerald-500/10 to-teal-500/[0.04]", textColor: "text-emerald-600", badgeBg: "bg-emerald-100", badgeText: "text-emerald-700" },
  TP: { icon: FlaskConical, emoji: "🧪", bgHover: "from-cyan-500/12 to-sky-500/[0.06]", borderHover: "from-cyan-400/30 to-sky-400/10", bgIcon: "from-cyan-500/10 to-sky-500/[0.04]", textColor: "text-cyan-600", badgeBg: "bg-cyan-100", badgeText: "text-cyan-700" },
  TD: { icon: FlaskConical, emoji: "✏️", bgHover: "from-amber-500/12 to-yellow-500/[0.06]", borderHover: "from-amber-400/30 to-yellow-400/10", bgIcon: "from-amber-500/10 to-yellow-500/[0.04]", textColor: "text-amber-600", badgeBg: "bg-amber-100", badgeText: "text-amber-700" },
  "Résumé": { icon: FileText, emoji: "📋", bgHover: "from-pink-500/12 to-rose-500/[0.06]", borderHover: "from-pink-400/30 to-rose-400/10", bgIcon: "from-pink-500/10 to-rose-500/[0.04]", textColor: "text-pink-600", badgeBg: "bg-pink-100", badgeText: "text-pink-700" },
};

export function getCategoryMeta(name: string) {
  return CATEGORY_META[name] || CATEGORY_META["Cours"];
}
