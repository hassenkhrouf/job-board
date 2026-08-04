import Link from "next/link";
import { Container } from "@/components/ui/Container";

const navItems = [
  { href: "/jobs", label: "Offres" },
  { href: "/categories", label: "Catégories" },
  { href: "/locations", label: "Lieux" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <Container className="flex items-center justify-between gap-4 py-3.5">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label="Job Board — accueil"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              <path d="M2 13h20" />
            </svg>
          </span>
          <span className="text-lg font-semibold tracking-tight text-neutral-900">
            Job&nbsp;Board
          </span>
        </Link>

        <nav aria-label="Navigation principale">
          <ul className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
