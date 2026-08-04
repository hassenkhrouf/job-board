import type { ImportedJob } from "@/lib/ai/types";
import { ImportError } from "@/lib/imports/types";

/**
 * OpenRouter provider — real implementation.
 *
 * Exposes a single public function, {@link extractJobFromAI}, that sends a
 * pre-built prompt to OpenRouter (OpenAI-compatible Chat Completions endpoint)
 * and returns a strictly-typed {@link ImportedJob}.
 *
 * Configuration (environment variables only, never hardcoded):
 *   - OPENROUTER_API_KEY     — required.
 *   - OPENROUTER_MODEL       — model id, defaults to `inclusionai/ling-3.0-flash:free`.
 *   - NEXT_PUBLIC_SITE_URL   — used as the HTTP-Referer attribution header.
 */

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "inclusionai/ling-3.0-flash:free";
const REQUEST_TIMEOUT_MS = 30_000;
const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1_500;

/** Submit the prompt to OpenRouter and parse the structured result. */
export async function extractJobFromAI(prompt: string): Promise<ImportedJob> {
  const apiKey = requireApiKey();
  const content = await requestCompletion(prompt, apiKey);
  return parseImportedJob(content);
}

function requireApiKey(): string {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    throw new ImportError(
      "AI_ERROR",
      "OPENROUTER_API_KEY is not configured. Add it to .env.local.",
    );
  }
  return key;
}

function activeModel(): string {
  return process.env.OPENROUTER_MODEL || DEFAULT_MODEL;
}

function referer(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

function isRetryableStatus(status: number): boolean {
  return status === 408 || status === 429 || status >= 500;
}

function isTimeoutError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name === "TimeoutError" || error.name === "AbortError")
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function postCompletion(
  prompt: string,
  apiKey: string,
  jsonMode: boolean,
): Promise<Response> {
  const body: Record<string, unknown> = {
    model: activeModel(),
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
  };
  // Some models don't support response_format; the caller falls back to text.
  if (jsonMode) {
    body.response_format = { type: "json_object" };
  }

  return fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": referer(),
      "X-OpenRouter-Title": "Job Board",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
}

async function requestCompletion(prompt: string, apiKey: string): Promise<string> {
  let jsonMode = true;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    let response: Response;
    try {
      response = await postCompletion(prompt, apiKey, jsonMode);
    } catch (error) {
      if (isTimeoutError(error)) {
        throw new ImportError("TIMEOUT", "OpenRouter request timed out.", {
          cause: error,
        });
      }
      // Transient network failure — retry before surfacing the error.
      if (attempt < MAX_ATTEMPTS) {
        await delay(RETRY_DELAY_MS);
        continue;
      }
      throw new ImportError("AI_ERROR", "OpenRouter request failed.", {
        cause: error,
      });
    }

    if (response.ok) {
      return await readResponseContent(response);
    }

    const status = response.status;

    // A 400 in JSON mode usually means the model doesn't support
    // response_format — retry once in plain text mode.
    if (status === 400 && jsonMode) {
      jsonMode = false;
      continue;
    }

    if (status === 401) {
      throw new ImportError(
        "AI_ERROR",
        "OpenRouter rejected the API key (HTTP 401).",
      );
    }
    if (status === 403) {
      throw new ImportError(
        "AI_ERROR",
        "OpenRouter request is forbidden (HTTP 403).",
      );
    }
    if (status === 404) {
      throw new ImportError(
        "AI_ERROR",
        `OpenRouter model "${activeModel()}" was not found (HTTP 404).`,
      );
    }

    if (isRetryableStatus(status) && attempt < MAX_ATTEMPTS) {
      console.error(
        `[openrouter] transient HTTP ${status} (model=${activeModel()}), retrying`,
      );
      await delay(RETRY_DELAY_MS);
      continue;
    }

    throw new ImportError(
      "AI_ERROR",
      `OpenRouter request failed (HTTP ${status}).`,
    );
  }

  throw new ImportError("AI_ERROR", "OpenRouter request failed.");
}

async function readResponseContent(response: Response): Promise<string> {
  let payload: unknown;
  try {
    payload = await response.json();
  } catch (error) {
    throw new ImportError("AI_ERROR", "OpenRouter returned a non-JSON response.", {
      cause: error,
    });
  }

  const content = extractChatContent(payload);
  if (!content) {
    throw new ImportError("EMPTY", "The model returned an empty response.");
  }
  return content;
}

/** Pull the assistant text out of an OpenAI-compatible chat response. */
function extractChatContent(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }
  const choices = (payload as { choices?: unknown }).choices;
  if (!Array.isArray(choices) || choices.length === 0) {
    return null;
  }
  const first = choices[0];
  if (!first || typeof first !== "object") {
    return null;
  }
  const message = (first as { message?: unknown }).message;
  if (!message || typeof message !== "object") {
    return null;
  }
  const content = (message as { content?: unknown }).content;

  if (typeof content === "string" && content.trim()) {
    return content.trim();
  }
  if (Array.isArray(content)) {
    let text = "";
    for (const part of content) {
      if (
        part &&
        typeof part === "object" &&
        typeof (part as { text?: unknown }).text === "string"
      ) {
        text += (part as { text: string }).text;
      }
    }
    if (text.trim()) {
      return text.trim();
    }
  }
  return null;
}

/** Parse the model's reply into a validated {@link ImportedJob}. */
function parseImportedJob(raw: string): ImportedJob {
  const json = parseJson(raw);
  if (!json || typeof json !== "object" || Array.isArray(json)) {
    throw new ImportError("EMPTY", "The model did not return a JSON object.");
  }

  const obj = json as Record<string, unknown>;
  const job: ImportedJob = {
    title: nullableString(obj.title),
    company: nullableString(obj.company),
    location: nullableString(obj.location),
    category: nullableString(obj.category),
    employmentType: nullableString(obj.employmentType),
    description: nullableString(obj.description),
    deadline: nullableString(obj.deadline),
    applicationUrl: nullableString(obj.applicationUrl),
    featured: nullableBoolean(obj.featured),
  };

  if (!job.title && !job.company && !job.description) {
    throw new ImportError("EMPTY", "The model did not extract any job data.");
  }

  return job;
}

/** Parse JSON, tolerating a markdown code fence some models add anyway. */
function parseJson(raw: string): unknown {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    throw new ImportError("AI_ERROR", "The model returned invalid JSON.", {
      cause: error,
    });
  }
}

function nullableString(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || null;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return null;
}

function nullableBoolean(value: unknown): boolean | null {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    if (value === "true" || value === "1") {
      return true;
    }
    if (value === "false" || value === "0") {
      return false;
    }
  }
  return null;
}
