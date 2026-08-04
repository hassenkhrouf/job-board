import { JobCard } from "@/components/jobs/JobCard";
import type { JobCardData } from "@/lib/jobs/types";
import { Section } from "@/components/ui/Section";

type FeaturedJobsSectionProps = {
  jobs: JobCardData[];
};

export function FeaturedJobsSection({ jobs }: FeaturedJobsSectionProps) {
  if (jobs.length === 0) {
    return null;
  }

  return (
    <Section
      id="featured-jobs"
      title="Offres à la une"
      description="Les opportunités mises en avant par les recruteurs."
    >
      <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {jobs.map((job) => (
          <li key={job.slug}>
            <JobCard job={job} featured />
          </li>
        ))}
      </ul>
    </Section>
  );
}
