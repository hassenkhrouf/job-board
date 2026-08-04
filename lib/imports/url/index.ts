import type { ImportedJob } from "@/lib/ai/types";
import { extractReadableContent } from "@/lib/ai/extractors/readable";
import { buildJobImportPrompt } from "@/lib/ai/prompts/job-import";
import { extractJobFromAI } from "@/lib/ai/providers/openrouter";
import { importDebugLog } from "@/lib/ai/debug";
import type { ImportSource } from "@/lib/imports/types";

/**
 * URL importer: fetch the page, extract the readable content, build the AI
 * prompt, then run it through the AI provider for a structured job.
 */
export async function importUrl(source: ImportSource): Promise<ImportedJob> {
  const page = await extractReadableContent(source.url);
  const prompt = buildJobImportPrompt({
    title: page.title,
    url: source.url,
    content: page.content,
  });

  importDebugLog("prompt", prompt);

  const job = await extractJobFromAI(prompt);

  importDebugLog("ai-response", JSON.stringify(job, null, 2));

  return job;
}