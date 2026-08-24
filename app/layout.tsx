import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "JobBoard - Trouvez votre emploi de rêve en Afrique",
    template: "%s | JobBoard",
  },
  description:
    "La première plateforme d'emploi dédiée aux professionnels en Afrique. Découvrez des opportunités de carrière dans divers secteurs.",
  keywords: ["emploi", "recrutement", "Afrique", "carrière", "stage", "travail"],
  authors: [{ name: "JobBoard Team" }],
  creator: "JobBoard",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://job-board-delta-six.vercel.app/",
    siteName: "JobBoard",
    title: "JobBoard - Trouvez votre emploi de rêve",
    description: "La première plateforme d'emploi dédiée aux professionnels en Afrique.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JobBoard Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JobBoard - Trouvez votre emploi de rêve",
    description: "La première plateforme d'emploi dédiée aux professionnels en Afrique.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  ...(process.env.NEXT_PUBLIC_SITE_URL
    ? { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL) }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        {/* Google AdSense - Add your publisher ID in environment variables */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
