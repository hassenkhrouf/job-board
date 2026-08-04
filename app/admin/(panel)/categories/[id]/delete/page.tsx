import { notFound } from "next/navigation";
import { getReferenceById } from "@/lib/admin/references";
import { ReferenceDeletePage } from "@/components/admin/ReferenceDeletePage";

type DeleteCategoryPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DeleteCategoryPage({
  params,
}: DeleteCategoryPageProps) {
  const { id } = await params;
  const row = await getReferenceById("category", id);
  if (!row) {
    notFound();
  }
  return <ReferenceDeletePage entity="category" row={row} />;
}
