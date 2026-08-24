import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getCategoryHub } from "@/lib/jobs/get-category-hub";
import { getLocationHub } from "@/lib/jobs/get-location-hub";

export async function Footer() {
  const year = new Date().getFullYear();
  const [categories, locations] = await Promise.all([
    getCategoryHub(),
    getLocationHub(),
  ]);

  return (
    <footer className="mt-auto border-t border-neutral-200 bg-neutral-50">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-sm font-semibold tracking-tight text-neutral-900">
            JobBoard
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-neutral-600">
            La première plateforme d&apos;emploi dédiée aux professionnels en Afrique. Découvrez des opportunités de carrière dans divers secteurs.
          </p>
        </div>

        <nav aria-label="Navigation du pied de page">
          <p className="text-sm font-semibold text-neutral-900">Explorer</p>
          <ul className="mt-3 flex flex-col gap-2">
            <li>
              <Link
                href="/jobs"
                className="text-sm text-neutral-600 hover:text-brand-700"
              >
                Toutes les offres
              </Link>
            </li>
            <li>
              <Link
                href="/categories"
                className="text-sm text-neutral-600 hover:text-brand-700"
              >
                Catégories
              </Link>
            </li>
            <li>
              <Link
                href="/locations"
                className="text-sm text-neutral-600 hover:text-brand-700"
              >
                Lieux
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Catégories populaires">
          <p className="text-sm font-semibold text-neutral-900">
            Catégories populaires
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {categories.slice(0, 6).map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/jobs/category/${category.slug}`}
                  className="text-sm text-neutral-600 hover:text-brand-700"
                >
                  {category.name}
                </Link>
              </li>
            ))}
            {categories.length === 0 ? (
              <li className="text-sm text-neutral-400">
                Aucune catégorie publiée
              </li>
            ) : null}
          </ul>
        </nav>

        <nav aria-label="Lieux populaires">
          <p className="text-sm font-semibold text-neutral-900">
            Lieux populaires
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {locations.slice(0, 6).map((location) => (
              <li key={location.slug}>
                <Link
                  href={`/jobs/location/${location.slug}`}
                  className="text-sm text-neutral-600 hover:text-brand-700"
                >
                  {location.name}
                </Link>
              </li>
            ))}
            {locations.length === 0 ? (
              <li className="text-sm text-neutral-400">Aucun lieu publié</li>
            ) : null}
          </ul>
        </nav>
      </Container>

      <div className="border-t border-neutral-200">
        <Container className="flex flex-col items-start justify-between gap-2 py-4 sm:flex-row sm:items-center">
          <p className="text-xs text-neutral-500">
            © {year} Job Board. Tous droits réservés.
          </p>
          <Link
            href="/admin/login"
            className="text-xs text-neutral-500 hover:text-neutral-800"
          >
            Espace administrateur
          </Link>
        </Container>
      </div>
    </footer>
  );
}
