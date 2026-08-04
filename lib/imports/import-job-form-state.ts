export type ImportJobFormState = {
  errors: { url?: string };
  values: { url: string };
};

export const emptyImportJobFormState: ImportJobFormState = {
  errors: {},
  values: { url: "" },
};
