import { JobList } from "@/components/jobs/JobList";
import { JobsPagination } from "@/components/jobs/JobsPagination";
import type { JobCardData } from "@/lib/jobs/types";
import { SearchBar } from "@/components/search/SearchBar";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import type { BreadcrumbItem } from "@/lib/seo/breadcrumb-json-ld";
import type { SearchFilterOption } from "@/lib/jobs/get-search-filter-options";

type JobsListingLayoutProps = {
  title: string;
  description: string;
  breadcrumbs?: BreadcrumbItem[];
  total?: number;
  searchAction?: string;
  showCategoryFilter?: boolean;
  showLocationFilter?: boolean;
  categories?: SearchFilterOption[];
  locations?: SearchFilterOption[];
  searchDefaultValues?: {
    q?: string;
    category?: string;
    location?: string;
  };
  jobs: JobCardData[];
  currentPage: number;
  totalPages: number;
  paginationBasePath?: string;
  paginationParams?: Record<string, string | undefined>;
};

function formatCount(value: number): string {
  return new Intl.NumberFormat("fr-FR").format(value);
}

export function JobsListingLayout({
  title,
  description,
  breadcrumbs,
  total,
  searchAction = "/jobs",
  showCategoryFilter = true,
  showLocationFilter = true,
  categories = [],
  locations = [],
  searchDefaultValues = {},
  jobs,
  currentPage,
  totalPages,
  paginationBasePath = "/jobs",
  paginationParams = {},
}: JobsListingLayoutProps) {
  return (
    <main>
      <div className="border-b border-neutral-200 bg-white py-8 sm:py-10">
        <Container>
          {breadcrumbs ? (
            <div className="mb-4">
              <Breadcrumbs items={breadcrumbs} />
            </div>
          ) : null}
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-base text-neutral-600">
            {description}
          </p>
        </Container>
      </div>

      <div className="border-b border-neutral-200 bg-neutral-50 py-6">
        <Container>
          <SearchBar
            action={searchAction}
            showCategory={showCategoryFilter}
            showLocation={showLocationFilter}
            categories={categories}
            locations={locations}
            defaultValues={searchDefaultValues}
          />
        </Container>
      </div>

      <div className="py-10 sm:py-12">
        <Container>
          {typeof total === "number" ? (
            <p className="mb-4 text-sm text-neutral-600">
              {formatCount(total)} offre{total > 1 ? "s" : ""}
              {currentPage > 1 ? ` — page ${currentPage}` : ""}
            </p>
          ) : null}
          <JobList jobs={jobs} />
          <JobsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            params={paginationParams}
            basePath={paginationBasePath}
          />
        </Container>
      </div>
    </main>
  );
}
