import type { Metadata } from "next";
import { buildJobSearchPath } from "@/lib/jobs/search-params";

type ListingSeoInput = {
  basePath: string;
  q?: string;
  categoryName?: string;
  locationName?: string;
  categorySlug?: string;
  locationSlug?: string;
  page?: number;
};

function buildListingCopy(input: ListingSeoInput): {
  heading: string;
  description: string;
} {
  const { q, categoryName, locationName } = input;

  if (q && locationName && categoryName) {
    return {
      heading: `Offres « ${q} » — ${categoryName} à ${locationName}`,
      description: `Résultats pour « ${q} » dans ${categoryName} à ${locationName}.`,
    };
  }

  if (q && locationName) {
    return {
      heading: `Offres « ${q} » à ${locationName}`,
      description: `Résultats pour « ${q} » à ${locationName}.`,
    };
  }

  if (q && categoryName) {
    return {
      heading: `Offres « ${q} » — ${categoryName}`,
      description: `Résultats pour « ${q} » dans la catégorie ${categoryName}.`,
    };
  }

  if (q) {
    return {
      heading: `Offres pour « ${q} »`,
      description: `Résultats de recherche pour « ${q} ».`,
    };
  }

  if (categoryName && locationName) {
    return {
      heading: `Emploi ${categoryName} à ${locationName}`,
      description: `Offres d'emploi en ${categoryName} à ${locationName}.`,
    };
  }

  if (categoryName) {
    return {
      heading: `Emploi ${categoryName}`,
      description: `Offres d'emploi publiées dans la catégorie ${categoryName}.`,
    };
  }

  if (locationName) {
    return {
      heading: `Emploi à ${locationName}`,
      description: `Offres d'emploi publiées à ${locationName}.`,
    };
  }

  return {
    heading: "Offres d'emploi",
    description:
      "Parcourez les annonces publiées et affinez votre recherche par mot-clé, catégorie ou lieu.",
  };
}

export function buildJobsListingHeading(input: ListingSeoInput) {
  const { heading, description } = buildListingCopy(input);
  return { title: heading, description };
}

export function buildJobsListingSeo(input: ListingSeoInput): Metadata {
  const page = input.page ?? 1;
  const { heading, description } = buildListingCopy(input);
  const title =
    page > 1
      ? `${heading} — page ${page} | Job Board`
      : `${heading} | Job Board`;

  const canonical = buildJobSearchPath(input.basePath, {
    q: input.q,
    category: input.categorySlug,
    location: input.locationSlug,
    page,
  });

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots: input.q
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      locale: "fr_TN",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
