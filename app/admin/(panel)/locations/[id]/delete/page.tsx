import { notFound } from "next/navigation";
import { getReferenceById } from "@/lib/admin/references";
import { ReferenceDeletePage } from "@/components/admin/ReferenceDeletePage";

type DeleteLocationPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DeleteLocationPage({
  params,
}: DeleteLocationPageProps) {
  const { id } = await params;
  const row = await getReferenceById("location", id);
  if (!row) {
    notFound();
  }
  return <ReferenceDeletePage entity="location" row={row} />;
}
