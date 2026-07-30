import type { Metadata } from "next";
import { Mail, BookOpen, Target, Eye, Heart, ArrowRight, Sparkles, GraduationCap, Library, Rocket, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "À propos — myofppt, bibliothèque OFPPT gratuite",
  description: "Découvrez myofppt : une bibliothèque numérique gratuite créée par un stagiaire OFPPT pour centraliser cours, EFF et EFM. Notre mission, notre vision.",
};

const sections = [
  {
    id: "intro",
    icon: Library,
    gradient: "from-purple-500 to-purple-600",
    content: (
      <>
        <p className="text-gray-600 leading-relaxed">
          myofppt est une bibliothèque numérique gratuite créée par et pour les stagiaires de l&apos;OFPPT.
          Notre mission est de centraliser les ressources pédagogiques — Cours, EFM, EFF — afin de faciliter
          l&apos;accès à l&apos;information et de soutenir les stagiaires dans leur parcours de formation.
        </p>
      </>
    ),
  },
  {
    id: "notre-histoire",
    title: "Notre histoire",
    icon: GraduationCap,
    gradient: "from-pink-500 to-pink-600",
    content: (
      <>
        <p className="text-gray-600 leading-relaxed">
          myofppt est né d&apos;un besoin vécu personnellement. Durant ma formation à l&apos;OFPPT
          (2023/2025) en Développement Digital, option Web Full Stack, je cherchais des documents pour
          préparer mes EFF et EFM, mais les ressources étaient dispersées dans des groupes Telegram,
          sans aucune organisation — impossible de retrouver rapidement un cours ou un sujet d&apos;examen
          précis. C&apos;est de cette frustration qu&apos;est née l&apos;idée de myofppt : rassembler ces
          documents en un seul endroit, structuré et facile à parcourir, pour que chaque stagiaire
          puisse trouver ce dont il a besoin en quelques clics et se concentrer sur l&apos;essentiel —
          bien préparer ses examens.
        </p>
      </>
    ),
  },
  {
    id: "notre-mission",
    title: "Notre mission",
    icon: Target,
    gradient: "from-purple-500 to-pink-500",
    content: (
      <>
        <p className="text-gray-600 leading-relaxed">
          Nous croyons que l&apos;accès aux ressources pédagogiques ne devrait jamais être un obstacle
          à la réussite. C&apos;est pourquoi myofppt propose un espace simple, rapide et organisé où
          chaque stagiaire peut retrouver facilement les documents dont il a besoin, classés par filière,
          module et type de document.
        </p>
      </>
    ),
  },
  {
    id: "notre-vision",
    title: "Notre vision",
    icon: Eye,
    gradient: "from-pink-500 to-purple-500",
    content: (
      <>
        <p className="text-gray-600 leading-relaxed">
          Devenir la référence en ligne pour les stagiaires OFPPT à la recherche de documents
          pédagogiques, en offrant une expérience de recherche claire, fiable et accessible à tous,
          gratuitement.
        </p>
      </>
    ),
  },
  {
    id: "notre-engagement",
    title: "Notre engagement",
    icon: ShieldCheck,
    gradient: "from-emerald-500 to-emerald-600",
    content: (
      <ul className="space-y-3 text-gray-600">
        {[
          "Un accès 100% gratuit, sans inscription obligatoire.",
          "Une plateforme pensée pour la simplicité et la rapidité de recherche.",
          "Un respect des droits d'auteur : tout contenu signalé comme non autorisé est retiré rapidement sur demande (voir notre page Conditions d'utilisation).",
          "Une amélioration continue basée sur les retours de la communauté des stagiaires.",
        ].map((item) => (
          <li key={item} className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ),
  },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white">
      {/* Background decorative circles */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-purple-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-[400px] w-[400px] rounded-full bg-pink-100/30 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/20">
            <Library className="h-7 w-7 text-white" />
          </div>
          <h1 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl">À propos de myofppt</h1>
          <p className="mx-auto max-w-2xl text-gray-500 leading-relaxed">
            Une bibliothèque numérique gratuite, créée par et pour les stagiaires de l&apos;OFPPT.
          </p>
        </div>

        {/* Cards */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className={`group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-lg shadow-black/[0.03] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
                index === 0 ? "" : ""
              }`}
            >
              {/* Gradient corner decoration */}
              <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${section.gradient} opacity-[0.06] transition-all duration-300 group-hover:scale-150 group-hover:opacity-[0.12]`} />

              {section.title && (
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${section.gradient} shadow-md`}>
                    <section.icon className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                </div>
              )}

              {!section.title && (
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${section.gradient} shadow-md`}>
                    <section.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              )}

              {section.content}
            </div>
          ))}
        </div>

        {/* Contact section */}
        <div className="mt-12 rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50 p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-md shadow-purple-500/20">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-gray-900">Nous contacter</h2>
          <p className="mb-4 text-sm text-gray-600 leading-relaxed">
            Une question, une suggestion, ou un document à signaler ? Écrivez-nous — nous répondons à tous les messages.
          </p>
          <a
            href="mailto:myofppt.contact@gmail.com"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/30 active:scale-95"
          >
            <Mail className="h-4 w-4" />
            myofppt.contact@gmail.com
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
