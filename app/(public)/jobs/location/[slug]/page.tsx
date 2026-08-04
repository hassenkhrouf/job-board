import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
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

type LocationPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<RawSearchParams>;
};

export async function generateMetadata({
  params,
  searchParams,
}: LocationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = await getLocationBySlug(slug);

  if (!location) {
    return {
      title: "Lieu introuvable | Job Board",
    };
  }

  const filters = parseJobSearchParams(await searchParams);
  const category = filters.category
    ? await getCategoryBySlug(filters.category)
    : null;

  return buildJobsListingSeo({
    basePath: `/jobs/location/${location.slug}`,
    q: filters.q,
    categoryName: category?.name,
    categorySlug: category?.slug,
    locationName: location.name,
    locationSlug: undefined,
    page: filters.page,
  });
}

export default async function LocationPage({
  params,
  searchParams,
}: LocationPageProps) {
  const { slug } = await params;
  const location = await getLocationBySlug(slug);

  if (!location) {
    notFound();
  }

  const basePath = `/jobs/location/${location.slug}`;
  const raw = await searchParams;

  if (jobSearchParamsAreDirty(raw)) {
    const cleaned = parseJobSearchParams(raw);
    redirect(
      buildJobSearchPath(basePath, {
        q: cleaned.q,
        category: cleaned.category,
        page: cleaned.page,
      }),
    );
  }

  const filters = parseJobSearchParams(raw);
  const [category, filterOptions, result] = await Promise.all([
    filters.category ? getCategoryBySlug(filters.category) : null,
    getSearchFilterOptions(),
    getPublishedJobs({
      q: filters.q,
      categorySlug: filters.category,
      locationSlug: location.slug,
      page: filters.page,
    }),
  ]);

  const heading = buildJobsListingHeading({
    basePath,
    q: filters.q,
    categoryName: category?.name,
    locationName: location.name,
  });

  const filterParams = {
    q: filters.q,
    category: category?.slug,
  };

  const breadcrumbs = [
    { name: "Accueil", href: "/" },
    { name: "Offres d'emploi", href: "/jobs" },
    { name: location.name, href: `/jobs/location/${location.slug}` },
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
        searchAction={basePath}
        showLocationFilter={false}
        categories={filterOptions.categories}
        searchDefaultValues={filterParams}
        jobs={result.jobs}
        currentPage={result.currentPage}
        totalPages={result.totalPages}
        paginationBasePath={basePath}
        paginationParams={filterParams}
      />
    </>
  );
}
