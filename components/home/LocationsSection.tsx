import { EntityGridSection } from "@/components/home/EntityGridSection";
import type { EntityWithCount } from "@/lib/jobs/get-entities-with-counts";

type LocationsSectionProps = {
  locations: EntityWithCount[];
};

export function LocationsSection({ locations }: LocationsSectionProps) {
  return (
    <EntityGridSection
      id="locations"
      title="Lieux"
      description="Parcourez les offres par ville ou région."
      emptyDescription="Aucun lieu disponible pour le moment."
      hrefFor={(slug) => `/jobs/location/${slug}`}
      items={locations}
    />
  );
}
