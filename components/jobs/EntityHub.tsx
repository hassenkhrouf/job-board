import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import type { EntityWithCount } from "@/lib/jobs/get-entities-with-counts";
import type { BreadcrumbItem } from "@/lib/seo/breadcrumb-json-ld";

type EntityHubProps = {
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
  hrefFor: (slug: string) => string;
  items: EntityWithCount[];
  emptyDescription: string;
};

export function EntityHub({
  title,
  description,
  breadcrumbs,
  hrefFor,
  items,
  emptyDescription,
}: EntityHubProps) {
  return (
    <main>
      <div className="border-b border-neutral-200 bg-white py-8 sm:py-10">
        <Container>
          <div className="mb-4">
            <Breadcrumbs items={breadcrumbs} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-base text-neutral-600">
            {description}
          </p>
        </Container>
      </div>

      <div className="py-10 sm:py-12">
        <Container>
          {items.length > 0 ? (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={hrefFor(item.slug)}
                    className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3.5 shadow-sm transition-colors hover:border-brand-300 hover:bg-brand-50/40"
                  >
                    <span className="text-sm font-medium text-neutral-800">
                      {item.name}
                    </span>
                    <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
                      {item.count} offre{item.count > 1 ? "s" : ""}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="Aucun contenu publié"
              description={emptyDescription}
            />
          )}
        </Container>
      </div>
    </main>
  );
}
