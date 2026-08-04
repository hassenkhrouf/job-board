import { Container } from "@/components/ui/Container";

export function AdPlaceholder() {
  return (
    <aside className="py-6" aria-label="Espace publicitaire">
      <Container>
        <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-10 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
            Publicité
          </p>
        </div>
      </Container>
    </aside>
  );
}
