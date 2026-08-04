import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/seo/breadcrumb-json-ld";

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Fil d'Ariane" className="text-sm text-neutral-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={`${item.href}-${index}`}
              className="flex items-center gap-1.5"
            >
              {index > 0 ? (
                <span aria-hidden="true" className="text-neutral-300">
                  /
                </span>
              ) : null}
              {isLast ? (
                <span
                  aria-current="page"
                  className="font-medium text-neutral-800"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-brand-700 hover:underline"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
