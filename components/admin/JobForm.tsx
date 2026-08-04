"use client";

import { useActionState } from "react";
import type { FormSelectOption } from "@/lib/admin/get-job-form-options";
import type { JobFormState } from "@/lib/admin/job-form-schema";
import { employmentTypeLabels } from "@/lib/jobs/types";
import { jobStatusLabels } from "@/lib/admin/constants";
import { Button } from "@/components/ui/button";

type JobFormProps = {
  action: (
    prevState: JobFormState,
    formData: FormData,
  ) => Promise<JobFormState>;
  options: {
    companies: FormSelectOption[];
    categories: FormSelectOption[];
    locations: FormSelectOption[];
  };
  initialState: JobFormState;
  submitLabel: string;
};

const inputClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-base text-neutral-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30";

const inputErrorClass =
  "border-red-400 focus:border-red-500 focus:ring-red-500/30";

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) {
    return null;
  }
  return (
    <p id={id} className="mt-1 text-sm text-red-600">
      {error}
    </p>
  );
}

function SelectField({
  id,
  name,
  label,
  options,
  error,
  defaultValue,
  className,
}: {
  id: string;
  name: string;
  label: string;
  options: FormSelectOption[];
  error?: string;
  defaultValue?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-neutral-700"
      >
        {label}
      </label>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputClass} ${error ? inputErrorClass : ""}`}
      >
        <option value="">— Choisir —</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      <FieldError id={`${id}-error`} error={error} />
    </div>
  );
}

export function JobForm({
  action,
  options,
  initialState,
  submitLabel,
}: JobFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const { errors, values } = state;
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      {hasErrors ? (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          Certains champs sont invalides. Veuillez les corriger.
        </p>
      ) : null}

      <input type="hidden" name="sourceUrl" defaultValue={values.sourceUrl} />

      <div>
        <label
          htmlFor="title"
          className="mb-1 block text-sm font-medium text-neutral-700"
        >
          Titre
        </label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={values.title}
          maxLength={200}
          required
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={errors.title ? "title-error" : undefined}
          className={`${inputClass} ${errors.title ? inputErrorClass : ""}`}
        />
        <FieldError id="title-error" error={errors.title} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          id="companyId"
          name="companyId"
          label="Entreprise"
          options={options.companies}
          error={errors.companyId}
          defaultValue={values.companyId}
        />
        <SelectField
          id="categoryId"
          name="categoryId"
          label="Catégorie"
          options={options.categories}
          error={errors.categoryId}
          defaultValue={values.categoryId}
        />
      </div>

      <div>
        <SelectField
          id="locationId"
          name="locationId"
          label="Localisation"
          options={options.locations}
          error={errors.locationId}
          defaultValue={values.locationId}
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-1 block text-sm font-medium text-neutral-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={10}
          defaultValue={values.description}
          aria-invalid={errors.description ? true : undefined}
          aria-describedby={
            errors.description ? "description-error" : undefined
          }
          className={`${inputClass} resize-y ${
            errors.description ? inputErrorClass : ""
          }`}
        />
        <FieldError id="description-error" error={errors.description} />
      </div>

      <div>
        <label
          htmlFor="excerpt"
          className="mb-1 block text-sm font-medium text-neutral-700"
        >
          Extrait (optionnel)
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          maxLength={300}
          placeholder="Résumé court affiché dans les listes (300 caractères max)."
          defaultValue={values.excerpt}
          aria-invalid={errors.excerpt ? true : undefined}
          aria-describedby={errors.excerpt ? "excerpt-error" : undefined}
          className={`${inputClass} resize-y ${
            errors.excerpt ? inputErrorClass : ""
          }`}
        />
        <FieldError id="excerpt-error" error={errors.excerpt} />
      </div>

      <div>
        <label
          htmlFor="applicationUrl"
          className="mb-1 block text-sm font-medium text-neutral-700"
        >
          URL de candidature
        </label>
        <input
          id="applicationUrl"
          name="applicationUrl"
          type="url"
          inputMode="url"
          placeholder="https://"
          defaultValue={values.applicationUrl}
          aria-invalid={errors.applicationUrl ? true : undefined}
          aria-describedby={
            errors.applicationUrl ? "applicationUrl-error" : undefined
          }
          className={`${inputClass} ${
            errors.applicationUrl ? inputErrorClass : ""
          }`}
        />
        <FieldError id="applicationUrl-error" error={errors.applicationUrl} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="employmentType"
            className="mb-1 block text-sm font-medium text-neutral-700"
          >
            Type d&apos;emploi
          </label>
          <select
            id="employmentType"
            name="employmentType"
            defaultValue={values.employmentType}
            aria-invalid={errors.employmentType ? true : undefined}
            aria-describedby={
              errors.employmentType ? "employmentType-error" : undefined
            }
            className={`${inputClass} ${
              errors.employmentType ? inputErrorClass : ""
            }`}
          >
            <option value="">— Choisir —</option>
            {(
              Object.keys(employmentTypeLabels) as Array<
                keyof typeof employmentTypeLabels
              >
            ).map((type) => (
              <option key={type} value={type}>
                {employmentTypeLabels[type]}
              </option>
            ))}
          </select>
          <FieldError id="employmentType-error" error={errors.employmentType} />
        </div>

        <div>
          <label
            htmlFor="status"
            className="mb-1 block text-sm font-medium text-neutral-700"
          >
            Statut
          </label>
          <select
            id="status"
            name="status"
            defaultValue={values.status}
            aria-invalid={errors.status ? true : undefined}
            aria-describedby={errors.status ? "status-error" : undefined}
            className={`${inputClass} ${errors.status ? inputErrorClass : ""}`}
          >
            <option value="">— Choisir —</option>
            {(
              Object.keys(jobStatusLabels) as Array<
                keyof typeof jobStatusLabels
              >
            ).map((status) => (
              <option key={status} value={status}>
                {jobStatusLabels[status]}
              </option>
            ))}
          </select>
          <FieldError id="status-error" error={errors.status} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="deadline"
            className="mb-1 block text-sm font-medium text-neutral-700"
          >
            Date limite
          </label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            defaultValue={values.deadline}
            aria-invalid={errors.deadline ? true : undefined}
            aria-describedby={errors.deadline ? "deadline-error" : undefined}
            className={`${inputClass} ${errors.deadline ? inputErrorClass : ""}`}
          />
          <FieldError id="deadline-error" error={errors.deadline} />
        </div>

        <div className="flex items-end pb-3">
          <label className="flex items-center gap-2 text-sm text-neutral-800">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={values.featured === "on"}
              className="h-4 w-4 rounded border border-neutral-300 accent-brand-600"
            />
            À la une
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
