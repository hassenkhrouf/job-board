import { notFound } from "next/navigation";
import { getReferenceById } from "@/lib/admin/references";
import { ReferenceDeletePage } from "@/components/admin/ReferenceDeletePage";

type DeleteCompanyPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DeleteCompanyPage({
  params,
}: DeleteCompanyPageProps) {
  const { id } = await params;
  const row = await getReferenceById("company", id);
  if (!row) {
    notFound();
  }
  return <ReferenceDeletePage entity="company" row={row} />;
}
