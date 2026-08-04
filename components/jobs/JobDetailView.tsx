import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { employmentTypeLabels, type JobDetail } from "@/lib/jobs/types";
import type { BreadcrumbItem } from "@/lib/seo/breadcrumb-json-ld";
import { formatDate } from "@/lib/utils/format";
import { CopyLinkButton } from "@/components/ui/CopyLinkButton";

type JobDetailViewProps = {
  job: JobDetail;
  breadcrumbs?: BreadcrumbItem[];
};

export function JobDetailView({ job, breadcrumbs }: JobDetailViewProps) {
  const publishedDate = job.publishedAt ?? job.createdAt;
  const employmentLabel = employmentTypeLabels[job.employmentType];
  const descriptionParagraphs = job.description
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <article>
      {breadcrumbs ? (
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      ) : null}

      <header className="border-b border-neutral-200 pb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
          {job.title}
        </h1>

        <p className="mt-3 flex items-center gap-2 text-lg text-neutral-700">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-neutral-400"
            aria-hidden="true"
          >
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          </svg>
          {job.company.name}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge>{job.category.name}</Badge>
          <Badge>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3"
              aria-hidden="true"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {job.location.name}
          </Badge>
          {employmentLabel ? (
            <Badge variant="brand">{employmentLabel}</Badge>
          ) : null}
        </div>

        <dl className="mt-6 flex flex-col gap-2 text-sm text-neutral-600 sm:flex-row sm:flex-wrap sm:gap-x-8">
          <div className="flex gap-2">
            <dt className="font-medium text-neutral-900">Publié le</dt>
            <dd>
              <time dateTime={publishedDate.toISOString()}>
                {formatDate(publishedDate)}
              </time>
            </dd>
          </div>

          <div className="flex gap-2">
            <dt className="font-medium text-neutral-900">Date limite</dt>
            <dd>
              <time dateTime={job.deadline.toISOString()}>
                {formatDate(job.deadline)}
              </time>
            </dd>
          </div>
        </dl>
      </header>

      <div className="mt-8">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
          Description de l&apos;offre
        </h2>
        <div className="mt-3 space-y-4 text-base leading-relaxed text-neutral-700">
          {descriptionParagraphs.map((paragraph, index) => (
            <p key={index} className="whitespace-pre-wrap">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <ButtonLink href={job.applicationUrl} size="lg" external>
          Postuler à cette offre
        </ButtonLink>
        {job.company.website ? (
          <ButtonLink
            href={job.company.website}
            size="lg"
            variant="secondary"
            external
          >
            Site de l&apos;entreprise
          </ButtonLink>
        ) : null}
        <CopyLinkButton />
      </div>

      <p className="mt-8 text-sm text-neutral-500">
        <Link href="/jobs" className="hover:text-brand-700 hover:underline">
          ← Retour aux offres
        </Link>
      </p>
    </article>
  );
}
