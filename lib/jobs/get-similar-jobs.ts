import { cache } from "react";
import { prisma } from "@/lib/database/prisma";
import { SIMILAR_JOBS_LIMIT } from "@/lib/jobs/constants";
import {
  jobCardSelect,
  toJobCardData,
  type JobCardData,
} from "@/lib/jobs/types";

/**
 * Jobs in the same category as the given one, most recent first, excluding the
 * current job. Returns an empty list when the database is unavailable.
 */
export const getSimilarJobs = cache(
  async (categorySlug: string, excludeSlug: string): Promise<JobCardData[]> => {
    if (!process.env.DATABASE_URL) {
      return [];
    }

    try {
      const rows = await prisma.job.findMany({
        where: {
          status: "PUBLISHED",
          category: { slug: categorySlug },
          slug: { not: excludeSlug },
        },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        take: SIMILAR_JOBS_LIMIT,
        select: jobCardSelect,
      });

      return rows.map(toJobCardData);
    } catch {
      return [];
    }
  },
);
