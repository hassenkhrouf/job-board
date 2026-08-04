"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";

export default function PublicError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex flex-1 items-center justify-center bg-white py-20">
      <Container className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
          Erreur
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
          Une erreur est survenue
        </h1>
        <p className="mx-auto mt-3 max-w-md text-base text-neutral-600">
          Un problème inattendu a empêché le chargement de cette page. Veuillez
          réessayer.
        </p>
        <div className="mt-8">
          <Button type="button" onClick={reset}>
            Réessayer
          </Button>
        </div>
      </Container>
    </main>
  );
}
