import { deleteReference } from "@/lib/admin/reference-actions";
import {
  referenceConfig,
  type ReferenceEntity,
  type ReferenceRow,
} from "@/lib/admin/references";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/button";

export async function ReferenceDeletePage({
  entity,
  row,
}: {
  entity: ReferenceEntity;
  row: ReferenceRow;
}) {
  const config = referenceConfig[entity];
  const blocked = row.jobCount > 0;

  return (
    <Container>
      <div className="mx-auto flex max-w-xl flex-col gap-6 py-10">
        <div>
          <ButtonLink href={config.listPath} variant="ghost" size="sm">
            ← {config.labelPlural}
          </ButtonLink>
        </div>

        <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
          {config.deleteHeading}
        </h1>

        {blocked ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <p role="alert" className="text-sm text-neutral-700">
              Impossible de supprimer «&nbsp;{row.name}&nbsp;» : il est
              référencé par <Badge variant="brand">{row.jobCount}</Badge> offre
              {row.jobCount > 1 ? "s" : ""}. Modifiez ou supprimez ces offres
              d&apos;abord.
            </p>
            <div className="mt-5">
              <ButtonLink href={config.listPath} variant="secondary">
                Retour
              </ButtonLink>
            </div>
          </div>
        ) : (
          <form
            action={deleteReference.bind(null, entity, row.id)}
            className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-neutral-700">
              Voulez-vous vraiment supprimer «&nbsp;{row.name}&nbsp;»&nbsp;?
              Cette action est irréversible.
            </p>
            <div className="mt-5 flex gap-3">
              <ButtonLink href={config.listPath} variant="secondary">
                Annuler
              </ButtonLink>
              <Button type="submit" variant="danger">
                Supprimer
              </Button>
            </div>
          </form>
        )}
      </div>
    </Container>
  );
}
