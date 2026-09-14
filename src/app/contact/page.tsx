import type { Metadata } from "next";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { QuoteCta } from "@/components/home/QuoteCta";
import { ServiceAreaMap } from "@/components/site/ServiceAreaMap";
import { company, services } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Request a free quote from Valley Verde Landscaping. Commercial landscape maintenance across Phoenix, Scottsdale, Paradise Valley, Tempe and the greater Valley.",
  alternates: { canonical: "/contact" },
};

const facts = [
  {
    icon: Phone,
    label: "Call us",
    value: company.phoneDisplay,
    href: company.phoneHref,
  },
  {
    icon: MapPin,
    label: "Based in",
    value: company.city,
  },
  {
    icon: Clock,
    label: "Response time",
    value: "Within one business day",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: company.whatsappDisplay,
    href: company.whatsappHref,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        kicker="Contact"
        title="Us"
        body="Tell us about the property. We will schedule an on-site walk-through, write up an easy-to-understand proposal, and guarantee you a reasonable price."
        image="/images/svc-maintenance.webp"
        imageAlt="Maintained commercial landscaping in Phoenix, Arizona"
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="container-page">
          <Reveal stagger each={0.08} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map(({ icon: Icon, label, value, href }) => {
              const content = (
                <>
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="mt-4 block text-xs font-bold uppercase tracking-[0.16em] text-forest-950/45">
                    {label}
                  </span>
                  <span className="mt-1 block text-lg font-extrabold text-forest-950">
                    {value}
                  </span>
                </>
              );

              return href ? (
                <a
                  key={label}
                  href={href}
                  className="rounded-3xl border border-sand-200 p-7 transition hover:border-sprout-400/60 hover:shadow-lg hover:shadow-forest-950/5"
                >
                  {content}
                </a>
              ) : (
                <div key={label} className="rounded-3xl border border-sand-200 p-7">
                  {content}
                </div>
              );
            })}
          </Reveal>
        </div>
      </section>

      <QuoteCta />

      {/* Service area */}
      <section className="bg-forest-900 py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading
            tone="dark"
            eyebrow="Service area"
            title="Arizona communities we service"
            body="If your property sits anywhere in the Valley of the Sun, we can most likely get a crew to it."
          />

          <div className="mx-auto mt-12 max-w-4xl lg:mt-16">
            <ServiceAreaMap />
          </div>
        </div>
      </section>

      {/* What we can quote */}
      <section className="bg-white py-16 lg:py-20">
        <div className="container-page">
          <Reveal>
            <p className="text-center text-sm font-bold uppercase tracking-[0.18em] text-forest-700">
              We quote all five services
            </p>
          </Reveal>
          <Reveal stagger each={0.07} className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-3">
            {services.map((service) => (
              <span key={service.slug} className="text-lg font-bold text-forest-950/70">
                {service.title}
              </span>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
