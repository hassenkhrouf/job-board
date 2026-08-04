"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/database/prisma";
import { requireAdminSession } from "@/lib/admin/require-session";
import {
  revalidateAdminContent,
  revalidatePublicContent,
} from "@/lib/admin/revalidate";
import {
  validateReferenceInput,
  type ReferenceFormState,
} from "@/lib/admin/reference-form-schema";
import {
  getReferenceById,
  referenceConfig,
  resolveReferenceEditSlug,
  uniqueReferenceSlug,
  type ReferenceEntity,
} from "@/lib/admin/references";

type ReferenceWriteValues = {
  name: string;
  slug: string;
  website: string;
  description: string;
};

function parseReferenceInput(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    website: String(formData.get("website") ?? ""),
    description: String(formData.get("description") ?? ""),
  };
}

async function createReferenceRow(
  entity: ReferenceEntity,
  values: ReferenceWriteValues,
) {
  if (entity === "company") {
    await prisma.company.create({
      data: {
        name: values.name,
        slug: values.slug,
        website: values.website || null,
        description: values.description || null,
      },
    });
  } else if (entity === "category") {
    await prisma.category.create({
      data: { name: values.name, slug: values.slug },
    });
  } else {
    await prisma.location.create({
      data: { name: values.name, slug: values.slug },
    });
  }
}

async function updateReferenceRow(
  entity: ReferenceEntity,
  id: string,
  values: ReferenceWriteValues,
) {
  if (entity === "company") {
    await prisma.company.update({
      where: { id },
      data: {
        name: values.name,
        slug: values.slug,
        website: values.website || null,
        description: values.description || null,
      },
    });
  } else if (entity === "category") {
    await prisma.category.update({
      where: { id },
      data: { name: values.name, slug: values.slug },
    });
  } else {
    await prisma.location.update({
      where: { id },
      data: { name: values.name, slug: values.slug },
    });
  }
}

async function deleteReferenceRow(entity: ReferenceEntity, id: string) {
  if (entity === "company") {
    await prisma.company.delete({ where: { id } });
  } else if (entity === "category") {
    await prisma.category.delete({ where: { id } });
  } else {
    await prisma.location.delete({ where: { id } });
  }
}

export async function createReference(
  entity: ReferenceEntity,
  _prevState: ReferenceFormState,
  formData: FormData,
): Promise<ReferenceFormState> {
  await requireAdminSession();

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const result = validateReferenceInput(
    parseReferenceInput(formData),
    referenceConfig[entity],
  );
  if (Object.keys(result.errors).length > 0) {
    return result;
  }

  const slug = await uniqueReferenceSlug(entity, result.values.name);
  if (!slug) {
    return {
      errors: { name: "Le nom doit contenir des caractères valides." },
      values: result.values,
    };
  }

  const values = { ...result.values, slug };
  await createReferenceRow(entity, values);
  revalidateAdminContent();
  revalidatePublicContent();
  redirect(`${referenceConfig[entity].listPath}?created=1`);
}

export async function updateReference(
  entity: ReferenceEntity,
  id: string,
  _prevState: ReferenceFormState,
  formData: FormData,
): Promise<ReferenceFormState> {
  await requireAdminSession();

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const existing = await getReferenceById(entity, id);
  if (!existing) {
    redirect(referenceConfig[entity].listPath);
  }

  const result = validateReferenceInput(
    parseReferenceInput(formData),
    referenceConfig[entity],
  );
  if (Object.keys(result.errors).length > 0) {
    return result;
  }

  const slug = await resolveReferenceEditSlug({
    entity,
    currentId: id,
    currentSlug: existing.slug,
    currentName: existing.name,
    newName: result.values.name,
  });

  await updateReferenceRow(entity, id, { ...result.values, slug });
  revalidateAdminContent();
  revalidatePublicContent();
  redirect(`${referenceConfig[entity].listPath}?updated=1`);
}

export async function deleteReference(entity: ReferenceEntity, id: string) {
  await requireAdminSession();

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  try {
    await deleteReferenceRow(entity, id);
  } catch (error) {
    // Referenced by at least one job — reject the deletion.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2003"
    ) {
      redirect(`${referenceConfig[entity].listPath}?error=in-use`);
    }
    throw error;
  }

  revalidateAdminContent();
  revalidatePublicContent();
  redirect(`${referenceConfig[entity].listPath}?deleted=1`);
}
