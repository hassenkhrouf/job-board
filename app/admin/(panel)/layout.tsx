import type { ReactNode } from "react";
import Link from "next/link";
import { logoutAdmin } from "@/lib/admin/actions";
import { Container } from "@/components/ui/Container";

type AdminPanelLayoutProps = {
  children: ReactNode;
};

const navLinks = [
  { href: "/admin/jobs", label: "Offres" },
  { href: "/admin/companies", label: "Entreprises" },
  { href: "/admin/categories", label: "Catégories" },
  { href: "/admin/locations", label: "Lieux" },
];

export default function AdminPanelLayout({ children }: AdminPanelLayoutProps) {
  return (
    <div className="flex min-h-full flex-col bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <Container className="flex flex-col gap-3 py-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-neutral-900">
              Administration
            </p>
            <form action={logoutAdmin}>
              <button
                type="submit"
                className="text-sm text-neutral-700 hover:text-neutral-900"
                aria-label="Se déconnecter de l'administration"
              >
                Déconnexion
              </button>
            </form>
          </div>
          <nav
            aria-label="Menu de l'administration"
            className="flex flex-wrap gap-x-5 gap-y-1 border-t border-neutral-100 pt-3"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-neutral-700 underline-offset-4 hover:text-neutral-900 hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </Container>
      </header>
      <div className="flex-1 py-10">{children}</div>
    </div>
  );
}
