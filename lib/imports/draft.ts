import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import type { ImportedJob } from "@/lib/ai/types";
import { isSecureRequest } from "@/lib/admin/cookies";

/**
 * Server-side temporary storage for a job that was imported and is being
 * reviewed on the create-job page.
 *
 * The extracted job can be large (full description), so it is NOT passed
 * through the URL or a cookie: only a random token travels in a short-lived
 * cookie while the payload lives in this server-side store.
 *
 * Note: the store is in-memory and therefore tied to a single process. If the
 * app is ever scaled to multiple instances, swap the Map for a shared store
 * (e.g. Redis) without changing the public API of this module.
 */

export const IMPORT_DRAFT_COOKIE = "import_draft";
export const IMPORT_DRAFT_TTL_MS = 15 * 60 * 1000;

type DraftEntry = {
  job: ImportedJob;
  sourceUrl: string;
  expiresAt: number;
};

const draftStore = new Map<string, DraftEntry>();

function pruneExpired(): void {
  const now = Date.now();
  for (const [token, entry] of draftStore) {
    if (entry.expiresAt < now) {
      draftStore.delete(token);
    }
  }
}

export async function saveImportDraft(
  job: ImportedJob,
  sourceUrl: string,
): Promise<void> {
  pruneExpired();
  const token = randomUUID();
  draftStore.set(token, { job, sourceUrl, expiresAt: Date.now() + IMPORT_DRAFT_TTL_MS });

  const store = await cookies();
  store.set(IMPORT_DRAFT_COOKIE, token, {
    ...(await secureCookieOptions()),
    maxAge: Math.floor(IMPORT_DRAFT_TTL_MS / 1000),
  });
}

export type ImportDraft = {
  job: ImportedJob;
  sourceUrl: string;
};

/**
 * Read and consume the current draft (single use). Returns null when absent.
 *
 * Read-only: must be safe to call from a Server Component, so it never writes
 * cookies. The payload is removed from the in-memory store on read; the cookie
 * itself is invalidated from a Server Action via {@link clearImportDraft}.
 */
export async function readImportDraft(): Promise<ImportDraft | null> {
  const store = await cookies();
  const token = store.get(IMPORT_DRAFT_COOKIE)?.value;
  if (!token) {
    return null;
  }

  const entry = draftStore.get(token);
  draftStore.delete(token);
  if (!entry || entry.expiresAt < Date.now()) {
    return null;
  }

  return { job: entry.job, sourceUrl: entry.sourceUrl };
}

/**
 * Discard any pending draft and expire its cookie. Must be called from a
 * Server Action or Route Handler (cookie writes are not allowed elsewhere).
 */
export async function clearImportDraft(): Promise<void> {
  const store = await cookies();
  const token = store.get(IMPORT_DRAFT_COOKIE)?.value;
  if (token) {
    draftStore.delete(token);
  }
  store.set(IMPORT_DRAFT_COOKIE, "", {
    ...(await secureCookieOptions()),
    maxAge: 0,
  });
}

async function secureCookieOptions() {
  return {
    httpOnly: true,
    secure: await isSecureRequest(),
    sameSite: "lax",
    path: "/",
  } as const;
}
