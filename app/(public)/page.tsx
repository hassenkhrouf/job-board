import type { Metadata } from "next";
import { AdPlaceholder } from "@/components/home/AdPlaceholder";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedJobsSection } from "@/components/home/FeaturedJobsSection";
import { Hero } from "@/components/home/Hero";
import { LatestJobsSection } from "@/components/home/LatestJobsSection";
import { LocationsSection } from "@/components/home/LocationsSection";
import { SearchBar } from "@/components/search/SearchBar";
import { Container } from "@/components/ui/Container";
import { getHomepageData } from "@/lib/jobs/get-homepage-data";
import { getSearchFilterOptions } from "@/lib/jobs/get-search-filter-options";

export const metadata: Metadata = {
  title: "Job Board — Emplois et Concours en Tunisie",
  description:
    "Trouvez des offres d'emploi, concours publics, stages et opportunités remote en Tunisie et en Afrique du Nord.",
};

export const revalidate = 300;

export default async function HomePage() {
  const [data, filterOptions] = await Promise.all([
    getHomepageData(),
    getSearchFilterOptions(),
  ]);

  return (
    <main>
      <Hero
        totalJobs={data.totalJobs}
        totalCategories={data.totalCategories}
        totalLocations={data.totalLocations}
      />

      <div className="border-b border-neutral-200 bg-neutral-50 py-6 sm:py-8">
        <Container>
          <SearchBar
            categories={filterOptions.categories}
            locations={filterOptions.locations}
          />
        </Container>
      </div>

      <FeaturedJobsSection jobs={data.featuredJobs} />
      <LatestJobsSection jobs={data.latestJobs} />
      <AdPlaceholder />
      <CategoriesSection categories={data.categories} />
      <LocationsSection locations={data.locations} />
    </main>
  );
}
