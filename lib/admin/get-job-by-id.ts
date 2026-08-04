import type { EmploymentType, JobStatus } from "@prisma/client";
import { prisma } from "@/lib/database/prisma";

export type AdminJobDetail = {
  id: string;
  title: string;
  slug: string;
  description: string;
  excerpt: string | null;
  applicationUrl: string;
  employmentType: EmploymentType;
  status: JobStatus;
  featured: boolean;
  deadline: Date;
  publishedAt: Date | null;
  sourceUrl: string | null;
  companyId: string;
  categoryId: string;
  locationId: string;
};

export async function getJobForAdminById(
  id: string,
): Promise<AdminJobDetail | null> {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  try {
    const job = await prisma.job.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        excerpt: true,
        applicationUrl: true,
        employmentType: true,
        status: true,
        featured: true,
        deadline: true,
        publishedAt: true,
        sourceUrl: true,
        companyId: true,
        categoryId: true,
        locationId: true,
      },
    });

    if (!job) {
      return null;
    }

    return job;
  } catch {
    return null;
  }
}
