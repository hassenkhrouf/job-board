import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center bg-white py-20">
      <Container className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
          Page introuvable
        </h1>
        <p className="mx-auto mt-3 max-w-md text-base text-neutral-600">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/jobs">Parcourir les offres</ButtonLink>
          <ButtonLink href="/" variant="secondary">
            Retour à l&apos;accueil
          </ButtonLink>
        </div>
      </Container>
    </main>
  );
}
