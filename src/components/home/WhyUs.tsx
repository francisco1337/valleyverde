import Image from "next/image";
import { Clock, MessageSquare, ShieldCheck, Users } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { company, differentiators, stats } from "@/lib/site";

const ICONS = {
  shield: ShieldCheck,
  clock: Clock,
  users: Users,
  message: MessageSquare,
} as const;

export function WhyUs() {
  return (
    <section id="why-us" className="scroll-mt-24 bg-forest-900 py-20 text-white lg:py-28">
      <div className="container-page">
        {/* Stats band */}
        <Reveal
          stagger
          className="grid grid-cols-2 gap-x-6 gap-y-10 border-b border-white/10 pb-14 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center lg:text-left">
              <p className="text-4xl font-extrabold tracking-tight text-sprout-400 sm:text-5xl">
                <Counter to={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-sm leading-snug text-forest-100/70">{stat.label}</p>
            </div>
          ))}
        </Reveal>

        <div className="mt-16 grid gap-14 lg:mt-20 lg:grid-cols-[1fr_1.15fr] lg:items-start lg:gap-20">
          {/* Left: images */}
          <Reveal className="relative">
            {/* The inset sits inside this wrapper so it can never drift over
                the quote card below it. */}
            <div className="relative">
              <div className="overflow-hidden rounded-3xl">
                <Image
                  src="/images/team.webp"
                  alt="The Valley Verde Landscaping crew in uniform on a commercial property"
                  width={1600}
                  height={1200}
                  sizes="(min-width: 1024px) 34rem, 100vw"
                  quality={85}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="absolute -bottom-6 -right-3 hidden w-44 overflow-hidden rounded-2xl border-4 border-forest-900 shadow-2xl sm:block lg:-right-6 lg:w-52">
                <Image
                  src="/images/worker-irrigation.webp"
                  alt="A Valley Verde technician servicing an irrigation valve box"
                  width={1000}
                  height={562}
                  sizes="13rem"
                  quality={85}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="mt-14 rounded-2xl border border-white/10 bg-white/5 p-6 lg:mt-16">
              <div className="flex items-center gap-4">
                <Image
                  src="/images/aurelio.webp"
                  alt="Aurelio Olivera, owner of Valley Verde Landscaping"
                  width={600}
                  height={554}
                  sizes="4rem"
                  className="size-16 shrink-0 rounded-full bg-forest-800 object-cover object-top"
                />
                <div>
                  <p className="font-bold">Aurelio Olivera</p>
                  <p className="text-sm text-forest-100/60">Owner, {company.name}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-forest-100/80">
                &ldquo;Our company is small enough to care and large enough to cover all
                your commercial landscape maintenance needs. It&rsquo;s our job to make
                you look good.&rdquo;
              </p>
            </div>
          </Reveal>

          {/* Right: differentiators */}
          <div>
            <SectionHeading
              align="left"
              tone="dark"
              eyebrow="Why property managers stay"
              title="Reliable is the whole product"
              body={`A family-owned company out of ${company.city}. Many of our clients have been with us for over ${company.longestClientYears} years — mostly because we show up when we said we would.`}
            />

            <Reveal stagger className="mt-10 grid gap-5 sm:grid-cols-2">
              {differentiators.map((item) => {
                const Icon = ICONS[item.icon];
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-sprout-400/40 hover:bg-white/[0.07]"
                  >
                    <span className="inline-flex size-11 items-center justify-center rounded-xl bg-sprout-400/15 text-sprout-400">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-forest-100/70">
                      {item.body}
                    </p>
                  </div>
                );
              })}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
