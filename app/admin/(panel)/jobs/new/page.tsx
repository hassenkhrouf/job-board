import { getJobFormOptions } from "@/lib/admin/get-job-form-options";
import type { FormSelectOption } from "@/lib/admin/get-job-form-options";
import { emptyJobFormState } from "@/lib/admin/job-form-schema";
import type { JobFormState } from "@/lib/admin/job-form-schema";
import { JobForm } from "@/components/admin/JobForm";
import { createJob } from "@/lib/admin/actions";
import { readImportDraft } from "@/lib/imports/draft";
import type { ImportedJob } from "@/lib/ai/types";
import {
  clampText,
  deadlineToDateInput,
  normalizeEmploymentType,
} from "@/lib/imports/shared";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/button";

type NewJobPageProps = {
  searchParams: Promise<{ imported?: string }>;
};

/** Match an extracted free-text name against the select options (case-insensitive). */
function matchOption(options: FormSelectOption[], name: string | null): string {
  if (!name) {
    return "";
  }
  const wanted = name.trim().toLowerCase();
  return options.find((option) => option.name.toLowerCase() === wanted)?.id ?? "";
}

function initialStateFromDraft(
  job: ImportedJob,
  sourceUrl: string,
  options: Awaited<ReturnType<typeof getJobFormOptions>>,
): JobFormState {
  return {
    errors: {},
    values: {
      title: clampText(job.title ?? "", 200),
      companyId: matchOption(options.companies, job.company),
      categoryId: matchOption(options.categories, job.category),
      locationId: matchOption(options.locations, job.location),
      description: clampText(job.description ?? "", 10000),
      excerpt: "",
      applicationUrl: job.applicationUrl ?? "",
      employmentType: normalizeEmploymentType(job.employmentType),
      status: "DRAFT",
      featured: job.featured ? "on" : "",
      deadline: deadlineToDateInput(job.deadline),
      sourceUrl,
    },
  };
}

export default async function NewJobPage({ searchParams }: NewJobPageProps) {
  const { imported } = await searchParams;
  const options = await getJobFormOptions();

  const hasForeignKeyData =
    options.companies.length > 0 &&
    options.categories.length > 0 &&
    options.locations.length > 0;

  const draft = imported ? await readImportDraft() : null;
  const initialState = draft
    ? initialStateFromDraft(draft.job, draft.sourceUrl, options)
    : emptyJobFormState;

  return (
    <Container>
      <div className="mx-auto flex max-w-3xl flex-col gap-6 py-10">
        <div>
          <ButtonLink href="/admin/jobs" variant="ghost" size="sm">
            ← Offres
          </ButtonLink>
        </div>

        <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
          Nouvelle offre
        </h1>

        {draft ? (
          <p
            role="status"
            className="rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-900"
          >
            Offre importée depuis{" "}
            <a
              href={draft.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-2"
            >
              {draft.sourceUrl}
            </a>
            . Vérifiez les champs, complétez les informations manquantes puis
            publiez.
          </p>
        ) : null}

        {hasForeignKeyData ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <JobForm
              action={createJob}
              options={options}
              initialState={initialState}
              submitLabel="Créer l'offre"
            />
          </div>
        ) : (
          <div className="rounded-xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600 shadow-sm">
            Impossible de créer une offre : entreprise, catégorie ou
            localisation manquante. Ajoutez-les d&apos;abord depuis le menu «
            Entreprises », « Catégories » ou « Lieux ».
          </div>
        )}
      </div>
    </Container>
  );
}
