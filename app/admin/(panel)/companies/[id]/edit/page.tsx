import { notFound } from "next/navigation";
import { getReferenceById } from "@/lib/admin/references";
import { ReferenceFormPage } from "@/components/admin/ReferenceFormPage";

type EditCompanyPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCompanyPage({
  params,
}: EditCompanyPageProps) {
  const { id } = await params;
  const existing = await getReferenceById("company", id);
  if (!existing) {
    notFound();
  }
  return (
    <ReferenceFormPage
      entity="company"
      existing={existing}
      submitLabel="Enregistrer"
    />
  );
}
