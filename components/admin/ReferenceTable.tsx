import Link from "next/link";
import type { ReferenceEntity, ReferenceRow } from "@/lib/admin/references";
import { referenceConfig } from "@/lib/admin/references";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/button";

type ReferenceTableProps = {
  entity: ReferenceEntity;
  rows: ReferenceRow[];
};

export function ReferenceTable({ entity, rows }: ReferenceTableProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
        <EmptyState
          title={`Aucune ${referenceConfig[entity].label.toLowerCase()}`}
          description="Créez votre première entrée pour pouvoir la sélectionner dans les offres."
        >
          <ButtonLink href={referenceConfig[entity].newPath} size="sm">
            Créer une {referenceConfig[entity].label.toLowerCase()}
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
              Nom
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Slug
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Offres
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {rows.map((row) => (
            <tr key={row.id} className="align-top text-neutral-800">
              <td className="px-4 py-3 font-medium text-neutral-900">
                <Link
                  href={referenceConfig[entity].editPath(row.id)}
                  className="hover:underline"
                >
                  {row.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-neutral-600">{row.slug}</td>
              <td className="px-4 py-3">
                <Badge variant={row.jobCount > 0 ? "brand" : "neutral"}>
                  {row.jobCount}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-3">
                  <Link
                    href={referenceConfig[entity].editPath(row.id)}
                    className="text-neutral-700 underline-offset-2 hover:underline"
                  >
                    Modifier
                  </Link>
                  <Link
                    href={referenceConfig[entity].deletePath(row.id)}
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
