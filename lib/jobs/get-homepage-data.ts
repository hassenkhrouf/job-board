import { cache } from "react";
import { prisma } from "@/lib/database/prisma";
import {
  HOME_FEATURED_JOB_LIMIT,
  HOME_PAGE_JOB_LIMIT,
  HUB_PAGE_LIMIT,
} from "@/lib/jobs/constants";
import {
  entitiesWithPublishedCount,
  type EntityWithCount,
} from "@/lib/jobs/get-entities-with-counts";
import {
  jobCardSelect,
  toJobCardData,
  type JobCardData,
} from "@/lib/jobs/types";

export type HomepageData = {
  latestJobs: JobCardData[];
  featuredJobs: JobCardData[];
  categories: EntityWithCount[];
  locations: EntityWithCount[];
  totalJobs: number;
  totalCategories: number;
  totalLocations: number;
};

const emptyHomepage: HomepageData = {
  latestJobs: [],
  featuredJobs: [],
  categories: [],
  locations: [],
  totalJobs: 0,
  totalCategories: 0,
  totalLocations: 0,
};

export const getHomepageData = cache(async (): Promise<HomepageData> => {
  if (!process.env.DATABASE_URL) {
    return emptyHomepage;
  }

  try {
    const [
      latestJobs,
      featuredJobs,
      categories,
      locations,
      totalJobs,
      totalCategories,
      totalLocations,
    ] = await Promise.all([
      prisma.job.findMany({
        where: { status: "PUBLISHED" },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        take: HOME_PAGE_JOB_LIMIT,
        select: jobCardSelect,
      }),
      prisma.job.findMany({
        where: { status: "PUBLISHED", featured: true },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        take: HOME_FEATURED_JOB_LIMIT,
        select: jobCardSelect,
      }),
      entitiesWithPublishedCount("category", HUB_PAGE_LIMIT),
      entitiesWithPublishedCount("location", HUB_PAGE_LIMIT),
      prisma.job.count({ where: { status: "PUBLISHED" } }),
      prisma.category.count(),
      prisma.location.count(),
    ]);

    return {
      latestJobs: latestJobs.map(toJobCardData),
      featuredJobs: featuredJobs.map(toJobCardData),
      categories,
      locations,
      totalJobs,
      totalCategories,
      totalLocations,
    };
  } catch {
    return emptyHomepage;
  }
});
