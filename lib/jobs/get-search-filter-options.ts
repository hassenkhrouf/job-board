import { cache } from "react";
import { prisma } from "@/lib/database/prisma";

export type SearchFilterOption = {
  slug: string;
  name: string;
};

export type SearchFilterOptions = {
  categories: SearchFilterOption[];
  locations: SearchFilterOption[];
};

export const getSearchFilterOptions = cache(
  async (): Promise<SearchFilterOptions> => {
    if (!process.env.DATABASE_URL) {
      return { categories: [], locations: [] };
    }

    try {
      const [categories, locations] = await Promise.all([
        prisma.category.findMany({
          orderBy: { name: "asc" },
          select: { slug: true, name: true },
        }),
        prisma.location.findMany({
          orderBy: { name: "asc" },
          select: { slug: true, name: true },
        }),
      ]);

      return { categories, locations };
    } catch {
      return { categories: [], locations: [] };
    }
  },
);
