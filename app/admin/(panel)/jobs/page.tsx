import { getJobsForAdmin } from "@/lib/admin/get-jobs";
import { AdminJobsTable } from "@/components/admin/AdminJobsTable";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/button";

const successMessage = (code: string | undefined): string | null => {
  switch (code) {
    case "created":
      return "Offre créée.";
    case "updated":
      return "Offre mise à jour.";
    case "deleted":
      return "Offre supprimée.";
    default:
      return null;
  }
};

type AdminJobsPageProps = {
  searchParams: Promise<{
    created?: string;
    updated?: string;
    deleted?: string;
  }>;
};

export default async function AdminJobsPage({
  searchParams,
}: AdminJobsPageProps) {
  const { created, updated, deleted } = await searchParams;
  const success = successMessage(created ?? updated ?? deleted);
  const { jobs } = await getJobsForAdmin();

  return (
    <Container>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
            Offres
          </h1>
          <div className="flex items-center gap-3">
            <ButtonLink href="/admin/jobs/import" variant="secondary">
              Importer une offre
            </ButtonLink>
            <ButtonLink href="/admin/jobs/new">Créer une offre</ButtonLink>
          </div>
        </div>

        {success ? (
          <p
            role="status"
            className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800"
          >
            {success}
          </p>
        ) : null}

        <AdminJobsTable jobs={jobs} />
      </div>
    </Container>
  );
}
