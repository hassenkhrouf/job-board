import { notFound } from "next/navigation";
import { getReferenceById } from "@/lib/admin/references";
import { ReferenceFormPage } from "@/components/admin/ReferenceFormPage";

type EditLocationPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditLocationPage({
  params,
}: EditLocationPageProps) {
  const { id } = await params;
  const existing = await getReferenceById("location", id);
  if (!existing) {
    notFound();
  }
  return (
    <ReferenceFormPage
      entity="location"
      existing={existing}
      submitLabel="Enregistrer"
    />
  );
}
