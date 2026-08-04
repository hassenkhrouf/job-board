import { Container } from "@/components/ui/Container";

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="h-5 w-2/3 animate-pulse rounded bg-neutral-200" />
      <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-neutral-100" />
      <div className="mt-4 flex gap-2">
        <div className="h-5 w-20 animate-pulse rounded-full bg-neutral-100" />
        <div className="h-5 w-24 animate-pulse rounded-full bg-neutral-100" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <main>
      <div className="border-b border-neutral-200 bg-gradient-to-b from-brand-50 via-white to-white py-14 sm:py-20">
        <Container>
          <div className="h-10 w-3/4 max-w-xl animate-pulse rounded bg-neutral-200" />
          <div className="mt-4 h-5 w-1/2 max-w-md animate-pulse rounded bg-neutral-100" />
        </Container>
      </div>
      <div className="py-10 sm:py-12">
        <Container className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </Container>
      </div>
    </main>
  );
}
