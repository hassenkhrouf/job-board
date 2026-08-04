import {
  referenceConfig,
  type ReferenceEntity,
  type ReferenceRow,
} from "@/lib/admin/references";
import {
  createReference,
  updateReference,
} from "@/lib/admin/reference-actions";
import {
  emptyReferenceFormState,
  type ReferenceFormState,
} from "@/lib/admin/reference-form-schema";
import { ReferenceForm } from "@/components/admin/ReferenceForm";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/button";

export async function ReferenceFormPage({
  entity,
  existing,
  submitLabel,
}: {
  entity: ReferenceEntity;
  existing?: ReferenceRow;
  submitLabel: string;
}) {
  const config = referenceConfig[entity];

  const initialState: ReferenceFormState = existing
    ? {
        errors: {},
        values: {
          name: existing.name,
          website: existing.website ?? "",
          description: existing.description ?? "",
        },
      }
    : emptyReferenceFormState;

  return (
    <Container>
      <div className="mx-auto flex max-w-2xl flex-col gap-6 py-10">
        <div>
          <ButtonLink href={config.listPath} variant="ghost" size="sm">
            ← {config.labelPlural}
          </ButtonLink>
        </div>

        <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
          {existing ? config.editHeading : config.newHeading}
        </h1>

        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <ReferenceForm
            label={config.label}
            nameHint={config.nameHint}
            hasWebsite={config.hasWebsite}
            hasDescription={config.hasDescription}
            action={
              existing
                ? updateReference.bind(null, entity, existing.id)
                : createReference.bind(null, entity)
            }
            initialState={initialState}
            submitLabel={submitLabel}
          />
        </div>
      </div>
    </Container>
  );
}
