import { ReferenceListPage } from "@/components/admin/ReferenceListPage";

type PageProps = {
  searchParams: Promise<{
    created?: string;
    updated?: string;
    deleted?: string;
    error?: string;
  }>;
};

export default async function CompaniesPage({ searchParams }: PageProps) {
  return (
    <ReferenceListPage entity="company" searchParams={await searchParams} />
  );
}
