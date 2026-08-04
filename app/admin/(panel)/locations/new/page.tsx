import { ReferenceFormPage } from "@/components/admin/ReferenceFormPage";

export default async function NewLocationPage() {
  return (
    <ReferenceFormPage entity="location" submitLabel="Créer la localisation" />
  );
}
