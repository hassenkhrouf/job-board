import { prisma } from "@/lib/database/prisma";

export type EntityWithCount = {
  slug: string;
  name: string;
  count: number;
};

export type EntityModel = "category" | "location";

const select = {
  slug: true,
  name: true,
  _count: {
    select: { jobs: { where: { status: "PUBLISHED" } } },
  },
} as const;

/**
 * Fetch categories or locations together with their count of PUBLISHED jobs,
 * ordered by popularity. The caller is responsible for error handling.
 */
export async function entitiesWithPublishedCount(
  model: EntityModel,
  limit: number,
): Promise<EntityWithCount[]> {
  const rows =
    model === "category"
      ? await prisma.category.findMany({ orderBy: { name: "asc" }, select })
      : await prisma.location.findMany({ orderBy: { name: "asc" }, select });

  return rows
    .map((row) => ({
      slug: row.slug,
      name: row.name,
      count: row._count.jobs,
    }))
    .filter((row) => row.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
