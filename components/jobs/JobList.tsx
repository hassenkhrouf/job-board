import { JobCard } from "@/components/jobs/JobCard";
import type { JobCardData } from "@/lib/jobs/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/button";

type JobListProps = {
  jobs: JobCardData[];
  emptyTitle?: string;
  emptyDescription?: string;
};

export function JobList({
  jobs,
  emptyTitle = "Aucune offre trouvée",
  emptyDescription = "Aucune offre ne correspond à votre recherche pour le moment.",
}: JobListProps) {
  if (jobs.length === 0) {
    return (
      <EmptyState title={emptyTitle} description={emptyDescription}>
        <ButtonLink href="/jobs" variant="secondary">
          Voir toutes les offres
        </ButtonLink>
      </EmptyState>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {jobs.map((job) => (
        <li key={job.slug}>
          <JobCard job={job} />
        </li>
      ))}
    </ul>
  );
}
