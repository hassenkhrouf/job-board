import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function daysFromNow(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

const companies = [
  {
    name: "Vermeg",
    slug: "vermeg",
    website: "https://www.vermeg.com",
    description:
      "Éditeur de logiciels bancaires présent à Tunis et à l'international.",
  },
  {
    name: "Telnet Holding",
    slug: "telnet-holding",
    website: "https://www.telnet.tn",
    description:
      "Groupe technologique tunisien : ingénierie logicielle, R&D et conseil.",
  },
  {
    name: "Ooredoo Tunisie",
    slug: "ooredoo-tunisie",
    website: "https://www.ooredoo.tn",
    description: "Opérateur de télécommunications en Tunisie.",
  },
  {
    name: "Smart Soft Tunisia",
    slug: "smart-soft-tunisia",
    website: "https://www.smartsoft.tn",
    description: "Société de services en ingénierie informatique.",
  },
  {
    name: "Cogite",
    slug: "cogite",
    website: "https://www.cogite.tn",
    description: "Espace de coworking et communautés tech à Tunis.",
  },
  {
    name: "Ministère de l'Éducation",
    slug: "ministere-education",
    website: null,
    description: "Ministère de l'Éducation de la République tunisienne.",
  },
  {
    name: "Atlas Bank",
    slug: "atlas-bank",
    website: "https://www.atlasbank.tn",
    description: "Banque tunisienne.",
  },
  {
    name: "École Internationale de Carthage",
    slug: "ecole-internationale-carthage",
    website: null,
    description: "Établissement scolaire privé à Carthage.",
  },
];

const categories = [
  { name: "Informatique", slug: "informatique" },
  { name: "Ingénierie", slug: "ingenierie" },
  { name: "Finance & Comptabilité", slug: "finance-comptabilite" },
  { name: "Marketing & Communication", slug: "marketing-communication" },
  { name: "Éducation & Formation", slug: "education-formation" },
  { name: "Administration", slug: "administration" },
  { name: "Ressources humaines", slug: "ressources-humaines" },
  { name: "Santé", slug: "sante" },
];

const locations = [
  { name: "Tunis", slug: "tunis" },
  { name: "Sousse", slug: "sousse" },
  { name: "Sfax", slug: "sfax" },
  { name: "Nabeul", slug: "nabeul" },
  { name: "Monastir", slug: "monastir" },
  { name: "Bizerte", slug: "bizerte" },
  { name: "Carthage", slug: "carthage" },
  { name: "À distance", slug: "a-distance" },
];

type SeedJob = {
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  company: string;
  category: string;
  location: string;
  employmentType:
    | "FULL_TIME"
    | "PART_TIME"
    | "CONTRACT"
    | "INTERNSHIP"
    | "TEMPORARY"
    | "COMPETITION";
  status: "DRAFT" | "PUBLISHED" | "CLOSED";
  featured: boolean;
  deadlineInDays: number;
};

const jobs: SeedJob[] = [
  {
    title: "Développeur Full Stack (React / Node.js)",
    slug: "developpeur-full-stack-react-node-js",
    excerpt:
      "Rejoignez une équipe produit à Tunis pour développer des applications bancaires modernes.",
    description:
      "Vous intégrez l'équipe produit de Vermeg et participez au développement d'applications bancaires.\n\nMissions :\n- Développer des interfaces React performantes\n- Concevoir et maintenir des API Node.js\n- Participer aux revues de code et aux tests\n\nProfil recherché :\n- 3+ ans d'expérience en développement web\n- Maîtrise de TypeScript, React et Node.js\n- Bonne connaissance de PostgreSQL et Git\n\nNous offrons un environnement de travail stimulant, du télétravail partiel et des formations continues.",
    company: "vermeg",
    category: "informatique",
    location: "tunis",
    employmentType: "FULL_TIME",
    status: "PUBLISHED",
    featured: true,
    deadlineInDays: 45,
  },
  {
    title: "Ingénieur DevOps",
    slug: "ingenieur-devops",
    excerpt:
      "Automatisation des déploiements, conteneurisation et supervision des infrastructures.",
    description:
      "Au sein de la direction technique de Telnet Holding, vous pilotez l'infrastructure de nos projets.\n\nMissions :\n- Déployer et administrer des clusters Kubernetes\n- Mettre en place des pipelines CI/CD\n- Superviser la sécurité et la performance des environnements\n\nProfil recherché :\n- 2+ ans d'expérience en administration Linux\n- Compétences en Docker, Kubernetes et Terraform\n- Sens de la rigueur et de la documentation",
    company: "telnet-holding",
    category: "informatique",
    location: "sfax",
    employmentType: "FULL_TIME",
    status: "PUBLISHED",
    featured: true,
    deadlineInDays: 30,
  },
  {
    title: "Chargé(e) de communication digitale",
    slug: "charge-communication-digitale",
    excerpt:
      "Animez la présence en ligne d'Ooredoo et développez notre audience sur les réseaux sociaux.",
    description:
      "Vous rejoignez le département marketing d'Ooredoo Tunisie.\n\nMissions :\n- Créer et planifier les contenus sur les réseaux sociaux\n- Suivre les performances des campagnes digitales\n- Coordonner les partenariats avec les créateurs de contenu\n\nProfil recherché :\n- Formation en marketing ou communication\n- Expérience confirmée en gestion des réseaux sociaux\n- Créativité et bon relationnel",
    company: "ooredoo-tunisie",
    category: "marketing-communication",
    location: "tunis",
    employmentType: "FULL_TIME",
    status: "PUBLISHED",
    featured: false,
    deadlineInDays: 20,
  },
  {
    title: "Stage en développement logiciel",
    slug: "stage-developpement-logiciel",
    excerpt:
      "Stage de fin d'études en développement web au sein de Smart Soft Tunisia.",
    description:
      "Smart Soft Tunisia propose un stage de fin d'études en développement web.\n\nVos missions :\n- Développer des fonctionnalités sur une application SaaS\n- Participer aux revues de code et aux rétrospectives\n\nConditions :\n- Durée : 4 à 6 mois\n- Indemnité de stage\n- Opportunité d'embauche à la clé",
    company: "smart-soft-tunisia",
    category: "informatique",
    location: "tunis",
    employmentType: "INTERNSHIP",
    status: "PUBLISHED",
    featured: false,
    deadlineInDays: 60,
  },
  {
    title: "Chef de projet IT",
    slug: "chef-de-projet-it",
    excerpt:
      "Pilotez des projets web de A à Z au sein de l'écosystème start-up de Cogite.",
    description:
      "Nous cherchons un chef de projet pour accompagner nos clients dans la livraison de projets web.\n\nMissions :\n- Cadrer les besoins et rédiger les spécifications\n- Planifier et suivre l'avancement des équipes\n- Garantir la qualité des livrables\n\nProfil recherché :\n- 3+ ans d'expérience en gestion de projet\n- Connaissance des méthodologies agiles\n- Excellente communication en français",
    company: "cogite",
    category: "informatique",
    location: "a-distance",
    employmentType: "CONTRACT",
    status: "PUBLISHED",
    featured: false,
    deadlineInDays: 35,
  },
  {
    title: "Concours de recrutement : Technicien supérieur en informatique",
    slug: "concours-technicien-superieur-informatique",
    excerpt:
      "Concours sur titre pour le recrutement de techniciens supérieurs dans les établissements publics.",
    description:
      "Le ministère de l'Éducation organise un concours sur titre pour le recrutement de techniciens supérieurs en informatique.\n\nConditions de participation :\n- Être de nationalité tunisienne\n- Être titulaire du diplôme requis\n- Dossier de candidature à déposer avant la date limite\n\nLes candidats retenus seront affectés dans les établissements publics selon les besoins.",
    company: "ministere-education",
    category: "administration",
    location: "tunis",
    employmentType: "COMPETITION",
    status: "PUBLISHED",
    featured: true,
    deadlineInDays: 25,
  },
  {
    title: "Responsable comptable",
    slug: "responsable-comptable",
    excerpt:
      "Supervisez la comptabilité générale et la production des états financiers d'Atlas Bank.",
    description:
      "Atlas Bank recrute un responsable comptable pour son siège à Tunis.\n\nMissions :\n- Superviser la comptabilité générale et analytique\n- Élaborer les états financiers périodiques\n- Coordonner les relations avec les auditeurs\n\nProfil recherché :\n- Diplôme en finance ou comptabilité\n- 5+ ans d'expérience dans le secteur bancaire\n- Maîtrise des normes comptables",
    company: "atlas-bank",
    category: "finance-comptabilite",
    location: "tunis",
    employmentType: "FULL_TIME",
    status: "PUBLISHED",
    featured: false,
    deadlineInDays: 40,
  },
  {
    title: "Enseignant(e) de mathématiques",
    slug: "enseignant-mathematiques",
    excerpt:
      "Enseignement des mathématiques en lycée, intégration à la communauté de l'école.",
    description:
      "L'École Internationale de Carthage recrute un enseignant de mathématiques.\n\nMissions :\n- Assurer les cours de mathématiques au lycée\n- Participer à la vie scolaire et aux projets pédagogiques\n\nProfil recherché :\n- Licence ou master en mathématiques\n- Expérience de l'enseignement souhaitée\n- Sens de la pédagogie et de l'écoute",
    company: "ecole-internationale-carthage",
    category: "education-formation",
    location: "carthage",
    employmentType: "FULL_TIME",
    status: "DRAFT",
    featured: false,
    deadlineInDays: 50,
  },
];

async function upsertCompanies() {
  for (const company of companies) {
    await prisma.company.upsert({
      where: { slug: company.slug },
      update: {},
      create: {
        name: company.name,
        slug: company.slug,
        website: company.website,
        description: company.description,
      },
    });
  }
  console.log(`Entreprises : ${companies.length}`);
}

async function upsertCategories() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
  console.log(`Catégories : ${categories.length}`);
}

async function upsertLocations() {
  for (const location of locations) {
    await prisma.location.upsert({
      where: { slug: location.slug },
      update: {},
      create: location,
    });
  }
  console.log(`Localisations : ${locations.length}`);
}

async function upsertJobs() {
  let created = 0;

  for (const job of jobs) {
    const company = await prisma.company.findUnique({
      where: { slug: job.company },
    });
    const category = await prisma.category.findUnique({
      where: { slug: job.category },
    });
    const location = await prisma.location.findUnique({
      where: { slug: job.location },
    });

    if (!company || !category || !location) {
      console.warn(`Référentiel manquant pour « ${job.title} », ignoré.`);
      continue;
    }

    const publishedAt = job.status === "PUBLISHED" ? daysFromNow(-1) : null;

    const existing = await prisma.job.findUnique({ where: { slug: job.slug } });
    if (existing) {
      continue;
    }

    await prisma.job.create({
      data: {
        title: job.title,
        slug: job.slug,
        excerpt: job.excerpt,
        description: job.description,
        applicationUrl: company.website ?? "https://exemple.com/candidature",
        employmentType: job.employmentType,
        status: job.status,
        featured: job.featured,
        deadline: daysFromNow(job.deadlineInDays),
        publishedAt,
        companyId: company.id,
        categoryId: category.id,
        locationId: location.id,
      },
    });
    created += 1;
  }

  console.log(`Offres créées : ${created}`);
}

async function main() {
  await upsertCompanies();
  await upsertCategories();
  await upsertLocations();
  await upsertJobs();
  console.log("Seed terminé.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
