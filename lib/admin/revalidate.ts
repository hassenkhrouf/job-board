import { revalidatePath } from "next/cache";

/** Revalidate every public page that can show a job or a reference entity. */
export function revalidatePublicContent() {
  revalidatePath("/");
  revalidatePath("/jobs");
  revalidatePath("/categories");
  revalidatePath("/locations");
  revalidatePath("/jobs/[slug]", "page");
  revalidatePath("/jobs/category/[slug]", "page");
  revalidatePath("/jobs/location/[slug]", "page");
}

/** Revalidate the admin lists that show jobs and reference entities. */
export function revalidateAdminContent() {
  revalidatePath("/admin/jobs");
  revalidatePath("/admin/companies");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/locations");
}
