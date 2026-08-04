import { prisma } from "@/lib/database/prisma";

export type FormSelectOption = {
  id: string;
  name: string;
};

export type JobFormOptions = {
  companies: FormSelectOption[];
  categories: FormSelectOption[];
  locations: FormSelectOption[];
};

const emptyOptions: JobFormOptions = {
  companies: [],
  categories: [],
  locations: [],
};

/** Companies, categories and locations for the admin job form <select>s. */
export async function getJobFormOptions(): Promise<JobFormOptions> {
  if (!process.env.DATABASE_URL) {
    return emptyOptions;
  }

  try {
    const [companies, categories, locations] = await Promise.all([
      prisma.company.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
      prisma.location.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
    ]);

    return {
      companies,
      categories,
      locations,
    };
  } catch {
    return emptyOptions;
  }
}
