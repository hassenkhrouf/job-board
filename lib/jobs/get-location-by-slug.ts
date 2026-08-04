import { cache } from "react";
import { prisma } from "@/lib/database/prisma";

export type LocationSummary = {
  id: string;
  name: string;
  slug: string;
};

export const getLocationBySlug = cache(
  async (slug: string): Promise<LocationSummary | null> => {
    if (!process.env.DATABASE_URL) {
      return null;
    }

    try {
      return await prisma.location.findUnique({
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
