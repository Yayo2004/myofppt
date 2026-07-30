import type { Metadata } from "next";
import ModernHomeClient from "@/components/home/ModernHomeClient";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} — Cours, EFF, EFM gratuits pour stagiaires OFPPT`,
  description: "Trouvez tous vos cours OFPPT, exercices, EFM et EFF gratuitement. Bibliothèque numérique par filière et module pour les stagiaires de l'OFPPT au Maroc.",
  openGraph: {
    title: `${siteConfig.name} — Ressources pédagogiques OFPPT gratuites`,
    description: "Accédez à tous vos cours, TD, TP, EFF et EFM OFPPT en un clic. Classés par filière et module.",
  },
};

export default function HomePage() {
  return <ModernHomeClient />;
}
