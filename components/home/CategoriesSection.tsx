import { EntityGridSection } from "@/components/home/EntityGridSection";
import type { EntityWithCount } from "@/lib/jobs/get-entities-with-counts";

type CategoriesSectionProps = {
  categories: EntityWithCount[];
};

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  return (
    <EntityGridSection
      id="categories"
      title="Catégories"
      description="Parcourez les offres par domaine."
      emptyDescription="Aucune catégorie disponible pour le moment."
      hrefFor={(slug) => `/jobs/category/${slug}`}
      items={categories}
    />
  );
}
