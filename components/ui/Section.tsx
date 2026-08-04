import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

type SectionProps = {
  id?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Section({
  id,
  title,
  description,
  action,
  children,
  className = "",
}: SectionProps) {
  const headingId = id ? `${id}-heading` : undefined;

  return (
    <section
      id={id}
      className={`py-10 sm:py-14 ${className}`}
      aria-labelledby={headingId}
    >
      <Container>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2
              id={headingId}
              className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl"
            >
              {title}
            </h2>
            {description ? (
              <p className="mt-2 max-w-2xl text-sm text-neutral-600 sm:text-base">
                {description}
              </p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
        {children}
      </Container>
    </section>
  );
}
