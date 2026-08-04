"use client";

import { useActionState } from "react";
import type { ImportJobFormState } from "@/lib/imports/import-job-form-state";
import { emptyImportJobFormState } from "@/lib/imports/import-job-form-state";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-base text-neutral-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30";

type JobImportFormProps = {
  action: (
    prevState: ImportJobFormState,
    formData: FormData,
  ) => Promise<ImportJobFormState>;
};

export function JobImportForm({ action }: JobImportFormProps) {
  const [state, formAction] = useActionState(action, emptyImportJobFormState);
  const { errors } = state;

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      {errors.url ? (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errors.url}
        </p>
      ) : null}

      <div>
        <label
          htmlFor="url"
          className="mb-1 block text-sm font-medium text-neutral-700"
        >
          URL de l&apos;offre
        </label>
        <input
          id="url"
          name="url"
          type="url"
          inputMode="url"
          placeholder="https://exemple.com/offre"
          defaultValue={state.values.url}
          required
          aria-invalid={errors.url ? true : undefined}
          aria-describedby={errors.url ? "url-error" : undefined}
          className={`${inputClass} ${
            errors.url
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/30"
              : ""
          }`}
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit">Importer</Button>
      </div>
    </form>
  );
}