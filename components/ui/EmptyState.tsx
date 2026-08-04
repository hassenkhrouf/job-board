import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export function EmptyState({ title, description, children }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 text-center">
      <svg
        className="mx-auto h-10 w-10 text-neutral-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 7h-4.5a2.5 2.5 0 0 1-2.5-2.5V2" />
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
        <path d="M9 12h6" />
        <path d="M12 9v6" />
      </svg>
      <h3 className="mt-4 text-base font-semibold text-neutral-900">{title}</h3>
      {description ? (
        <p className="mx-auto mt-1 max-w-md text-sm text-neutral-600">
          {description}
        </p>
      ) : null}
      {children ? (
        <div className="mt-5 flex justify-center gap-3">{children}</div>
      ) : null}
    </div>
  );
}
