import { notFound } from "next/navigation";
import Link from "next/link";
import { getJobForAdminById } from "@/lib/admin/get-job-by-id";
import { deleteJob } from "@/lib/admin/actions";
import { Container } from "@/components/ui/Container";

type DeleteJobPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DeleteJobPage({ params }: DeleteJobPageProps) {
  const { id } = await params;
  const job = await getJobForAdminById(id);

  if (!job) {
    notFound();
  }

  return (
    <Container>
      <div className="mx-auto flex max-w-md flex-col gap-6 py-10">
        <nav className="text-sm">
          <Link
            href="/admin/jobs"
            className="text-neutral-700 underline-offset-2 hover:underline"
          >
            ← Offres
          </Link>
        </nav>

        <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
          Supprimer l&apos;offre
        </h1>

        <p className="text-sm text-neutral-700">
          Confirmer la suppression de «&nbsp;{job.title}&nbsp;» ? Cette action
          est irréversible.
        </p>

        <form action={deleteJob.bind(null, job.id)} className="flex gap-3">
          <button
            type="submit"
            className="border border-neutral-900 bg-neutral-900 px-5 py-2.5 text-base font-medium text-white"
          >
            Supprimer
          </button>
          <Link
            href="/admin/jobs"
            className="border border-neutral-300 bg-white px-5 py-2.5 text-base font-medium text-neutral-800"
          >
            Annuler
          </Link>
        </form>
      </div>
    </Container>
  );
}
