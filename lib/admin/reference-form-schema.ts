export type ReferenceFormState = {
  errors: Partial<Record<"name" | "website" | "description", string>>;
  values: { name: string; website: string; description: string };
};

export const emptyReferenceFormState: ReferenceFormState = {
  errors: {},
  values: { name: "", website: "", description: "" },
};

export type ReferenceFormInput = {
  name: string;
  website: string;
  description: string;
};

type ReferenceFieldConfig = {
  hasWebsite: boolean;
  hasDescription: boolean;
  maxNameLength: number;
};

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/** Validate raw reference form input. No third-party dependencies. */
export function validateReferenceInput(
  input: ReferenceFormInput,
  config: ReferenceFieldConfig,
): ReferenceFormState {
  const errors: ReferenceFormState["errors"] = {};

  const name = input.name.trim();
  if (!name) {
    errors.name = "Le nom est requis.";
  } else if (name.length > config.maxNameLength) {
    errors.name = `Le nom ne doit pas dépasser ${config.maxNameLength} caractères.`;
  }

  const website = input.website.trim();
  if (config.hasWebsite) {
    if (website.length > 2048) {
      errors.website = "L'URL ne doit pas dépasser 2048 caractères.";
    } else if (website && !isValidUrl(website)) {
      errors.website = "L'URL doit commencer par http:// ou https://";
    }
  }

  const description = input.description.trim();
  if (config.hasDescription && description.length > 2000) {
    errors.description = "La description ne doit pas dépasser 2000 caractères.";
  }

  return { errors, values: { name, website, description } };
}
