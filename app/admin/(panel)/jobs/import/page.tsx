import { JobImportForm } from "@/components/admin/JobImportForm";
import { importJobFromUrl } from "@/lib/admin/actions";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/button";

export default function ImportJobPage() {
  return (
    <Container>
      <div className="mx-auto flex max-w-3xl flex-col gap-6 py-10">
        <div>
          <ButtonLink href="/admin/jobs" variant="ghost" size="sm">
            ← Offres
          </ButtonLink>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
            Importer une offre
          </h1>
          <p className="text-sm text-neutral-600">
            Collez l&apos;URL d&apos;une annonce. La page est analysée
            automatiquement, puis l&apos;offre s&apos;affiche pré-remplie pour
            vérification avant publication.
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <JobImportForm action={importJobFromUrl} />
        </div>
      </div>
    </Container>
  );
}
