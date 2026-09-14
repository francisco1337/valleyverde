import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { Testimonials } from "@/components/home/Testimonials";
import { Process } from "@/components/home/Process";
import { QuoteCta } from "@/components/home/QuoteCta";
import { about, clientTypes, company, stats } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Valley Verde Landscaping is a family-owned commercial landscape maintenance company based in North Phoenix, serving the Valley of the Sun for over 20 years.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        kicker={about.heroKicker}
        title={about.heroTitle}
        body={about.heroBody}
        image="/images/about-hero.webp"
        imageAlt="The Valley Verde Landscaping crew on a commercial property"
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      {/* Story */}
      <section className="bg-white py-20 lg:py-28">
        <div className="container-page grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div>
            <SplitHeading
              as="h2"
              className="text-3xl font-extrabold leading-tight text-forest-950 sm:text-4xl"
            >
              Family-owned, and still answering the phone ourselves
            </SplitHeading>

            <Reveal stagger each={0.12} className="mt-7 space-y-5">
              {about.story.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="leading-relaxed text-forest-950/70">
                  {paragraph}
                </p>
              ))}
            </Reveal>

            <Reveal delay={0.2}>
              <blockquote className="mt-10 border-l-4 border-ember-500 pl-6">
                <p className="text-2xl font-extrabold leading-snug text-forest-950 sm:text-3xl">
                  &ldquo;{about.pullQuote}&rdquo;
                </p>
                <footer className="mt-3 text-sm font-semibold text-forest-950/55">
                  Aurelio Olivera · Owner
                </footer>
              </blockquote>
            </Reveal>
          </div>

          <Reveal>
            <div className="relative">
              <div className="overflow-hidden rounded-3xl">
                <Image
                  src="/images/worker-tree.webp"
                  alt="Valley Verde crew members on a commercial property in Phoenix"
                  width={1000}
                  height={562}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="mt-6 overflow-hidden rounded-3xl">
                <Image
                  src="/images/aurelio.webp"
                  alt="Aurelio Olivera, owner of Valley Verde Landscaping"
                  width={600}
                  height={554}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="h-full w-full bg-sand-100 object-cover"
                />
              </div>

              <ul className="mt-8 space-y-2.5">
                <li className="text-xs font-bold uppercase tracking-[0.18em] text-forest-700">
                  Who we maintain
                </li>
                {clientTypes.map((type) => (
                  <li
                    key={type}
                    className="border-b border-sand-200 pb-2.5 text-sm font-medium text-forest-950/70"
                  >
                    {type}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-forest-900 py-16 text-white lg:py-20">
        <div className="container-page">
          <Reveal stagger className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center lg:text-left">
                <p className="text-4xl font-extrabold tracking-tight text-sprout-400 sm:text-5xl">
                  <Counter to={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-sm leading-snug text-forest-100/70">{stat.label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="bg-sand-50 py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="How we work"
            title="Licensed, insured, and easy to reach"
            body={`We are licensed by the State of Arizona and insured for both Workers' Compensation and liability protection — serving ${company.city} and the greater Valley.`}
          />

          <Reveal stagger each={0.1} className="mt-14 grid gap-6 lg:grid-cols-3">
            {about.values.map((value, index) => (
              <div
                key={value.title}
                className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-forest-950/5"
              >
                <span className="text-sm font-extrabold text-ember-500">
                  0{index + 1}
                </span>
                <h3 className="mt-4 text-xl font-bold text-forest-950">{value.title}</h3>
                <p className="mt-3 leading-relaxed text-forest-950/70">{value.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <Process />
      <Testimonials />
      <QuoteCta />
    </>
  );
}
