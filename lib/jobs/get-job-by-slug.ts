import { cache } from "react";
import { prisma } from "@/lib/database/prisma";
import type { JobDetail } from "@/lib/jobs/types";

export const getJobBySlug = cache(
  async (slug: string): Promise<JobDetail | null> => {
    if (!process.env.DATABASE_URL) {
      return null;
    }

    try {
      return await prisma.job.findFirst({
        where: {
          slug,
          status: "PUBLISHED",
        },
        select: {
          slug: true,
          title: true,
          excerpt: true,
          description: true,
          applicationUrl: true,
          employmentType: true,
          deadline: true,
          publishedAt: true,
          createdAt: true,
          company: {
            select: {
              name: true,
              slug: true,
              website: true,
            },
          },
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
          location: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      });
    } catch {
      return null;
    }
  },
);
