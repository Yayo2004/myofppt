import { FilterWizard } from "@/components/filter-wizard/FilterWizard";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assistant de recherche — Trouver cours OFPPT par filière",
  description: "Utilisez notre assistant pour trouver vos documents OFPPT en 3 étapes : sélectionnez votre filière, votre module et le type de document souhaité.",
};

export default function FiltrerPage() {
  return <FilterWizard />;
}
