import { loginAdmin } from "@/lib/admin/actions";
import { Button } from "@/components/ui/button";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

const errorMessage = (code: string | undefined): string | null => {
  switch (code) {
    case "credentials":
      return "Mot de passe incorrect.";
    case "config":
      return "La connexion est désactivée (configuration manquante).";
    default:
      return null;
  }
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error: errorCode } = await searchParams;
  const error = errorMessage(errorCode);

  return (
    <main className="flex min-h-full items-center justify-center bg-neutral-50 px-4 py-16">
      <div className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
          Administration
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Connectez-vous pour gérer les offres.
        </p>

        {error ? (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {error}
          </p>
        ) : null}

        <form action={loginAdmin} className="mt-6 flex flex-col gap-4">
          <div>
            <label
              htmlFor="admin-password"
              className="mb-1 block text-sm font-medium text-neutral-700"
            >
              Mot de passe
            </label>
            <input
              id="admin-password"
              type="password"
              name="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-base text-neutral-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>

          <Button type="submit">Se connecter</Button>
        </form>
      </div>
    </main>
  );
}
