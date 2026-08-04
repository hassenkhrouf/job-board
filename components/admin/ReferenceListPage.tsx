import {
  getReferences,
  referenceConfig,
  type ReferenceEntity,
} from "@/lib/admin/references";
import { ReferenceTable } from "@/components/admin/ReferenceTable";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/button";

type ReferenceListSearchParams = {
  created?: string;
  updated?: string;
  deleted?: string;
  error?: string;
};

function successMessage(
  searchParams: ReferenceListSearchParams,
  label: string,
): string | null {
  if (searchParams.created) {
    return `${label} créée.`;
  }
  if (searchParams.updated) {
    return `${label} mise à jour.`;
  }
  if (searchParams.deleted) {
    return `${label} supprimée.`;
  }
  return null;
}

export async function ReferenceListPage({
  entity,
  searchParams,
}: {
  entity: ReferenceEntity;
  searchParams: ReferenceListSearchParams;
}) {
  const rows = await getReferences(entity);
  const config = referenceConfig[entity];
  const success = successMessage(searchParams, config.label);
  const inUse =
    searchParams.error === "in-use"
      ? `Impossible de supprimer : cette ${config.label.toLowerCase()} est utilisée par une ou plusieurs offres.`
      : null;

  return (
    <Container>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
            {config.labelPlural}
          </h1>
          <ButtonLink href={config.newPath}>
            Créer une {config.label.toLowerCase()}
          </ButtonLink>
        </div>

        {success ? (
          <p
            role="status"
            className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800"
          >
            {success}
          </p>
        ) : null}

        {inUse ? (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {inUse}
          </p>
        ) : null}

        <ReferenceTable entity={entity} rows={rows} />
      </div>
    </Container>
  );
}
