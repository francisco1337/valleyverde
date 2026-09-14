import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SiteShell } from "@/components/site/SiteShell";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { company } from "@/lib/site";

/**
 * Montserrat, self-hosted. The variable woff2 files come from the legacy site's
 * own font cache, so the build needs no network and the live site makes zero
 * requests to Google — one less third party and one less round trip.
 */
const montserrat = localFont({
  src: [
    { path: "./fonts/Montserrat-Variable.woff2", weight: "100 900", style: "normal" },
    { path: "./fonts/Montserrat-Variable-Italic.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-montserrat",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://valleyverde.com"),
  title: {
    default: `${company.name} — Commercial Landscaping in Phoenix, Arizona`,
    template: `%s | ${company.name}`,
  },
  description:
    "Family-owned commercial landscape maintenance in North Phoenix. Retail centers, HOAs, schools and office parks across Phoenix, Scottsdale, Paradise Valley and Tempe. Licensed and insured, 20+ years.",
  keywords: [
    "commercial landscaping Phoenix",
    "landscape maintenance Arizona",
    "HOA landscaping Scottsdale",
    "tree trimming Phoenix",
    "drip irrigation Arizona",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: company.name,
    title: `${company.name} — Commercial Landscaping in Phoenix, Arizona`,
    description:
      "Commercial landscape maintenance, tree trimming, clean ups, improvements and irrigation across the Valley of the Sun.",
    images: ["/images/hero.webp"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#034a06",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SiteShell header={<Header />} footer={<Footer />} floating={<WhatsAppButton />}>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
