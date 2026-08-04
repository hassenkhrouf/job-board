import Link from "next/link";
import { buildJobSearchPath } from "@/lib/jobs/search-params";

export type JobsPaginationProps = {
  currentPage: number;
  totalPages: number;
  /** Query params to preserve across pages (q, category, location, …). */
  params?: Record<string, string | undefined>;
  basePath?: string;
};

function buildPageNumbers(current: number, total: number): Array<number | "…"> {
  const pages = new Set<number>([
    1,
    2,
    total - 1,
    total,
    current - 1,
    current,
    current + 1,
  ]);
  const sorted = [...pages]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);

  const result: Array<number | "…"> = [];
  let previous = 0;
  for (const page of sorted) {
    if (page - previous > 1) {
      result.push("…");
    }
    result.push(page);
    previous = page;
  }
  return result;
}

export function JobsPagination({
  currentPage,
  totalPages,
  params = {},
  basePath = "/jobs",
}: JobsPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const search = {
    q: params.q,
    category: params.category,
    location: params.location,
  };

  const linkClass =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition-colors";
  const pageLinkClass = `${linkClass} border border-neutral-300 bg-white text-neutral-800 hover:border-brand-400 hover:text-brand-700`;
  const currentClass = `${linkClass} bg-brand-600 text-white`;
  const disabledClass = `${linkClass} text-neutral-400`;

  return (
    <nav
      aria-label="Pagination des offres"
      className="mt-10 flex flex-col items-center gap-4 border-t border-neutral-200 pt-6"
    >
      <ul className="flex flex-wrap items-center justify-center gap-1.5">
        {currentPage > 1 ? (
          <li>
            <Link
              href={buildJobSearchPath(basePath, {
                ...search,
                page: currentPage - 1,
              })}
              className={pageLinkClass}
              rel="prev"
            >
              Précédent
            </Link>
          </li>
        ) : (
          <li>
            <span className={disabledClass} aria-disabled="true">
              Précédent
            </span>
          </li>
        )}

        {buildPageNumbers(currentPage, totalPages).map((page, index) =>
          page === "…" ? (
            <li key={`ellipsis-${index}`}>
              <span className={disabledClass} aria-hidden="true">
                …
              </span>
            </li>
          ) : page === currentPage ? (
            <li key={page}>
              <span className={currentClass} aria-current="page">
                {page}
              </span>
            </li>
          ) : (
            <li key={page}>
              <Link
                href={buildJobSearchPath(basePath, { ...search, page })}
                className={pageLinkClass}
              >
                {page}
              </Link>
            </li>
          ),
        )}

        {currentPage < totalPages ? (
          <li>
            <Link
              href={buildJobSearchPath(basePath, {
                ...search,
                page: currentPage + 1,
              })}
              className={pageLinkClass}
              rel="next"
            >
              Suivant
            </Link>
          </li>
        ) : (
          <li>
            <span className={disabledClass} aria-disabled="true">
              Suivant
            </span>
          </li>
        )}
      </ul>
      <p className="text-sm text-neutral-600">
        Page <span className="font-medium text-neutral-900">{currentPage}</span>{" "}
        sur <span className="font-medium text-neutral-900">{totalPages}</span>
      </p>
    </nav>
  );
}
