import { Container } from "@/components/ui/Container";

export function AdPlaceholder() {
  // Placeholder for Google AdSense or other ad networks
  // To integrate AdSense:
  // 1. Add your AdSense script in app/layout.tsx <head>
  // 2. Replace this component with actual AdUnit components
  // 3. Configure ad slots in your Vercel environment variables
  
  const adClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  
  if (!adClientId) {
    return (
      <aside className="py-6" aria-label="Espace publicitaire">
        <Container>
          <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-10 text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
              Publicité
            </p>
            <p className="mt-2 text-xs text-neutral-400">
              Espace réservé pour Google AdSense
            </p>
          </div>
        </Container>
      </aside>
    );
  }

  // When AdSense is configured, render actual ad unit
  return (
    <aside className="py-6" aria-label="Espace publicitaire">
      <Container>
        <div className="mx-auto max-w-3xl">
          <ins
            className="adsbygoogle"
            style={{ display: 'block', textAlign: 'center' }}
            data-ad-layout="in-article"
            data-ad-format="fluid"
            data-ad-client={adClientId}
            data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME || ''}
          />
          <script>
            {(globalThis as any).adsbygoogle = (globalThis as any).adsbygoogle || []}
            {'(adsbygoogle = window.adsbygoogle || []).push({});'}
          </script>
        </div>
      </Container>
    </aside>
  );
}
