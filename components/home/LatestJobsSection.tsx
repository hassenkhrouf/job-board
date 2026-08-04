import { JobCard } from "@/components/jobs/JobCard";
import type { JobCardData } from "@/lib/jobs/types";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/button";

type LatestJobsSectionProps = {
  jobs: JobCardData[];
};

export function LatestJobsSection({ jobs }: LatestJobsSectionProps) {
  return (
    <Section
      id="latest-jobs"
      title="Dernières offres"
      description="Les annonces publiées récemment."
      action={
        jobs.length > 0 ? (
          <ButtonLink href="/jobs" variant="ghost" size="sm">
            Voir toutes les offres
          </ButtonLink>
        ) : undefined
      }
    >
      {jobs.length > 0 ? (
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {jobs.map((job) => (
            <li key={job.slug}>
              <JobCard job={job} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 text-center">
          <p className="text-sm text-neutral-600">
            Aucune offre publiée pour le moment. Revenez bientôt !
          </p>
        </div>
      )}
    </Section>
  );
}
