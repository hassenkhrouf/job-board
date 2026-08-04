import type { MetadataRoute } from "next";
import { prisma } from "@/lib/database/prisma";
import { siteUrl } from "@/lib/seo/site-url";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${base}/jobs`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${base}/categories`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${base}/locations`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  if (process.env.DATABASE_URL) {
    try {
      const [jobs, categories, locations] = await Promise.all([
        prisma.job.findMany({
          where: { status: "PUBLISHED" },
          orderBy: { updatedAt: "desc" },
          select: { slug: true, updatedAt: true },
        }),
        prisma.category.findMany({
          orderBy: { updatedAt: "desc" },
          select: { slug: true, updatedAt: true },
        }),
        prisma.location.findMany({
          orderBy: { updatedAt: "desc" },
          select: { slug: true, updatedAt: true },
        }),
      ]);

      for (const job of jobs) {
        entries.push({
          url: `${base}/jobs/${job.slug}`,
          lastModified: job.updatedAt,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }

      for (const category of categories) {
        entries.push({
          url: `${base}/jobs/category/${category.slug}`,
          lastModified: category.updatedAt,
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }

      for (const location of locations) {
        entries.push({
          url: `${base}/jobs/location/${location.slug}`,
          lastModified: location.updatedAt,
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
    } catch {
      // Sitemap falls back to static entries when the database is unavailable.
    }
  }

  return entries;
}
