import { Container } from "@/components/ui/Container";

type HeroProps = {
  totalJobs: number;
  totalCategories: number;
  totalLocations: number;
};

function formatCount(value: number): string {
  return new Intl.NumberFormat("fr-FR").format(value);
}

export function Hero({
  totalJobs,
  totalCategories,
  totalLocations,
}: HeroProps) {
  const stats = [
    { label: "offres publiées", value: totalJobs },
    { label: "catégories", value: totalCategories },
    { label: "lieux couverts", value: totalLocations },
  ];

  return (
    <div className="border-b border-neutral-200 bg-gradient-to-b from-brand-50 via-white to-white">
      <Container className="py-14 sm:py-20">
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
          Trouvez votre prochaine opportunité en Tunisie
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
          Offres d&apos;emploi, concours publics, stages et opportunités remote,
          rassemblées sur une seule plateforme.
        </p>

        <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dd className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
                {formatCount(stat.value)}
              </dd>
              <dt className="mt-0.5 text-sm text-neutral-600">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </Container>
    </div>
  );
}
