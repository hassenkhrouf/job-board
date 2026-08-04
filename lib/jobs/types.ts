import type { EmploymentType, Prisma } from "@prisma/client";

export type JobDetail = {
  slug: string;
  title: string;
  excerpt: string | null;
  description: string;
  applicationUrl: string;
  employmentType: EmploymentType;
  deadline: Date;
  publishedAt: Date | null;
  createdAt: Date;
  company: {
    name: string;
    slug: string;
    website: string | null;
  };
  category: {
    name: string;
    slug: string;
  };
  location: {
    name: string;
    slug: string;
  };
};

export type JobCardData = {
  slug: string;
  title: string;
  employmentType: EmploymentType;
  deadline: Date;
  publishedAt: Date | null;
  createdAt: Date;
  companyName: string;
  categoryName: string;
  locationName: string;
};

/** Shared Prisma select for job cards (listings, homepage, similar jobs). */
export const jobCardSelect = {
  slug: true,
  title: true,
  employmentType: true,
  deadline: true,
  publishedAt: true,
  createdAt: true,
  company: { select: { name: true } },
  category: { select: { name: true } },
  location: { select: { name: true } },
} satisfies Prisma.JobSelect;

type JobCardRow = {
  slug: string;
  title: string;
  employmentType: EmploymentType;
  deadline: Date;
  publishedAt: Date | null;
  createdAt: Date;
  company: { name: string };
  category: { name: string };
  location: { name: string };
};

export function toJobCardData(job: JobCardRow): JobCardData {
  return {
    slug: job.slug,
    title: job.title,
    employmentType: job.employmentType,
    deadline: job.deadline,
    publishedAt: job.publishedAt,
    createdAt: job.createdAt,
    companyName: job.company.name,
    categoryName: job.category.name,
    locationName: job.location.name,
  };
}

export const employmentTypeLabels: Record<EmploymentType, string> = {
  FULL_TIME: "Temps plein",
  PART_TIME: "Temps partiel",
  CONTRACT: "Contrat",
  INTERNSHIP: "Stage",
  TEMPORARY: "Intérim",
  COMPETITION: "Concours",
};
