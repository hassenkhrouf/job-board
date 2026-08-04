import { ReferenceListPage } from "@/components/admin/ReferenceListPage";

type PageProps = {
  searchParams: Promise<{
    created?: string;
    updated?: string;
    deleted?: string;
    error?: string;
  }>;
};

export default async function CategoriesPage({ searchParams }: PageProps) {
  return (
    <ReferenceListPage entity="category" searchParams={await searchParams} />
  );
}
