import Link from "next/link";
import { Section } from "@/components/ui/Section";
import type { EntityWithCount } from "@/lib/jobs/get-entities-with-counts";

type EntityGridSectionProps = {
  id: string;
  title: string;
  description: string;
  emptyDescription: string;
  hrefFor: (slug: string) => string;
  items: EntityWithCount[];
};

export function EntityGridSection({
  id,
  title,
  description,
  emptyDescription,
  hrefFor,
  items,
}: EntityGridSectionProps) {
  if (items.length === 0) {
    return (
      <Section id={id} title={title} description={description}>
        <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-10 text-center">
          <p className="text-sm text-neutral-600">{emptyDescription}</p>
        </div>
      </Section>
    );
  }

  return (
    <Section id={id} title={title} description={description}>
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
    </Section>
  );
}
