import { cache } from "react";
import { prisma } from "@/lib/database/prisma";

export type CategorySummary = {
  id: string;
  name: string;
  slug: string;
};

export const getCategoryBySlug = cache(
  async (slug: string): Promise<CategorySummary | null> => {
    if (!process.env.DATABASE_URL) {
      return null;
    }

    try {
      return await prisma.category.findUnique({
        where: { slug },
        select: {
          id: true,
          name: true,
          slug: true,
        },
      });
    } catch {
      return null;
    }
  },
);
