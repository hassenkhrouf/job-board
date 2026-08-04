import Link from "next/link";
import type { AdminJobRow } from "@/lib/admin/get-jobs";
import { jobStatusLabels } from "@/lib/admin/constants";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/button";

type AdminJobsTableProps = {
  jobs: AdminJobRow[];
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

const statusVariant: Record<
  AdminJobRow["status"],
  "neutral" | "success" | "warning"
> = {
  DRAFT: "neutral",
  PUBLISHED: "success",
  CLOSED: "warning",
};

export function AdminJobsTable({ jobs }: AdminJobsTableProps) {
  if (jobs.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
        <EmptyState
          title="Aucune offre"
          description="Créez votre première offre d'emploi, de concours ou de carrière."
        >
          <ButtonLink href="/admin/jobs/new" size="sm">
            Créer une offre
          </ButtonLink>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-700">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              Titre
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Entreprise
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Catégorie
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Statut
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Créé le
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {jobs.map((job) => (
            <tr key={job.id} className="align-top text-neutral-800">
              <td className="px-4 py-3 font-medium text-neutral-900">
                <Link
                  href={`/admin/jobs/${job.id}/edit`}
                  className="hover:underline"
                >
                  {job.title}
                </Link>
              </td>
              <td className="px-4 py-3 text-neutral-700">{job.company.name}</td>
              <td className="px-4 py-3 text-neutral-700">
                {job.category.name}
              </td>
              <td className="px-4 py-3">
                <Badge variant={statusVariant[job.status]}>
                  {jobStatusLabels[job.status]}
                </Badge>
              </td>
              <td className="px-4 py-3 text-neutral-600">
                <time dateTime={job.createdAt.toISOString()}>
                  {formatDate(job.createdAt)}
                </time>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-3">
                  <Link
                    href={`/admin/jobs/${job.id}/edit`}
                    className="text-neutral-700 underline-offset-2 hover:underline"
                  >
                    Modifier
                  </Link>
                  <Link
                    href={`/admin/jobs/${job.id}/delete`}
                    className="text-red-600 underline-offset-2 hover:underline"
                  >
                    Supprimer
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
