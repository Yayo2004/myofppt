import type { Metadata } from "next";
import BrowseClient from "@/components/browse/BrowseClient";

export const metadata: Metadata = {
  title: "Parcourir les documents — Cours, EFF, EFM OFPPT",
  description: "Parcourez et filtrez tous les documents pédagogiques OFPPT : cours, TD, TP, EFM, EFF par niveau, filière, module et catégorie. Accès gratuit.",
};

export default function BrowsePage() {
  return <BrowseClient />;
}
