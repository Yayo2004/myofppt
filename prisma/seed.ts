import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const documents = [
  {
    title: "Cours JavaScript — Les Fondamentaux",
    description: "Introduction complète à JavaScript : variables, fonctions, objets, DOM",
    fileName: "cours-js-fondamentaux.pdf",
    fileSize: 2_400_000,
    fileType: "pdf",
    level: "1ère Année",
    branch: "Développement Digital",
    module: "JavaScript",
    docType: "Cours",
  },
  {
    title: "TD Algorithmique — Structures Conditionnelles",
    description: "Exercices corrigés sur les structures conditionnelles (if/else, switch)",
    fileName: "td-algo-conditionnelles.pdf",
    fileSize: 850_000,
    fileType: "pdf",
    level: "Tronc Commun",
    branch: "Développement Digital",
    module: "Algorithmique",
    docType: "TD",
  },
  {
    title: "TP Réseaux — Configuration Switch Cisco",
    description: "Guide pratique de configuration des switches Cisco en environnement VLAN",
    fileName: "tp-cisco-switch.pdf",
    fileSize: 3_200_000,
    fileType: "pdf",
    level: "2ème Année",
    branch: "Réseaux Informatiques",
    module: "Réseaux",
    docType: "TP",
  },
  {
    title: "EFM Comptabilité Générale — Session Janvier",
    description: "Examen de fin de module en comptabilité générale avec corrigé",
    fileName: "efm-comptabilite-generale.pdf",
    fileSize: 1_100_000,
    fileType: "pdf",
    level: "1ère Année",
    branch: "Comptabilité",
    module: "Comptabilité Générale",
    docType: "EFM",
  },
  {
    title: "EFF Développement Web — Projet Final",
    description: "Épreuve de fin de formation en développement web : conception d'une application",
    fileName: "eff-devweb-final.pdf",
    fileSize: 5_600_000,
    fileType: "pdf",
    level: "2ème Année",
    branch: "Développement Digital",
    module: "Développement Web",
    docType: "EFF",
  },
  {
    title: "Cours HTML & CSS — Les Bases",
    description: "Introduction au développement web avec HTML5 et CSS3",
    fileName: "cours-html-css.pdf",
    fileSize: 1_800_000,
    fileType: "pdf",
    level: "Tronc Commun",
    branch: "Développement Digital",
    module: "Développement Web",
    docType: "Cours",
  },
  {
    title: "TD Gestion des Entreprises — Analyse Financière",
    description: "Série d'exercices sur l'analyse financière et les ratios",
    fileName: "td-analyse-financiere.pdf",
    fileSize: 720_000,
    fileType: "pdf",
    level: "2ème Année",
    branch: "Gestion des Entreprises",
    module: "Gestion Financière",
    docType: "TD",
  },
  {
    title: "TP Électronique — Circuits Logiques",
    description: "Travaux pratiques sur les circuits logiques combinatoires et séquentiels",
    fileName: "tp-circuits-logiques.pdf",
    fileSize: 4_100_000,
    fileType: "pdf",
    level: "1ère Année",
    branch: "Electronique",
    module: "Électronique Numérique",
    docType: "TP",
  },
  {
    title: "Examen Génie Civil — Résistance des Matériaux",
    description: "Examen avec corrigé détaillé sur la résistance des matériaux (RDM)",
    fileName: "examen-rdm.pdf",
    fileSize: 2_900_000,
    fileType: "pdf",
    level: "2ème Année",
    branch: "Génie Civil",
    module: "Résistance des Matériaux",
    docType: "Examen",
  },
  {
    title: "Projet — Application Node.js Express",
    description: "Projet complet : API REST avec Node.js, Express et MongoDB",
    fileName: "projet-nodejs-express.pdf",
    fileSize: 6_200_000,
    fileType: "pdf",
    level: "2ème Année",
    branch: "Développement Digital",
    module: "Développement Backend",
    docType: "Projet",
  },
];

async function main() {
  console.log("Seeding database...");
  for (const doc of documents) {
    await prisma.document.create({ data: doc });
  }
  console.log(`Seeded ${documents.length} documents`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
