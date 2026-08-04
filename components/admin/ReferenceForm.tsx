"use client";

import { useActionState } from "react";
import type { ReferenceFormState } from "@/lib/admin/reference-form-schema";
import { Button } from "@/components/ui/button";

type ReferenceFormProps = {
  label: string;
  nameHint: string;
  hasWebsite: boolean;
  hasDescription: boolean;
  action: (
    prevState: ReferenceFormState,
    formData: FormData,
  ) => Promise<ReferenceFormState>;
  initialState: ReferenceFormState;
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

export function ReferenceForm({
  label,
  nameHint,
  hasWebsite,
  hasDescription,
  action,
  initialState,
  submitLabel,
}: ReferenceFormProps) {
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

      <div>
        <label
          htmlFor="name"
          className="mb-1 block text-sm font-medium text-neutral-700"
        >
          {label}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder={nameHint}
          defaultValue={values.name}
          maxLength={200}
          required
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={`${inputClass} ${errors.name ? inputErrorClass : ""}`}
        />
        <FieldError id="name-error" error={errors.name} />
      </div>

      {hasWebsite ? (
        <div>
          <label
            htmlFor="website"
            className="mb-1 block text-sm font-medium text-neutral-700"
          >
            Site web (optionnel)
          </label>
          <input
            id="website"
            name="website"
            type="url"
            inputMode="url"
            placeholder="https://"
            defaultValue={values.website}
            aria-invalid={errors.website ? true : undefined}
            aria-describedby={errors.website ? "website-error" : undefined}
            className={`${inputClass} ${errors.website ? inputErrorClass : ""}`}
          />
          <FieldError id="website-error" error={errors.website} />
        </div>
      ) : null}

      {hasDescription ? (
        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium text-neutral-700"
          >
            Description (optionnelle)
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={values.description}
            maxLength={2000}
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
      ) : null}

      <div className="flex gap-3">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
