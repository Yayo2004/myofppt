import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.document.deleteMany();
  await prisma.module.deleteMany();
  await prisma.filiere.deleteMany();
  await prisma.category.deleteMany();
  await prisma.level.deleteMany();
  await prisma.admin.deleteMany();

  // === LEVELS ===
  const levels = await Promise.all([
    prisma.level.create({ data: { name: 'Technicien Spécialisé 1ère année', order: 1 } }),
    prisma.level.create({ data: { name: 'Technicien Spécialisé 2ème année', order: 2 } }),
  ]);

  // === CATEGORIES ===
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Cours', slug: 'cours', icon: 'BookOpen' } }),
    prisma.category.create({ data: { name: 'EFM', slug: 'efm', icon: 'FileText' } }),
    prisma.category.create({ data: { name: 'Contrôle Continu', slug: 'controle-continu', icon: 'ClipboardList' } }),
    prisma.category.create({ data: { name: 'EFF', slug: 'eff', icon: 'Award' } }),
    prisma.category.create({ data: { name: 'TP', slug: 'tp', icon: 'FlaskConical' } }),
    prisma.category.create({ data: { name: 'TD', slug: 'td', icon: 'Pencil' } }),
    prisma.category.create({ data: { name: 'Résumé', slug: 'resume', icon: 'FileText' } }),
  ]);

  // === FILIÈRES & MODULES ===
  const l1Id = levels[0].id;
  const l2Id = levels[1].id;

  const filieresData = [
    // Level 1
    {
      name: 'Développement Digital 1ère année',
      code: 'DD1A',
      levelId: l1Id,
      modules: [],
    },
    {
      name: 'Infrastructure Digitale 1ère année',
      code: 'ID1A',
      levelId: l1Id,
      modules: [],
    },
    {
      name: 'Gestion des Entreprises 1ère année',
      code: 'GE1A',
      levelId: l1Id,
      modules: [],
    },
    {
      name: 'Développement Digital - Applications Mobiles',
      code: 'DDOAM',
      levelId: l2Id,
      modules: [
        { name: 'Anglais technique', code: 'EGTS203', hours: 50 },
        { name: 'Approche agile', code: 'M202', hours: 120 },
        { name: 'Compétences comportementales', code: 'EGTS205', hours: 30 },
        { name: 'Création d\'une application Cloud native', code: 'M206', hours: 90 },
        { name: 'Culture entrepreneuriale', code: 'EGTS204', hours: 45 },
        { name: 'Culture et techniques avancées du numérique', code: 'EGTSA206', hours: 30 },
        { name: 'Développement back-end', code: 'M205', hours: 120 },
        { name: 'Développement front-end', code: 'M204', hours: 90 },
        { name: 'Entrepreneuriat-PIE 2', code: 'EGTS208', hours: 80 },
        { name: 'Français', code: 'EGTS202', hours: 115 },
        { name: 'Gestion des données', code: 'M203', hours: 90 },
        { name: 'Intégration du milieu professionnel', code: 'M208', hours: 160 },
        { name: 'Préparation d\'un projet web', code: 'M201', hours: 60 },
        { name: 'Projet de synthèse', code: 'M207', hours: 0 },
        { name: 'Techniques de communication', code: 'EGTS201', hours: 60 },
      ],
    },
    {
      name: 'Développement Digital - Web Full Stack',
      code: 'DDOWFS',
      levelId: l2Id,
      modules: [
        { name: 'Anglais technique', code: 'EGTS203', hours: 50 },
        { name: 'Approche agile', code: 'M202', hours: 120 },
        { name: 'Compétences comportementales', code: 'EGTS205', hours: 30 },
        { name: 'Culture entrepreneuriale', code: 'EGTS204', hours: 45 },
        { name: 'Développement back-end', code: 'M205', hours: 120 },
        { name: 'Développement front-end', code: 'M204', hours: 90 },
        { name: 'Entrepreneuriat-PIE 2', code: 'EGTS208', hours: 80 },
        { name: 'Français', code: 'EGTS202', hours: 115 },
        { name: 'Gestion des données', code: 'M203', hours: 90 },
        { name: 'Intégration du milieu professionnel', code: 'M208', hours: 160 },
        { name: 'Préparation d\'un projet web', code: 'M201', hours: 60 },
        { name: 'Projet de synthèse', code: 'M207', hours: 0 },
        { name: 'Techniques de communication', code: 'EGTS201', hours: 60 },
        { name: 'Culture et techniques avancées du numérique', code: 'EGTSA206', hours: 30 },
      ],
    },
    {
      name: 'Génie Civil - Bâtiments',
      code: 'GC',
      modules: [
        { name: 'Anglais technique', code: 'EGTS203', hours: 50 },
        { name: 'Béton armé', code: 'GC01', hours: 120 },
        { name: 'Charpente métallique', code: 'GC02', hours: 90 },
        { name: 'Compétences comportementales', code: 'EGTS205', hours: 30 },
        { name: 'Culture entrepreneuriale', code: 'EGTS204', hours: 45 },
        { name: 'Dessin de bâtiment', code: 'GC03', hours: 100 },
        { name: 'Entrepreneuriat-PIE 2', code: 'EGTS208', hours: 80 },
        { name: 'Français', code: 'EGTS202', hours: 115 },
        { name: 'Géotechnique', code: 'GC04', hours: 80 },
        { name: 'Infrastructure', code: 'GC05', hours: 90 },
        { name: 'Intégration du milieu professionnel', code: 'M208', hours: 160 },
        { name: 'Métré et études de prix', code: 'GC06', hours: 100 },
        { name: 'Projet de synthèse', code: 'M207', hours: 0 },
        { name: 'Résistance des matériaux', code: 'GC07', hours: 110 },
        { name: 'Techniques de communication', code: 'EGTS201', hours: 60 },
        { name: 'Topographie', code: 'GC08', hours: 80 },
        { name: 'VRD - Voirie et Réseaux Divers', code: 'GC09', hours: 70 },
      ],
    },
    {
      name: 'Gestion des Entreprises - Commerce et Marketing',
      code: 'GECM2',
      levelId: l2Id,
      modules: [
        { name: 'Anglais technique', code: 'EGTS203', hours: 50 },
        { name: 'Comptabilité', code: 'GE01', hours: 100 },
        { name: 'Compétences comportementales', code: 'EGTS205', hours: 30 },
        { name: 'Culture entrepreneuriale', code: 'EGTS204', hours: 45 },
        { name: 'Droit commercial', code: 'GE02', hours: 80 },
        { name: 'Entrepreneuriat-PIE 2', code: 'EGTS208', hours: 80 },
        { name: 'Fiscalité', code: 'GE03', hours: 70 },
        { name: 'Français', code: 'EGTS202', hours: 115 },
        { name: 'Gestion commerciale', code: 'GE04', hours: 100 },
        { name: 'Gestion des ressources humaines', code: 'GE05', hours: 80 },
        { name: 'Intégration du milieu professionnel', code: 'M208', hours: 160 },
        { name: 'Marketing', code: 'GE06', hours: 100 },
        { name: 'Projet de synthèse', code: 'M207', hours: 0 },
        { name: 'Statistiques', code: 'GE07', hours: 70 },
        { name: 'Techniques de communication', code: 'EGTS201', hours: 60 },
        { name: 'Techniques quantitatives', code: 'GE08', hours: 80 },
        { name: 'Économie générale', code: 'GE09', hours: 70 },
        { name: 'Études de marché', code: 'GE10', hours: 80 },
      ],
    },
    {
      name: 'Gestion des Entreprises - Comptabilité et Finance',
      code: 'GECF',
      levelId: l2Id,
      modules: [
        { name: 'Anglais technique', code: 'EGTS203', hours: 50 },
        { name: 'Comptabilité approfondie', code: 'GECF01', hours: 120 },
        { name: 'Compétences comportementales', code: 'EGTS205', hours: 30 },
        { name: 'Contrôle de gestion', code: 'GECF02', hours: 90 },
        { name: 'Culture entrepreneuriale', code: 'EGTS204', hours: 45 },
        { name: 'Droit des sociétés', code: 'GECF03', hours: 70 },
        { name: 'Entrepreneuriat-PIE 2', code: 'EGTS208', hours: 80 },
        { name: 'Fiscalité approfondie', code: 'GECF04', hours: 90 },
        { name: 'Français', code: 'EGTS202', hours: 115 },
        { name: 'Gestion financière', code: 'GECF05', hours: 100 },
        { name: 'Intégration du milieu professionnel', code: 'M208', hours: 160 },
        { name: 'Projet de synthèse', code: 'M207', hours: 0 },
        { name: 'Techniques de communication', code: 'EGTS201', hours: 60 },
        { name: 'Techniques quantitatives', code: 'GE08', hours: 80 },
        { name: 'Économie', code: 'GECF06', hours: 60 },
      ],
    },
    {
      name: 'Gestion des Entreprises - Office Manager',
      code: 'GEOM',
      levelId: l2Id,
      modules: [
        { name: 'Anglais technique', code: 'EGTS203', hours: 50 },
        { name: 'Bureautique', code: 'GEOM01', hours: 90 },
        { name: 'Communication professionnelle', code: 'GEOM02', hours: 80 },
        { name: 'Compétences comportementales', code: 'EGTS205', hours: 30 },
        { name: 'Comptabilité', code: 'GE01', hours: 80 },
        { name: 'Culture entrepreneuriale', code: 'EGTS204', hours: 45 },
        { name: 'Droit du travail', code: 'GEOM03', hours: 60 },
        { name: 'Entrepreneuriat-PIE 2', code: 'EGTS208', hours: 80 },
        { name: 'Français', code: 'EGTS202', hours: 115 },
        { name: 'Gestion administrative', code: 'GEOM04', hours: 100 },
        { name: 'Gestion des ressources humaines', code: 'GE05', hours: 80 },
        { name: 'Intégration du milieu professionnel', code: 'M208', hours: 160 },
        { name: 'Organisation d\'événements', code: 'GEOM05', hours: 70 },
        { name: 'Projet de synthèse', code: 'M207', hours: 0 },
        { name: 'Techniques de communication', code: 'EGTS201', hours: 60 },
        { name: 'Techniques de recherche d\'emploi', code: 'GEOM06', hours: 40 },
        { name: ' Économie et gestion', code: 'GEOM07', hours: 70 },
        { name: 'Éthique professionnelle', code: 'GEOM08', hours: 30 },
      ],
    },
    {
      name: 'Gestion des Entreprises - Ressources Humaines',
      code: 'GERH',
      modules: [
        { name: 'Anglais technique', code: 'EGTS203', hours: 50 },
        { name: 'Compétences comportementales', code: 'EGTS205', hours: 30 },
        { name: 'Comptabilité', code: 'GE01', hours: 70 },
        { name: 'Culture entrepreneuriale', code: 'EGTS204', hours: 45 },
        { name: 'Droit du travail', code: 'GEOM03', hours: 80 },
        { name: 'Entrepreneuriat-PIE 2', code: 'EGTS208', hours: 80 },
        { name: 'Français', code: 'EGTS202', hours: 115 },
        { name: 'Gestion administrative', code: 'GEOM04', hours: 60 },
        { name: 'Gestion des carrières', code: 'GERH01', hours: 70 },
        { name: 'Gestion des conflits', code: 'GERH02', hours: 50 },
        { name: 'Gestion des ressources humaines', code: 'GE05', hours: 100 },
        { name: 'Intégration du milieu professionnel', code: 'M208', hours: 160 },
        { name: 'Paie et administration', code: 'GERH03', hours: 90 },
        { name: 'Projet de synthèse', code: 'M207', hours: 0 },
        { name: 'Techniques de communication', code: 'EGTS201', hours: 60 },
      ],
    },
    {
      name: 'Infrastructure Digitale - Cloud Computing',
      code: 'IDOCC',
      modules: [
        { name: 'Anglais technique', code: 'EGTS203', hours: 50 },
        { name: 'Architecture Cloud', code: 'IDCC01', hours: 100 },
        { name: 'Compétences comportementales', code: 'EGTS205', hours: 30 },
        { name: 'Conteneurisation', code: 'IDCC02', hours: 80 },
        { name: 'Culture entrepreneuriale', code: 'EGTS204', hours: 45 },
        { name: 'DevOps', code: 'IDCC03', hours: 90 },
        { name: 'Entrepreneuriat-PIE 2', code: 'EGTS208', hours: 80 },
        { name: 'Français', code: 'EGTS202', hours: 115 },
        { name: 'Intégration du milieu professionnel', code: 'M208', hours: 160 },
        { name: 'Projet de synthèse', code: 'M207', hours: 0 },
        { name: 'Réseaux', code: 'IDCC04', hours: 100 },
        { name: 'Sécurité Cloud', code: 'IDCC05', hours: 80 },
        { name: 'Techniques de communication', code: 'EGTS201', hours: 60 },
      ],
    },
    {
      name: 'Infrastructure Digitale - Cyber sécurité',
      code: 'IDOCS',
      modules: [
        { name: 'Anglais technique', code: 'EGTS203', hours: 50 },
        { name: 'Compétences comportementales', code: 'EGTS205', hours: 30 },
        { name: 'Cryptographie', code: 'IDCS01', hours: 80 },
        { name: 'Culture entrepreneuriale', code: 'EGTS204', hours: 45 },
        { name: 'Entrepreneuriat-PIE 2', code: 'EGTS208', hours: 80 },
        { name: 'Français', code: 'EGTS202', hours: 115 },
        { name: 'Hacking éthique', code: 'IDCS02', hours: 100 },
        { name: 'Intégration du milieu professionnel', code: 'M208', hours: 160 },
        { name: 'Projet de synthèse', code: 'M207', hours: 0 },
        { name: 'Réseaux', code: 'IDCC04', hours: 100 },
        { name: 'Sécurité des systèmes', code: 'IDCS03', hours: 90 },
        { name: 'Techniques de communication', code: 'EGTS201', hours: 60 },
      ],
    },
    {
      name: 'Infrastructure Digitale - IOT',
      code: 'IDIOT',
      modules: [
        { name: 'Anglais technique', code: 'EGTS203', hours: 50 },
        { name: 'Capteurs et actionneurs', code: 'IDIOT01', hours: 80 },
        { name: 'Compétences comportementales', code: 'EGTS205', hours: 30 },
        { name: 'Culture entrepreneuriale', code: 'EGTS204', hours: 45 },
        { name: 'Entrepreneuriat-PIE 2', code: 'EGTS208', hours: 80 },
        { name: 'Français', code: 'EGTS202', hours: 115 },
        { name: 'Intégration du milieu professionnel', code: 'M208', hours: 160 },
        { name: 'Programmation embarquée', code: 'IDIOT02', hours: 100 },
        { name: 'Projet de synthèse', code: 'M207', hours: 0 },
        { name: 'Protocoles IOT', code: 'IDIOT03', hours: 80 },
        { name: 'Réseaux sans fil', code: 'IDIOT04', hours: 80 },
        { name: 'Techniques de communication', code: 'EGTS201', hours: 60 },
      ],
    },
    {
      name: 'Infrastructure Digitale - Réseaux et systèmes',
      code: 'IDOSR',
      modules: [
        { name: 'Administration système', code: 'IDSR01', hours: 100 },
        { name: 'Anglais technique', code: 'EGTS203', hours: 50 },
        { name: 'Compétences comportementales', code: 'EGTS205', hours: 30 },
        { name: 'Culture entrepreneuriale', code: 'EGTS204', hours: 45 },
        { name: 'Entrepreneuriat-PIE 2', code: 'EGTS208', hours: 80 },
        { name: 'Français', code: 'EGTS202', hours: 115 },
        { name: 'Intégration du milieu professionnel', code: 'M208', hours: 160 },
        { name: 'Projet de synthèse', code: 'M207', hours: 0 },
        { name: 'Réseaux avancés', code: 'IDSR02', hours: 110 },
        { name: 'Sécurité des réseaux', code: 'IDSR03', hours: 80 },
        { name: 'Services réseaux', code: 'IDSR04', hours: 90 },
        { name: 'Techniques de communication', code: 'EGTS201', hours: 60 },
        { name: 'Virtualisation', code: 'IDSR05', hours: 80 },
        { name: 'VoIP et téléphonie', code: 'IDSR06', hours: 60 },
      ],
    },
  ];

  // Create admin
  const hashedPassword = await bcrypt.hash('TirsiyahyaAdmin@2004', 10);
  await prisma.admin.create({
    data: { email: 'yahyatirsi935@gmail.com', password: hashedPassword, name: 'Yahya Tirsi' },
  });

  // Create filières with modules
  for (const f of filieresData) {
    const slug = f.name.toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const filiere = await prisma.filiere.create({
      data: {
        name: f.name,
        code: f.code,
        slug,
        levelId: (f as any).levelId || undefined,
        moduleCount: f.modules.length,
      },
    });

    for (const m of f.modules) {
      await prisma.module.create({
        data: {
          name: m.name,
          code: m.code,
          hours: m.hours,
          filiereId: filiere.id,
        },
      });
    }
  }

  console.log('Seed completed:');
  console.log(`  - ${levels.length} levels`);
  console.log(`  - ${categories.length} categories`);
  console.log(`  - ${filieresData.length} filières`);
  console.log(`  - ${filieresData.reduce((s, f) => s + f.modules.length, 0)} modules`);
  console.log('  - 1 admin (admin@ofppt-platforme.com / admin123)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
