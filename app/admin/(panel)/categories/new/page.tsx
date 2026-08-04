import { ReferenceFormPage } from "@/components/admin/ReferenceFormPage";

export default async function NewCategoryPage() {
  return (
    <ReferenceFormPage entity="category" submitLabel="Créer la catégorie" />
  );
}
