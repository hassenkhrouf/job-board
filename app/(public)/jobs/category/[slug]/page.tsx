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

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<RawSearchParams>;
};

export async function generateMetadata({
  params,
  searchParams,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Catégorie introuvable | Job Board",
    };
  }

  const filters = parseJobSearchParams(await searchParams);
  const location = filters.location
    ? await getLocationBySlug(filters.location)
    : null;

  return buildJobsListingSeo({
    basePath: `/jobs/category/${category.slug}`,
    q: filters.q,
    categoryName: category.name,
    categorySlug: undefined,
    locationName: location?.name,
    locationSlug: location?.slug,
    page: filters.page,
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const basePath = `/jobs/category/${category.slug}`;
  const raw = await searchParams;

  if (jobSearchParamsAreDirty(raw)) {
    const cleaned = parseJobSearchParams(raw);
    redirect(
      buildJobSearchPath(basePath, {
        q: cleaned.q,
        location: cleaned.location,
        page: cleaned.page,
      }),
    );
  }

  const filters = parseJobSearchParams(raw);
  const [location, filterOptions, result] = await Promise.all([
    filters.location ? getLocationBySlug(filters.location) : null,
    getSearchFilterOptions(),
    getPublishedJobs({
      q: filters.q,
      categorySlug: category.slug,
      locationSlug: filters.location,
      page: filters.page,
    }),
  ]);

  const heading = buildJobsListingHeading({
    basePath,
    q: filters.q,
    categoryName: category.name,
    locationName: location?.name,
  });

  const filterParams = {
    q: filters.q,
    location: location?.slug,
  };

  const breadcrumbs = [
    { name: "Accueil", href: "/" },
    { name: "Offres d'emploi", href: "/jobs" },
    { name: category.name, href: `/jobs/category/${category.slug}` },
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
        showCategoryFilter={false}
        locations={filterOptions.locations}
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
