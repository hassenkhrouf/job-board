import type { SearchFilterOption } from "@/lib/jobs/get-search-filter-options";

type SearchBarProps = {
  action?: string;
  showCategory?: boolean;
  showLocation?: boolean;
  categories?: SearchFilterOption[];
  locations?: SearchFilterOption[];
  defaultValues?: {
    q?: string;
    category?: string;
    location?: string;
  };
};

const inputClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-base text-neutral-900 placeholder:text-neutral-400 focus:border-brand-500";

export function SearchBar({
  action = "/jobs",
  showCategory = true,
  showLocation = true,
  categories = [],
  locations = [],
  defaultValues = {},
}: SearchBarProps) {
  return (
    <form
      action={action}
      method="GET"
      role="search"
      aria-label="Rechercher des offres"
      className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end"
    >
      <div className="flex-1">
        <label
          htmlFor="search-q"
          className="mb-1 block text-sm font-medium text-neutral-700"
        >
          Mot-clé
        </label>
        <input
          id="search-q"
          type="search"
          name="q"
          defaultValue={defaultValues.q ?? ""}
          placeholder="Poste, entreprise…"
          className={inputClass}
        />
      </div>

      {showCategory ? (
        <div className="sm:w-48">
          <label
            htmlFor="search-category"
            className="mb-1 block text-sm font-medium text-neutral-700"
          >
            Catégorie
          </label>
          <select
            id="search-category"
            name="category"
            className={inputClass}
            defaultValue={defaultValues.category ?? ""}
          >
            <option value="">Toutes</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {showLocation ? (
        <div className="sm:w-48">
          <label
            htmlFor="search-location"
            className="mb-1 block text-sm font-medium text-neutral-700"
          >
            Lieu
          </label>
          <select
            id="search-location"
            name="location"
            className={inputClass}
            defaultValue={defaultValues.location ?? ""}
          >
            <option value="">Tous</option>
            {locations.map((location) => (
              <option key={location.slug} value={location.slug}>
                {location.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-base font-medium text-white transition-colors hover:bg-brand-700"
        aria-label="Lancer la recherche"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        Rechercher
      </button>
    </form>
  );
}
