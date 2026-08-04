"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/database/prisma";
import {
  clearAdminSessionCookie,
  setAdminSessionCookie,
} from "@/lib/admin/cookies";
import { verifyAdminPassword } from "@/lib/admin/password";
import { requireAdminSession } from "@/lib/admin/require-session";
import {
  revalidateAdminContent,
  revalidatePublicContent,
} from "@/lib/admin/revalidate";
import { uniqueJobSlug, resolveEditSlug } from "@/lib/admin/slug";
import {
  validateJobForm,
  type JobFormState,
} from "@/lib/admin/job-form-schema";
import { importJob as importJobFromSource } from "@/lib/imports/registry";
import { clearImportDraft, saveImportDraft } from "@/lib/imports/draft";
import type { ImportJobFormState } from "@/lib/imports/import-job-form-state";
import { importErrorMessage, isHttpUrl } from "@/lib/imports/shared";

export async function loginAdmin(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const secret = process.env.ADMIN_SECRET;

  if (!passwordHash || !secret) {
    redirect("/admin/login?error=config");
  }

  if (!password || !verifyAdminPassword(password, passwordHash)) {
    redirect("/admin/login?error=credentials");
  }

  await setAdminSessionCookie();
  redirect("/admin/jobs");
}

export async function logoutAdmin() {
  await clearAdminSessionCookie();
  redirect("/admin/login");
}

function parseJobForm(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    companyId: String(formData.get("companyId") ?? ""),
    categoryId: String(formData.get("categoryId") ?? ""),
    locationId: String(formData.get("locationId") ?? ""),
    description: String(formData.get("description") ?? ""),
    excerpt: String(formData.get("excerpt") ?? ""),
    applicationUrl: String(formData.get("applicationUrl") ?? ""),
    employmentType: String(formData.get("employmentType") ?? ""),
    status: String(formData.get("status") ?? ""),
    featured: String(formData.get("featured") ?? ""),
    deadline: String(formData.get("deadline") ?? ""),
    sourceUrl: String(formData.get("sourceUrl") ?? ""),
  };
}

function revalidateAfterJobChange() {
  revalidateAdminContent();
  revalidatePublicContent();
}

/** Derive a short source name (hostname) from a URL, or null if not parseable. */
function sourceNameFromUrl(url: string): string | null {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

export async function createJob(
  _prevState: JobFormState,
  formData: FormData,
): Promise<JobFormState> {
  await requireAdminSession();

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const input = parseJobForm(formData);
  const result = validateJobForm(input);
  if (!result.ok) {
    return { errors: result.errors, values: result.values };
  }

  const { values } = result;
  const slug = await uniqueJobSlug(values.title);
  if (!slug) {
    return {
      errors: { title: "Le titre doit contenir des caractères valides." },
      values: input,
    };
  }

  const publishedAt = values.status === "PUBLISHED" ? new Date() : null;

  await prisma.job.create({
    data: {
      title: values.title,
      slug,
      description: values.description,
      excerpt: values.excerpt,
      applicationUrl: values.applicationUrl,
      employmentType: values.employmentType,
      status: values.status,
      featured: values.featured,
      deadline: values.deadline,
      publishedAt,
      sourceName: values.sourceUrl ? sourceNameFromUrl(values.sourceUrl) : null,
      sourceUrl: values.sourceUrl,
      importedAt: values.sourceUrl ? new Date() : null,
      companyId: values.companyId,
      categoryId: values.categoryId,
      locationId: values.locationId,
    },
  });

  revalidateAfterJobChange();
  await clearImportDraft();
  redirect("/admin/jobs?created=1");
}

export async function updateJob(
  id: string,
  _prevState: JobFormState,
  formData: FormData,
): Promise<JobFormState> {
  await requireAdminSession();

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const existing = await prisma.job.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      title: true,
      status: true,
      publishedAt: true,
    },
  });
  if (!existing) {
    redirect("/admin/jobs");
  }

  const input = parseJobForm(formData);
  const result = validateJobForm(input);
  if (!result.ok) {
    return { errors: result.errors, values: result.values };
  }

  const { values } = result;
  const slug = await resolveEditSlug({
    currentId: existing.id,
    currentSlug: existing.slug,
    currentTitle: existing.title,
    currentStatus: existing.status,
    newTitle: values.title,
  });

  // Set publishedAt only on the first transition to PUBLISHED.
  const firstPublish =
    values.status === "PUBLISHED" && existing.publishedAt === null
      ? new Date()
      : undefined;

  await prisma.job.update({
    where: { id },
    data: {
      title: values.title,
      slug,
      description: values.description,
      excerpt: values.excerpt,
      applicationUrl: values.applicationUrl,
      employmentType: values.employmentType,
      status: values.status,
      featured: values.featured,
      deadline: values.deadline,
      ...(firstPublish ? { publishedAt: firstPublish } : null),
      companyId: values.companyId,
      categoryId: values.categoryId,
      locationId: values.locationId,
    },
  });

  revalidateAfterJobChange();
  redirect("/admin/jobs?updated=1");
}

export async function deleteJob(id: string) {
  await requireAdminSession();

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  // Hard delete. Idempotent: a missing row is treated as already deleted.
  await prisma.job.delete({ where: { id } }).catch(() => null);

  revalidateAfterJobChange();
  redirect("/admin/jobs?deleted=1");
}

/**
 * Import a job from a URL: fetch + extract the page, run it through the AI
 * provider, then stash the draft and redirect to the create-job page for review.
 */
export async function importJobFromUrl(
  _prevState: ImportJobFormState,
  formData: FormData,
): Promise<ImportJobFormState> {
  await requireAdminSession();

  const url = String(formData.get("url") ?? "").trim();

  if (!isHttpUrl(url)) {
    return {
      errors: { url: "Veuillez saisir une URL valide commençant par http:// ou https://." },
      values: { url },
    };
  }

  let draft;
  try {
    const job = await importJobFromSource({ type: "url", url });
    draft = { job, url };
  } catch (error) {
    return { errors: { url: importErrorMessage(error) }, values: { url } };
  }

  await saveImportDraft(draft.job, draft.url);
  redirect("/admin/jobs/new?imported=1");
}
