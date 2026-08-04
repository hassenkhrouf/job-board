import { notFound } from "next/navigation";
import { getJobForAdminById } from "@/lib/admin/get-job-by-id";
import { getJobFormOptions } from "@/lib/admin/get-job-form-options";
import {
  toDateInputValue,
  type JobFormState,
} from "@/lib/admin/job-form-schema";
import { updateJob } from "@/lib/admin/actions";
import { JobForm } from "@/components/admin/JobForm";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/button";

type EditJobPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditJobPage({ params }: EditJobPageProps) {
  const { id } = await params;

  const [job, options] = await Promise.all([
    getJobForAdminById(id),
    getJobFormOptions(),
  ]);

  if (!job) {
    notFound();
  }

  const hasForeignKeyData =
    options.companies.length > 0 &&
    options.categories.length > 0 &&
    options.locations.length > 0;

  const initialState: JobFormState = {
    errors: {},
    values: {
      title: job.title,
      companyId: job.companyId,
      categoryId: job.categoryId,
      locationId: job.locationId,
      description: job.description,
      excerpt: job.excerpt ?? "",
      applicationUrl: job.applicationUrl,
      employmentType: job.employmentType,
      status: job.status,
      featured: job.featured ? "on" : "",
      deadline: toDateInputValue(job.deadline),
      sourceUrl: job.sourceUrl ?? "",
    },
  };

  return (
    <Container>
      <div className="mx-auto flex max-w-3xl flex-col gap-6 py-10">
        <div>
          <ButtonLink href="/admin/jobs" variant="ghost" size="sm">
            ← Offres
          </ButtonLink>
        </div>

        <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
          Modifier l&apos;offre
        </h1>

        {hasForeignKeyData ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <JobForm
              action={updateJob.bind(null, job.id)}
              options={options}
              initialState={initialState}
              submitLabel="Enregistrer"
            />
          </div>
        ) : (
          <div className="rounded-xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600 shadow-sm">
            Impossible de modifier l&apos;offre : entreprise, catégorie ou
            localisation manquante.
          </div>
        )}
      </div>
    </Container>
  );
}
