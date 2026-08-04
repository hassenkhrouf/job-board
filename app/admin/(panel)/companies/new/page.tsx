import { ReferenceFormPage } from "@/components/admin/ReferenceFormPage";

export default async function NewCompanyPage() {
  return (
    <ReferenceFormPage entity="company" submitLabel="Créer l'entreprise" />
  );
}
