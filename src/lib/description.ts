export interface DescriptionDoc {
  title?: string;
  description?: string | null;
  year?: string | null;
  levelName?: string | null;
  filiereName?: string | null;
  moduleName?: string | null;
  categoryName?: string | null;
  level?: { name?: string } | null;
  filiere?: { name?: string } | null;
  module?: { name?: string } | null;
  category?: { name?: string } | null;
}

type DocType = "eff" | "efm" | "tp" | "td" | "resume" | "cours";

const catOf = (doc: DescriptionDoc) => (doc.category?.name || doc.categoryName || "").trim();
const filiereOf = (doc: DescriptionDoc) => (doc.filiere?.name || doc.filiereName || "").trim();
const moduleOf = (doc: DescriptionDoc) => (doc.module?.name || doc.moduleName || "").trim();

function detectType(doc: DescriptionDoc): DocType {
  const upperCat = catOf(doc).toUpperCase();
  if (upperCat === "EFF") return "eff";
  if (upperCat === "EFM") return "efm";
  const title = doc.title || "";
  if (/\bTP\b/i.test(title)) return "tp";
  if (/\bTD\b/i.test(title)) return "td";
  if (upperCat === "RÉSUMÉ" || upperCat === "RESUME" || /résumé/i.test(title)) return "resume";
  return "cours";
}

function typeLabel(type: DocType): string {
  switch (type) {
    case "tp":
      return "Travaux pratiques (TP)";
    case "td":
      return "Travaux dirigés (TD)";
    case "resume":
      return "Résumé";
    case "cours":
      return "Cours";
    default:
      return "Document";
  }
}

function yearOf(doc: DescriptionDoc): string | null {
  const m = (doc.year || "").match(/\b(19|20)\d{2}\b/);
  if (m) return m[0];
  const t = (doc.title || "").match(/\b(19|20)\d{2}\b/);
  return t ? t[0] : null;
}

function sessionClause(doc: DescriptionDoc): string {
  const m = (doc.title || "").match(/\bsession\b[^.;,]*?(19|20)\d{2}\b/i);
  if (m) return `, ${m[0].trim().toLowerCase().replace(/\s+/g, " ")}`;
  const y = yearOf(doc);
  return y ? `, session ${y}` : "";
}

function examDescription(doc: DescriptionDoc, kind: "EFF" | "EFM"): string {
  const filiere = filiereOf(doc);
  if (!filiere) return "";
  const moduleClause = kind === "EFM" && moduleOf(doc) ? ` du module ${moduleOf(doc)}` : "";
  return `Sujet officiel de l'Examen de Fin de ${kind === "EFF" ? "Formation" : "Module"} (${kind})${moduleClause} pour la filière ${filiere}${sessionClause(doc)}. Ce document permet aux stagiaires de s'entraîner dans les conditions réelles de l'examen et de mieux préparer leur certification OFPPT.`;
}

export function generateFallbackDescription(doc: DescriptionDoc): string {
  const type = detectType(doc);

  if (type === "eff") {
    const eff = examDescription(doc, "EFF");
    if (eff) return eff;
  }

  if (type === "efm") {
    const efm = examDescription(doc, "EFM");
    if (efm) return efm;
  }

  const filiere = filiereOf(doc);
  if (filiere) {
    const module = moduleOf(doc);
    const moduleClause = module ? ` du module ${module}` : "";
    return `${typeLabel(type)}${moduleClause} de la filière ${filiere}. Ressource pédagogique utile pour progresser dans la formation OFPPT ${filiere}.`;
  }

  return "Document pédagogique OFPPT destiné aux stagiaires et aux formateurs. Téléchargez librement cette ressource pour accompagner votre formation.";
}

export function resolveDescription(doc: DescriptionDoc): string {
  return doc.description && doc.description.trim() ? doc.description.trim() : generateFallbackDescription(doc);
}
