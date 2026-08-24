import type { Metadata } from "next";
import { EntityHub } from "@/components/jobs/EntityHub";
import { getCategoryHub } from "@/lib/jobs/get-category-hub";

export const metadata: Metadata = {
  title: "Catégories d'emploi - JobBoard | Trouvez votre carrière en Afrique",
  description:
    "Parcourez les offres d'emploi par catégorie : informatique, finance, ingénierie, marketing, administration, éducation et plus encore.",
  openGraph: {
    title: "Catégories d'emploi - JobBoard",
    description: "Découvrez les opportunités de carrière par secteur d'activité.",
    images: ["/og-image.png"],
  },
};

export const revalidate = 300;

export default async function CategoriesPage() {
  const categories = await getCategoryHub();

  return (
    <EntityHub
      title="Toutes les catégories"
      description="Parcourez les offres publiées par domaine d'activité."
      breadcrumbs={[
        { name: "Accueil", href: "/" },
        { name: "Catégories", href: "/categories" },
      ]}
      hrefFor={(slug) => `/jobs/category/${slug}`}
      items={categories}
      emptyDescription="Aucune catégorie avec des offres publiées pour le moment."
    />
  );
}
