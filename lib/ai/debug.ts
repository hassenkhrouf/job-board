/**
 * Dev-only debug logging for the AI import pipeline.
 *
 * Gated behind `IMPORT_DEBUG=1` so it is a no-op by default and never affects
 * production. Output goes to the server console only — nothing is rendered in
 * the UI.
 */

export function isImportDebugEnabled(): boolean {
  return process.env.IMPORT_DEBUG === "1";
}

export function importDebugLog(section: string, message: string): void {
  if (!isImportDebugEnabled()) {
    return;
  }
  console.log(`\n[import:${section}]`);
  console.log(message);
}
