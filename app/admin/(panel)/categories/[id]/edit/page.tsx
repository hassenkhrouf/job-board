import { notFound } from "next/navigation";
import { getReferenceById } from "@/lib/admin/references";
import { ReferenceFormPage } from "@/components/admin/ReferenceFormPage";

type EditCategoryPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { id } = await params;
  const existing = await getReferenceById("category", id);
  if (!existing) {
    notFound();
  }
  return (
    <ReferenceFormPage
      entity="category"
      existing={existing}
      submitLabel="Enregistrer"
    />
  );
}
