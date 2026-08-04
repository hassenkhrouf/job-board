import type { EmploymentType, JobStatus } from "@prisma/client";

export type JobFormInput = {
  title: string;
  companyId: string;
  categoryId: string;
  locationId: string;
  description: string;
  excerpt: string;
  applicationUrl: string;
  employmentType: string;
  status: string;
  featured: string; // "on" | "off" from checkbox
  deadline: string; // yyyy-mm-dd from <input type="date">
  sourceUrl: string; // optional; hidden field, source of an imported job
};

export type JobFormValues = {
  title: string;
  companyId: string;
  categoryId: string;
  locationId: string;
  description: string;
  excerpt: string;
  applicationUrl: string;
  employmentType: EmploymentType;
  status: JobStatus;
  featured: boolean;
  deadline: Date;
  sourceUrl: string | null;
};

export type JobFormErrors = Partial<Record<keyof JobFormInput, string>>;

/**
 * State passed to the client-side `useActionState` form. On failure the server
 * action returns the per-field errors alongside the submitted values so the
 * form can re-render without losing input.
 */
export type JobFormState = {
  errors: JobFormErrors;
  values: JobFormInput;
};

export const emptyJobFormState: JobFormState = {
  errors: {},
  values: {
    title: "",
    companyId: "",
    categoryId: "",
    locationId: "",
    description: "",
    excerpt: "",
    applicationUrl: "",
    employmentType: "",
    status: "",
    featured: "",
    deadline: "",
    sourceUrl: "",
  },
};

/** Decode a `?invalid=` comma-list into per-field error stubs for the form. */
export function decodeInvalidFields(value: string | undefined): JobFormErrors {
  if (!value) {
    return {};
  }
  const known: Array<keyof JobFormInput> = [
    "title",
    "companyId",
    "categoryId",
    "locationId",
    "description",
    "excerpt",
    "applicationUrl",
    "employmentType",
    "status",
    "featured",
    "deadline",
    "sourceUrl",
  ];
  const errors: JobFormErrors = {};
  for (const name of value.split(",")) {
    if ((known as string[]).includes(name)) {
      errors[name as keyof JobFormInput] = "Champ invalide.";
    }
  }
  return errors;
}

export type ValidationResult =
  | { ok: true; values: JobFormValues }
  | { ok: false; errors: JobFormErrors; values: JobFormInput };

const titleMax = 200;
const descriptionMax = 10000;
const excerptMax = 300;
const urlMax = 2048;

const employmentTypes: EmploymentType[] = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "TEMPORARY",
  "COMPETITION",
];

const statuses: JobStatus[] = ["DRAFT", "PUBLISHED", "CLOSED"];

function isEmploymentType(value: string): value is EmploymentType {
  return (employmentTypes as string[]).includes(value);
}

function isJobStatus(value: string): value is JobStatus {
  return (statuses as string[]).includes(value);
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/** Validate raw form input server-side. No third-party dependencies. */
export function validateJobForm(input: JobFormInput): ValidationResult {
  const errors: JobFormErrors = {};

  const title = input.title.trim();
  if (!title) {
    errors.title = "Le titre est requis.";
  } else if (title.length > titleMax) {
    errors.title = `Le titre ne doit pas dépasser ${titleMax} caractères.`;
  }

  if (!input.companyId) {
    errors.companyId = "L'entreprise est requise.";
  }
  if (!input.categoryId) {
    errors.categoryId = "La catégorie est requise.";
  }
  if (!input.locationId) {
    errors.locationId = "La localisation est requise.";
  }

  const description = input.description.trim();
  if (!description) {
    errors.description = "La description est requise.";
  } else if (description.length > descriptionMax) {
    errors.description = `La description ne doit pas dépasser ${descriptionMax} caractères.`;
  }

  const excerpt = input.excerpt.trim();
  if (excerpt.length > excerptMax) {
    errors.excerpt = `L'extrait ne doit pas dépasser ${excerptMax} caractères.`;
  }

  const applicationUrl = input.applicationUrl.trim();
  if (!applicationUrl) {
    errors.applicationUrl = "L'URL de candidature est requise.";
  } else if (applicationUrl.length > urlMax) {
    errors.applicationUrl = `L'URL ne doit pas dépasser ${urlMax} caractères.`;
  } else if (!isValidUrl(applicationUrl)) {
    errors.applicationUrl = "L'URL doit commencer par http:// ou https://";
  }

  if (!isEmploymentType(input.employmentType)) {
    errors.employmentType = "Type d'emploi invalide.";
  }

  if (!isJobStatus(input.status)) {
    errors.status = "Statut invalide.";
  }

  const featured = input.featured === "on";

  const parsedDeadline = parseDeadline(input.deadline);
  if (!parsedDeadline) {
    errors.deadline = "La date limite est requise et doit être valide.";
  }

  const sourceUrl = input.sourceUrl.trim();
  if (sourceUrl.length > urlMax) {
    errors.sourceUrl = `L'URL ne doit pas dépasser ${urlMax} caractères.`;
  } else if (sourceUrl && !isValidUrl(sourceUrl)) {
    errors.sourceUrl = "L'URL doit commencer par http:// ou https://";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors, values: input };
  }

  // After the guards above, these are guaranteed valid enums.
  const validEmploymentType = input.employmentType as EmploymentType;
  const validStatus = input.status as JobStatus;

  return {
    ok: true,
    values: {
      title,
      companyId: input.companyId,
      categoryId: input.categoryId,
      locationId: input.locationId,
      description,
      excerpt,
      applicationUrl,
      employmentType: validEmploymentType,
      status: validStatus,
      featured,
      deadline: parsedDeadline as Date,
      sourceUrl: sourceUrl || null,
    },
  };
}

/** Parse a yyyy-mm-dd string into a UTC Date at 00:00. Returns null on failure. */
export function parseDeadline(value: string): Date | null {
  if (!value) {
    return null;
  }
  // yyyy-mm-dd → Date at 00:00 UTC to avoid TZ drift on the form round-trip.
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }
  const [, y, m, d] = match;
  const date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

/** Format a Date back to yyyy-mm-dd for an <input type="date"> default value. */
export function toDateInputValue(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
