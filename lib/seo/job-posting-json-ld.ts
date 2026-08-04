import type { EmploymentType } from "@prisma/client";
import type { JobDetail } from "@/lib/jobs/types";
import { absoluteUrl } from "@/lib/seo/site-url";

const schemaEmploymentType: Record<EmploymentType, string> = {
  FULL_TIME: "FULL_TIME",
  PART_TIME: "PART_TIME",
  CONTRACT: "CONTRACTOR",
  INTERNSHIP: "INTERN",
  TEMPORARY: "TEMPORARY",
  COMPETITION: "OTHER",
};

export function buildJobPostingJsonLd(job: JobDetail) {
  const datePosted = (job.publishedAt ?? job.createdAt).toISOString();

  const hiringOrganization: Record<string, string> = {
    "@type": "Organization",
    name: job.company.name,
  };

  if (job.company.website) {
    hiringOrganization.sameAs = job.company.website;
  }

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.excerpt ?? job.description,
    datePosted,
    validThrough: job.deadline.toISOString(),
    employmentType: schemaEmploymentType[job.employmentType],
    hiringOrganization,
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location.name,
      },
    },
    url: absoluteUrl(`/jobs/${job.slug}`),
  };
}
