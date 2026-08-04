import type { Metadata } from "next";
import { EntityHub } from "@/components/jobs/EntityHub";
import { getLocationHub } from "@/lib/jobs/get-location-hub";

export const metadata: Metadata = {
  title: "Lieux — Job Board",
  description:
    "Parcourez les offres d'emploi par ville ou région : Tunis, Sfax, Sousse, Gabès, et opportunités à distance.",
};

export const revalidate = 300;

export default async function LocationsPage() {
  const locations = await getLocationHub();

  return (
    <EntityHub
      title="Tous les lieux"
      description="Parcourez les offres publiées par ville, région ou à distance."
      breadcrumbs={[
        { name: "Accueil", href: "/" },
        { name: "Lieux", href: "/locations" },
      ]}
      hrefFor={(slug) => `/jobs/location/${slug}`}
      items={locations}
      emptyDescription="Aucun lieu avec des offres publiées pour le moment."
    />
  );
}
