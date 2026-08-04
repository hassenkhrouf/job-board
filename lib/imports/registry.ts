import type { ImportedJob } from "@/lib/ai/types";
import type { ImportSource } from "@/lib/imports/types";
import { importUrl } from "@/lib/imports/url";

/**
 * Import registry. Routes a source to the importer that can handle it.
 * New source types (PDF, plain text, DOCX, RSS) register an importer here
 * without changing the rest of the flow.
 */
const importers: Record<
  ImportSource["type"],
  (source: ImportSource) => Promise<ImportedJob>
> = {
  url: importUrl,
};

export async function importJob(source: ImportSource): Promise<ImportedJob> {
  return importers[source.type](source);
}
