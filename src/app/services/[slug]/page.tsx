import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Phone } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Faq } from "@/components/site/Faq";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { Magnetic } from "@/components/ui/Magnetic";
import { QuoteCta } from "@/components/home/QuoteCta";
import { company, getService, serviceSlugs, services } from "@/lib/site";

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      images: [service.image],
    },
  };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const others = services.filter((item) => item.slug !== service.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.metaDescription,
    provider: { "@type": "LandscapingBusiness", name: company.name, telephone: company.phoneDisplay },
    areaServed: "Phoenix metropolitan area, Arizona",
    mainEntity: {
      "@type": "FAQPage",
      mainEntity: service.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        kicker={service.heroKicker}
        title={service.heroTitle}
        body={service.heroBody}
        image={service.image}
        imageAlt={service.title}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/#services" },
          { label: service.shortTitle },
        ]}
      >
        <Magnetic className="mt-8 w-fit">
          <a
            href={company.phoneHref}
            className="inline-flex items-center gap-2.5 rounded-full bg-ember-500 px-7 py-4 text-base font-bold text-white shadow-xl shadow-ember-500/30 transition-colors hover:bg-ember-600"
          >
            <Phone className="size-5" aria-hidden="true" />
            Call {company.phoneDisplay}
          </a>
        </Magnetic>
      </PageHero>

      {/* Body sections, alternating text-left / text-right so a long page still
          has rhythm. */}
      <section className="bg-white py-20 lg:py-28">
        <div className="container-page flex flex-col gap-20 lg:gap-28">
          {service.sections.map((section, index) => (
            <div
              key={section.heading}
              className={[
                "grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
                index % 2 === 1 ? "lg:[&>figure]:order-first" : "",
              ].join(" ")}
            >
              <div>
                <SplitHeading
                  as="h2"
                  className="text-2xl font-extrabold leading-tight text-forest-950 sm:text-3xl lg:text-[2.1rem]"
                >
                  {section.heading}
                </SplitHeading>

                <Reveal delay={0.1}>
                  <p className="mt-5 leading-relaxed text-forest-950/70">{section.body}</p>
                </Reveal>

                {section.points ? (
                  <Reveal stagger each={0.07} className="mt-7 grid gap-3 sm:grid-cols-2">
                    {section.points.map((point) => (
                      <div
                        key={point}
                        className="flex items-start gap-2.5 text-sm font-medium text-forest-950/80"
                      >
                        <Check className="mt-0.5 size-4 shrink-0 text-sprout-500" aria-hidden="true" />
                        {point}
                      </div>
                    ))}
                  </Reveal>
                ) : null}
              </div>

              <Reveal>
                <figure className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                  <Image
                    src={
                      [service.image, "/images/worker-tree.webp", "/images/worker-irrigation.webp"][
                        index % 3
                      ]
                    }
                    alt={section.heading}
                    fill
                    sizes="(min-width: 1024px) 38rem, 100vw"
                    quality={85}
                    className="object-cover"
                  />
                </figure>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-sand-50 py-20 lg:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            align="left"
            eyebrow="Questions"
            title="What property managers usually ask"
          />
          <Reveal>
            <Faq items={service.faq} />
          </Reveal>
        </div>
      </section>

      {/* Other services */}
      <section className="bg-white py-20 lg:py-24">
        <div className="container-page">
          <SectionHeading eyebrow="Also available" title="The rest of what we do" />

          <Reveal stagger each={0.08} className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((item) => (
              <Link
                key={item.slug}
                href={`/services/${item.slug}`}
                className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-2xl bg-forest-900 p-6"
              >
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover opacity-60 transition-all duration-700 group-hover:scale-110 group-hover:opacity-45"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 to-transparent" />
                <h3 className="relative text-lg font-extrabold text-white">{item.title}</h3>
                <span className="relative mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-sprout-400">
                  Learn more
                  <span className="sr-only"> about {item.title}</span>
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      <QuoteCta />
    </>
  );
}
