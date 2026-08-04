import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobDetailView } from "@/components/jobs/JobDetailView";
import { SimilarJobs } from "@/components/jobs/SimilarJobs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { getJobBySlug } from "@/lib/jobs/get-job-by-slug";
import { getSimilarJobs } from "@/lib/jobs/get-similar-jobs";
import { buildJobPostingJsonLd } from "@/lib/seo/job-posting-json-ld";
import { buildBreadcrumbJsonLd } from "@/lib/seo/breadcrumb-json-ld";
import { truncate } from "@/lib/utils/format";

type JobDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: JobDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    return {
      title: "Offre introuvable | Job Board",
    };
  }

  const description = truncate(job.excerpt ?? job.description, 160);
  const canonical = `/jobs/${job.slug}`;
  const title = `${job.title} — ${job.company.name} | Job Board`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      locale: "fr_TN",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const [similarJobs] = await Promise.all([
    getSimilarJobs(job.category.slug, job.slug),
  ]);

  const breadcrumbs = [
    { name: "Accueil", href: "/" },
    { name: "Offres d'emploi", href: "/jobs" },
    { name: job.title, href: `/jobs/${job.slug}` },
  ];

  return (
    <main>
      <JsonLd id="job-posting-json-ld" data={buildJobPostingJsonLd(job)} />
      <JsonLd
        id="breadcrumb-json-ld"
        data={buildBreadcrumbJsonLd(breadcrumbs)}
      />

      <div className="py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl">
            <JobDetailView job={job} breadcrumbs={breadcrumbs} />
          </div>
          <div className="mx-auto max-w-3xl">
            <SimilarJobs jobs={similarJobs} />
          </div>
        </Container>
      </div>
    </main>
  );
}
