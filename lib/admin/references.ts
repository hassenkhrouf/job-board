import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/database/prisma";

export type ReferenceEntity = "company" | "category" | "location";

export const referenceConfig: Record<
  ReferenceEntity,
  {
    label: string;
    labelPlural: string;
    newHeading: string;
    editHeading: string;
    deleteHeading: string;
    listPath: string;
    newPath: string;
    editPath: (id: string) => string;
    deletePath: (id: string) => string;
    maxNameLength: number;
    nameHint: string;
    hasWebsite: boolean;
    hasDescription: boolean;
  }
> = {
  company: {
    label: "Entreprise",
    labelPlural: "Entreprises",
    newHeading: "Nouvelle entreprise",
    editHeading: "Modifier l'entreprise",
    deleteHeading: "Supprimer l'entreprise",
    listPath: "/admin/companies",
    newPath: "/admin/companies/new",
    editPath: (id) => `/admin/companies/${id}/edit`,
    deletePath: (id) => `/admin/companies/${id}/delete`,
    maxNameLength: 200,
    nameHint: "Nom de l'entreprise",
    hasWebsite: true,
    hasDescription: true,
  },
  category: {
    label: "Catégorie",
    labelPlural: "Catégories",
    newHeading: "Nouvelle catégorie",
    editHeading: "Modifier la catégorie",
    deleteHeading: "Supprimer la catégorie",
    listPath: "/admin/categories",
    newPath: "/admin/categories/new",
    editPath: (id) => `/admin/categories/${id}/edit`,
    deletePath: (id) => `/admin/categories/${id}/delete`,
    maxNameLength: 100,
    nameHint: "Nom de la catégorie (ex. Informatique)",
    hasWebsite: false,
    hasDescription: false,
  },
  location: {
    label: "Localisation",
    labelPlural: "Localisations",
    newHeading: "Nouvelle localisation",
    editHeading: "Modifier la localisation",
    deleteHeading: "Supprimer la localisation",
    listPath: "/admin/locations",
    newPath: "/admin/locations/new",
    editPath: (id) => `/admin/locations/${id}/edit`,
    deletePath: (id) => `/admin/locations/${id}/delete`,
    maxNameLength: 100,
    nameHint: "Nom de la ville ou région (ex. Tunis)",
    hasWebsite: false,
    hasDescription: false,
  },
};

export type ReferenceRow = {
  id: string;
  name: string;
  slug: string;
  website: string | null;
  description: string | null;
  jobCount: number;
};

type ReferenceInput = {
  name: string;
  website: string;
  description: string;
};

const commonSelect = {
  id: true,
  name: true,
  slug: true,
  _count: { select: { jobs: true } },
} as const;

const companySelect = {
  ...commonSelect,
  website: true,
  description: true,
} satisfies Prisma.CompanySelect;

function normalizeCompany(row: {
  id: string;
  name: string;
  slug: string;
  website: string | null;
  description: string | null;
  _count: { jobs: number };
}): ReferenceRow {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    website: row.website,
    description: row.description,
    jobCount: row._count.jobs,
  };
}

function normalizeNamed(row: {
  id: string;
  name: string;
  slug: string;
  _count: { jobs: number };
}): ReferenceRow {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    website: null,
    description: null,
    jobCount: row._count.jobs,
  };
}

export async function getReferences(
  entity: ReferenceEntity,
): Promise<ReferenceRow[]> {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    if (entity === "company") {
      const rows = await prisma.company.findMany({
        orderBy: { name: "asc" },
        select: companySelect,
      });
      return rows.map(normalizeCompany);
    }

    if (entity === "category") {
      const rows = await prisma.category.findMany({
        orderBy: { name: "asc" },
        select: commonSelect,
      });
      return rows.map(normalizeNamed);
    }

    const rows = await prisma.location.findMany({
      orderBy: { name: "asc" },
      select: commonSelect,
    });
    return rows.map(normalizeNamed);
  } catch {
    return [];
  }
}

export async function getReferenceById(
  entity: ReferenceEntity,
  id: string,
): Promise<ReferenceRow | null> {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  try {
    if (entity === "company") {
      const row = await prisma.company.findUnique({
        where: { id },
        select: companySelect,
      });
      return row ? normalizeCompany(row) : null;
    }

    if (entity === "category") {
      const row = await prisma.category.findUnique({
        where: { id },
        select: commonSelect,
      });
      return row ? normalizeNamed(row) : null;
    }

    const row = await prisma.location.findUnique({
      where: { id },
      select: commonSelect,
    });
    return row ? normalizeNamed(row) : null;
  } catch {
    return null;
  }
}

/** Generate a unique slug for a reference row, appending -2, -3, ... on collision. */
export async function uniqueReferenceSlug(
  entity: ReferenceEntity,
  name: string,
): Promise<string> {
  const base = slugifyReference(name);
  if (!base) {
    return "";
  }

  let candidate = base;
  let suffix = 2;

  const exists = async (slug: string): Promise<boolean> => {
    if (entity === "company") {
      return (await prisma.company.findUnique({ where: { slug } })) !== null;
    }
    if (entity === "category") {
      return (await prisma.category.findUnique({ where: { slug } })) !== null;
    }
    return (await prisma.location.findUnique({ where: { slug } })) !== null;
  };

  while (await exists(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

/** Keep a stable slug on edit; only regenerate when the name changed. */
export async function resolveReferenceEditSlug({
  entity,
  currentId,
  currentSlug,
  currentName,
  newName,
}: {
  entity: ReferenceEntity;
  currentId: string;
  currentSlug: string;
  currentName: string;
  newName: string;
}): Promise<string> {
  if (newName.trim() === currentName) {
    return currentSlug;
  }

  const base = slugifyReference(newName) || currentSlug;
  if (base === currentSlug) {
    return currentSlug;
  }

  let candidate = base;
  let suffix = 2;

  const collides = async (slug: string): Promise<boolean> => {
    if (entity === "company") {
      return (
        (await prisma.company.findFirst({
          where: { slug, id: { not: currentId } },
        })) !== null
      );
    }
    if (entity === "category") {
      return (
        (await prisma.category.findFirst({
          where: { slug, id: { not: currentId } },
        })) !== null
      );
    }
    return (
      (await prisma.location.findFirst({
        where: { slug, id: { not: currentId } },
      })) !== null
    );
  };

  while (await collides(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

export function slugifyReference(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export type ReferenceFormInput = ReferenceInput;
