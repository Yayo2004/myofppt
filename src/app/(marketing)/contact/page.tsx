import type { Metadata } from "next";
import { Send, Mail, MessageSquare, HelpCircle, ArrowRight, Clock, Heart, Sparkles, MessageCircle, ChevronRight } from "lucide-react";
import { submitContactMessage } from "@/app/actions";
import SuccessToast from "@/components/contact/SuccessToast";

export const metadata: Metadata = {
  title: "Contact — Poser une question ou signaler un document",
  description: "Besoin d'aide ? Contactez l'équipe myofppt pour toute question, suggestion ou signalement de document. Réponse sous 24-48h.",
};

export default async function ContactPage({ searchParams }: { searchParams?: Promise<{ success?: string }> }) {
  const params = await searchParams;
  const success = params?.success;

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {success === "1" && <SuccessToast />}
      {/* Background decorative circles */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-purple-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-[400px] w-[400px] rounded-full bg-pink-100/30 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/20">
            <Mail className="h-7 w-7 text-white" />
          </div>
          <h1 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl">Contactez-nous</h1>
          <p className="mx-auto max-w-2xl text-gray-500 leading-relaxed">
            Une question, une suggestion ou un problème technique ? Notre équipe
            est dédiée à vous accompagner dans votre parcours d&apos;apprentissage.
          </p>
        </div>

        {/* Info cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: Clock, title: "Réponse rapide", desc: "Sous 24-48h", color: "from-purple-500 to-purple-600", shadow: "shadow-purple-500/20" },
            { icon: HelpCircle, title: "FAQ", desc: "Questions fréquentes", color: "from-blue-500 to-blue-600", shadow: "shadow-blue-500/20" },
            { icon: Heart, title: "100% Gratuit", desc: "Toujours gratuit", color: "from-rose-500 to-rose-600", shadow: "shadow-rose-500/20" },
          ].map((item) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-2xl border border-white bg-white p-6 shadow-lg shadow-black/[0.03] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${item.color} opacity-[0.07] transition-all duration-300 group-hover:scale-150 group-hover:opacity-[0.12]`} />
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} shadow-md ${item.shadow}`}>
                <item.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="mb-1 text-sm font-bold text-gray-900">{item.title}</h3>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Main section */}
        <div className="mt-16 grid gap-12 lg:grid-cols-5">
          {/* Left info */}
          <div className="lg:col-span-2">
            <h2 className="mb-3 text-2xl font-bold text-gray-900">Envoyez un message</h2>
            <p className="mb-8 text-sm text-gray-500 leading-relaxed">
              Remplissez le formulaire et nous vous répondrons dans les plus brefs délais.
            </p>

            <div className="space-y-5">
              {[
                { label: "Réponse sous 24h", desc: "Nous traitons chaque demande rapidement", icon: Clock },
                { label: "Support personnalisé", desc: "Une équipe dédiée à votre service", icon: Heart },
                { label: "100% gratuit", desc: "Aucun frais caché, toujours gratuit", icon: Sparkles },
              ].map((item) => (
                <div key={item.label} className="group flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 transition-colors group-hover:bg-purple-100">
                    <item.icon className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick links */}
            <div className="mt-10 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Liens utiles</p>
              <div className="space-y-2">
                {[
                  { label: "Politique de confidentialité", href: "/privacy" },
                  { label: "Conditions d'utilisation et confidentialité", href: "/privacy" },
                  { label: "À propos de la plateforme", href: "/about" },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-gray-600 transition-all hover:bg-purple-50 hover:text-purple-700"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="h-4 w-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <form action={submitContactMessage} className="lg:col-span-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-lg shadow-black/[0.03] sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">Nom</label>
                <input
                  type="text"
                  name="Nom"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 transition-all placeholder:text-gray-300 focus:border-purple-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-50"
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">Email</label>
                <input
                  type="email"
                  name="Email"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 transition-all placeholder:text-gray-300 focus:border-purple-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-50"
                  placeholder="votre@email.com"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">Sujet</label>
              <select name="Sujet" className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-600 transition-all focus:border-purple-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-50">
                <option value="">Choisir un sujet...</option>
                <option value="question">Question</option>
                <option value="bug">Signaler un bug</option>
                <option value="suggestion">Suggestion</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">Message</label>
              <textarea
                name="Message"
                required
                rows={5}
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 transition-all placeholder:text-gray-300 focus:border-purple-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-50"
                placeholder="Décrivez votre demande..."
              />
            </div>
            <button
              type="submit"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/30 active:scale-95"
            >
              <Send className="h-4 w-4" />
              Envoyer le message
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
