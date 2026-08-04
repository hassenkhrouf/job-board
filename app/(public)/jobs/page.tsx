import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { JobsListingLayout } from "@/components/jobs/JobsListingLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCategoryBySlug } from "@/lib/jobs/get-category-by-slug";
import { getLocationBySlug } from "@/lib/jobs/get-location-by-slug";
import { getPublishedJobs } from "@/lib/jobs/get-published-jobs";
import { getSearchFilterOptions } from "@/lib/jobs/get-search-filter-options";
import {
  buildJobSearchPath,
  jobSearchParamsAreDirty,
  parseJobSearchParams,
  type RawSearchParams,
} from "@/lib/jobs/search-params";
import {
  buildJobsListingHeading,
  buildJobsListingSeo,
} from "@/lib/seo/jobs-listing-seo";
import { buildBreadcrumbJsonLd } from "@/lib/seo/breadcrumb-json-ld";

type JobsPageProps = {
  searchParams: Promise<RawSearchParams>;
};

async function resolveFilterLabels(filters: {
  q?: string;
  category?: string;
  location?: string;
  page: number;
}) {
  const [category, location] = await Promise.all([
    filters.category ? getCategoryBySlug(filters.category) : null,
    filters.location ? getLocationBySlug(filters.location) : null,
  ]);

  return {
    q: filters.q,
    categoryName: category?.name,
    locationName: location?.name,
    categorySlug: category?.slug,
    locationSlug: location?.slug,
    page: filters.page,
  };
}

export async function generateMetadata({
  searchParams,
}: JobsPageProps): Promise<Metadata> {
  const raw = await searchParams;
  const filters = parseJobSearchParams(raw);
  const labels = await resolveFilterLabels(filters);

  return buildJobsListingSeo({
    basePath: "/jobs",
    ...labels,
  });
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const raw = await searchParams;

  if (jobSearchParamsAreDirty(raw)) {
    const cleaned = parseJobSearchParams(raw);
    redirect(
      buildJobSearchPath("/jobs", {
        q: cleaned.q,
        category: cleaned.category,
        location: cleaned.location,
        page: cleaned.page,
      }),
    );
  }

  const filters = parseJobSearchParams(raw);
  const [labels, filterOptions, result] = await Promise.all([
    resolveFilterLabels(filters),
    getSearchFilterOptions(),
    getPublishedJobs({
      q: filters.q,
      categorySlug: filters.category,
      locationSlug: filters.location,
      page: filters.page,
    }),
  ]);

  const heading = buildJobsListingHeading({
    basePath: "/jobs",
    ...labels,
  });

  const filterParams = {
    q: filters.q,
    category: labels.categorySlug,
    location: labels.locationSlug,
  };

  const breadcrumbs = [
    { name: "Accueil", href: "/" },
    { name: "Offres d'emploi", href: "/jobs" },
  ];

  return (
    <>
      <JsonLd
        id="breadcrumb-json-ld"
        data={buildBreadcrumbJsonLd(breadcrumbs)}
      />
      <JobsListingLayout
        title={heading.title}
        description={heading.description}
        breadcrumbs={breadcrumbs}
        total={result.total}
        categories={filterOptions.categories}
        locations={filterOptions.locations}
        searchDefaultValues={filterParams}
        jobs={result.jobs}
        currentPage={result.currentPage}
        totalPages={result.totalPages}
        paginationParams={filterParams}
      />
    </>
  );
}
