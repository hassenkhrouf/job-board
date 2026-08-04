/**
 * Generic import framework types.
 *
 * The importer framework turns a source (today a URL) into a structured,
 * AI-backed {@link ImportedJob}. Each new importer (PDF, plain text, DOCX,
 * RSS) only needs to produce content and call the AI provider — the rest of
 * the flow (draft, review, publish) is source-agnostic.
 *
 * Failure modes are normalized into {@link ImportErrorCode} so the UI can show
 * friendly, case-specific messages without knowing how a given source failed.
 */

export type ImportSourceType = "url";

export type ImportSource = {
  type: ImportSourceType;
  url: string;
};

export type ImportErrorCode =
  | "INVALID_URL"
  | "UNREACHABLE"
  | "TIMEOUT"
  | "UNSUPPORTED"
  | "EMPTY"
  | "AI_ERROR";

export class ImportError extends Error {
  readonly code: ImportErrorCode;

  constructor(code: ImportErrorCode, message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "ImportError";
    this.code = code;
  }
}