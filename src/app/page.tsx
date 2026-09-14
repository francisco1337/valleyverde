import { Hero } from "@/components/home/Hero";
import { ClientStrip } from "@/components/home/ClientStrip";
import { Services } from "@/components/home/Services";
import { WhyUs } from "@/components/home/WhyUs";
import { VideoFeature } from "@/components/home/VideoFeature";
import { Process } from "@/components/home/Process";
import { Work } from "@/components/home/Work";
import { Testimonials } from "@/components/home/Testimonials";
import { QuoteCta } from "@/components/home/QuoteCta";
import { company, services } from "@/lib/site";

/** Rich result for a local service business — free SEO win over the old site. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LandscapingBusiness",
  name: company.name,
  description:
    "Family-owned commercial landscape maintenance company based in North Phoenix, Arizona.",
  telephone: company.phoneDisplay,
  areaServed: "Phoenix metropolitan area, Arizona",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Phoenix",
    addressRegion: "AZ",
    addressCountry: "US",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Commercial landscaping services",
    itemListElement: services.map((service) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: service.title },
    })),
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <ClientStrip />
      <Services />
      <WhyUs />
      <VideoFeature />
      <Process />
      <Work />
      <Testimonials />
      <QuoteCta />
    </>
  );
}
