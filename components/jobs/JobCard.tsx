import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { employmentTypeLabels, type JobCardData } from "@/lib/jobs/types";
import { formatRelativeTime } from "@/lib/utils/format";

type JobCardProps = {
  job: JobCardData;
  featured?: boolean;
};

export function JobCard({ job, featured = false }: JobCardProps) {
  const displayDate = job.publishedAt ?? job.createdAt;
  const typeLabel = employmentTypeLabels[job.employmentType];

  return (
    <article
      className={`group rounded-xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
        featured
          ? "border-brand-200 ring-1 ring-brand-100"
          : "border-neutral-200 hover:border-neutral-300"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-base font-semibold tracking-tight text-neutral-900 sm:text-lg">
          <Link
            href={`/jobs/${job.slug}`}
            className="group-hover:text-brand-700"
          >
            {job.title}
          </Link>
        </h2>
        {featured ? (
          <Badge variant="brand" className="shrink-0">
            À la une
          </Badge>
        ) : null}
      </div>

      <p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-700">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 text-neutral-400"
          aria-hidden="true"
        >
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        </svg>
        {job.companyName}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge>{job.categoryName}</Badge>
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
          {job.locationName}
        </Badge>
        {typeLabel ? <Badge variant="brand">{typeLabel}</Badge> : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500">
        <time dateTime={displayDate.toISOString()}>
          Publié {formatRelativeTime(displayDate)}
        </time>
        <time dateTime={job.deadline.toISOString()}>
          Date limite :{" "}
          {new Intl.DateTimeFormat("fr-FR", {
            day: "numeric",
            month: "short",
          }).format(job.deadline)}
        </time>
      </div>
    </article>
  );
}
