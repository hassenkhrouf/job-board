import { cache } from "react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/database/prisma";
import { JOBS_PAGE_SIZE } from "@/lib/jobs/constants";
import {
  jobCardSelect,
  toJobCardData,
  type JobCardData,
} from "@/lib/jobs/types";

export type PublishedJobsFilters = {
  q?: string;
  categorySlug?: string;
  locationSlug?: string;
  page?: number;
  pageSize?: number;
};

export type PublishedJobsResult = {
  jobs: JobCardData[];
  total: number;
  totalPages: number;
  currentPage: number;
};

const emptyResult = (page: number): PublishedJobsResult => ({
  jobs: [],
  total: 0,
  totalPages: 1,
  currentPage: page,
});

export const getPublishedJobs = cache(
  async (filters: PublishedJobsFilters = {}): Promise<PublishedJobsResult> => {
    const pageSize = filters.pageSize ?? JOBS_PAGE_SIZE;
    const currentPage = Math.max(1, filters.page ?? 1);

    if (!process.env.DATABASE_URL) {
      return emptyResult(currentPage);
    }

    const where: Prisma.JobWhereInput = {
      status: "PUBLISHED",
    };

    if (filters.q) {
      where.OR = [
        { title: { contains: filters.q, mode: "insensitive" } },
        { company: { name: { contains: filters.q, mode: "insensitive" } } },
        { excerpt: { contains: filters.q, mode: "insensitive" } },
      ];
    }

    if (filters.categorySlug) {
      where.category = { slug: filters.categorySlug };
    }

    if (filters.locationSlug) {
      where.location = { slug: filters.locationSlug };
    }

    try {
      const [total, rows] = await Promise.all([
        prisma.job.count({ where }),
        prisma.job.findMany({
          where,
          orderBy: [
            { featured: "desc" },
            { publishedAt: "desc" },
            { createdAt: "desc" },
          ],
          skip: (currentPage - 1) * pageSize,
          take: pageSize,
          select: jobCardSelect,
        }),
      ]);

      const totalPages = Math.max(1, Math.ceil(total / pageSize));

      return {
        jobs: rows.map(toJobCardData),
        total,
        totalPages,
        currentPage: Math.min(currentPage, totalPages),
      };
    } catch {
      return emptyResult(currentPage);
    }
  },
);
