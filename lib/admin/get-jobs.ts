import type { JobStatus } from "@prisma/client";
import { prisma } from "@/lib/database/prisma";

export type AdminJobRow = {
  id: string;
  slug: string;
  title: string;
  status: JobStatus;
  createdAt: Date;
  company: {
    name: string;
  };
  category: {
    name: string;
  };
};

export type AdminJobsResult = {
  jobs: AdminJobRow[];
};

const emptyResult: AdminJobsResult = { jobs: [] };

/** All jobs for the admin table (every status), newest first. */
export async function getJobsForAdmin(): Promise<AdminJobsResult> {
  if (!process.env.DATABASE_URL) {
    return emptyResult;
  }

  try {
    const rows = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        status: true,
        createdAt: true,
        company: { select: { name: true } },
        category: { select: { name: true } },
      },
    });

    const jobs: AdminJobRow[] = rows.map((job) => ({
      id: job.id,
      slug: job.slug,
      title: job.title,
      status: job.status,
      createdAt: job.createdAt,
      company: { name: job.company.name },
      category: { name: job.category.name },
    }));

    return { jobs };
  } catch {
    return emptyResult;
  }
}
