/**
 * AI job extraction types.
 *
 * `ImportedJob` mirrors the JSON schema the prompt (`prompts/job-import.ts`)
 * asks the model to produce. Every field is nullable: the model is instructed
 * to return `null` when a value is unknown, and the administrator reviews the
 * result before publishing.
 */

export type ImportedJob = {
  title: string | null;
  company: string | null;
  location: string | null;
  category: string | null;
  employmentType: string | null;
  description: string | null;
  deadline: string | null; // yyyy-mm-dd when known
  applicationUrl: string | null;
  featured: boolean | null;
};

/** Empty result used to build form state when no draft exists. */
export const emptyImportedJob: ImportedJob = {
  title: null,
  company: null,
  location: null,
  category: null,
  employmentType: null,
  description: null,
  deadline: null,
  applicationUrl: null,
  featured: null,
};
