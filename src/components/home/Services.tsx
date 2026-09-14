import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Droplets, Leaf, Shovel, Sparkles, Trees } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TiltCard } from "@/components/ui/TiltCard";
import { services, type ServiceIconName } from "@/lib/site";

const ICONS: Record<ServiceIconName, typeof Leaf> = {
  leaf: Leaf,
  trees: Trees,
  sparkles: Sparkles,
  shovel: Shovel,
  droplets: Droplets,
};

export function Services() {
  return (
    <section id="services" className="scroll-mt-24 bg-sand-50 py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="What we do"
          title="Five services, one crew, one point of contact"
          body="Bundle them or pick what your property needs today. Everything we do is backed by a 100% guarantee."
        />

        <Reveal
          stagger
          y={44}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3"
        >
          {services.map((service, index) => {
            const Icon = ICONS[service.icon];
            // The first card spans two columns so the grid does not read as a
            // flat 3-up — it gives the eye somewhere to land first.
            const featured = index === 0;

            return (
              <TiltCard
                key={service.slug}
                max={featured ? 4 : 6}
                className={featured ? "lg:col-span-2" : ""}
              >
                <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-forest-950/5 transition-shadow duration-300 hover:shadow-2xl hover:shadow-forest-950/10">
                  {/* Sheen follows the pointer via the CSS vars TiltCard sets. */}
                  <div
                    className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(420px circle at var(--sheen-x,50%) var(--sheen-y,50%), rgb(255 255 255 / 0.18), transparent 45%)",
                    }}
                    aria-hidden="true"
                  />

                  <div
                    className={[
                      "relative overflow-hidden",
                      featured ? "aspect-[16/9] lg:aspect-[2.4/1]" : "aspect-[16/10]",
                    ].join(" ")}
                  >
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes={featured ? "(min-width: 1024px) 56rem, (min-width: 640px) 50vw, 100vw" : "(min-width: 1024px) 26rem, (min-width: 640px) 50vw, 100vw"}
                    quality={82}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950/75 via-forest-950/10 to-transparent" />
                    <span className="absolute left-5 top-5 inline-flex size-11 items-center justify-center rounded-2xl bg-white/95 text-forest-700 shadow-lg backdrop-blur transition-transform duration-500 group-hover:-translate-y-1">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="absolute bottom-5 left-5 right-5 text-xl font-extrabold text-white sm:text-2xl">
                      {service.title}
                    </h3>
                  </div>

                  <div className="flex flex-1 flex-col p-6 lg:p-7">
                    <p className="text-[0.95rem] leading-relaxed text-forest-950/70">
                      {service.blurb}
                    </p>

                    <ul
                      className={[
                        "mt-5 space-y-2.5",
                        featured ? "lg:grid lg:grid-cols-3 lg:gap-4 lg:space-y-0" : "",
                      ].join(" ")}
                    >
                      {service.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex items-start gap-2.5 text-sm font-medium text-forest-950/80"
                        >
                          <Check
                            className="mt-0.5 size-4 shrink-0 text-sprout-500"
                            aria-hidden="true"
                          />
                          {bullet}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/services/${service.slug}`}
                      className="mt-6 inline-flex items-center gap-1.5 self-start text-sm font-bold text-forest-700 transition hover:text-ember-500"
                    >
                      Learn more
                      <span className="sr-only"> about {service.title}</span>
                      <ArrowUpRight
                        className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </article>
              </TiltCard>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
