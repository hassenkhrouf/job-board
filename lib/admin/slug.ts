import { prisma } from "@/lib/database/prisma";

/** Lowercase ASCII slug from a free-text title (French-friendly accents stripped). */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // non-alnum runs → hyphen
    .replace(/^-+|-+$/g, "") // trim leading/trailing hyphens
    .slice(0, 180);
}

/**
 * Generate a unique slug for a new job. Appends `-2`, `-3`, ... on collision.
 * Returns an empty string if the title produces no usable slug.
 */
export async function uniqueJobSlug(title: string): Promise<string> {
  const base = slugify(title);
  if (!base) {
    return "";
  }

  let candidate = base;
  let suffix = 2;

  while (await prisma.job.findUnique({ where: { slug: candidate } })) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

/**
 * Decide the slug for an update. Regenerate from the new title only when the
 * title actually changed AND the job is not currently PUBLISHED (regenerating
 * would break a live URL). Otherwise keep the existing slug. The regenerated
 * slug is made unique against other jobs (excluding the one being edited).
 */
export async function resolveEditSlug({
  currentId,
  currentSlug,
  currentTitle,
  currentStatus,
  newTitle,
}: {
  currentId: string;
  currentSlug: string;
  currentTitle: string;
  currentStatus: "DRAFT" | "PUBLISHED" | "CLOSED";
  newTitle: string;
}): Promise<string> {
  if (newTitle.trim() === currentTitle) {
    return currentSlug;
  }

  if (currentStatus === "PUBLISHED") {
    return currentSlug;
  }

  const base = slugify(newTitle) || currentSlug;
  if (base === currentSlug) {
    return currentSlug;
  }

  let candidate = base;
  let suffix = 2;

  while (
    await prisma.job.findFirst({
      where: { slug: candidate, id: { not: currentId } },
    })
  ) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}
