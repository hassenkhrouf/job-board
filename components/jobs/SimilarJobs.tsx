import type { JobCardData } from "@/lib/jobs/types";
import { JobList } from "@/components/jobs/JobList";
import { ButtonLink } from "@/components/ui/button";

type SimilarJobsProps = {
  jobs: JobCardData[];
};

export function SimilarJobs({ jobs }: SimilarJobsProps) {
  if (jobs.length === 0) {
    return null;
  }

  return (
    <section
      className="mt-12 border-t border-neutral-200 pt-10"
      aria-labelledby="similar-jobs-heading"
    >
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <h2
          id="similar-jobs-heading"
          className="text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl"
        >
          Offres similaires
        </h2>
        <ButtonLink href="/jobs" variant="ghost" size="sm">
          Voir toutes les offres
        </ButtonLink>
      </div>
      <JobList jobs={jobs} />
    </section>
  );
}
