import Image from "next/image";
import { Quote, Star } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials } from "@/lib/site";

export function Testimonials() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="What clients say"
          title="Property managers who have stayed for years"
          body="These are the people who sign off on our invoices — and who refer us to the next property."
        />

        <Reveal stagger y={36} className="mt-14 grid gap-5 lg:mt-16 lg:grid-cols-3 lg:gap-6">
          {testimonials.slice(0, 3).map((item) => (
            <TestimonialCard key={item.name} {...item} />
          ))}
        </Reveal>

        <Reveal stagger y={36} className="mt-5 grid gap-5 lg:grid-cols-2 lg:gap-6">
          {testimonials.slice(3).map((item) => (
            <TestimonialCard key={item.name} {...item} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function TestimonialCard({ quote, name, role, avatar }: (typeof testimonials)[number]) {
  return (
    <figure className="flex h-full flex-col rounded-3xl border border-sand-200 bg-sand-50 p-7 transition hover:border-sprout-400/50 hover:shadow-lg hover:shadow-forest-950/5">
      <Quote className="size-7 shrink-0 text-sprout-400" aria-hidden="true" />

      <blockquote className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-forest-950/80">
        {quote}
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-3 border-t border-sand-200 pt-5">
        <Image
          src={avatar}
          alt=""
          width={160}
          height={160}
          sizes="2.75rem"
          className="size-11 rounded-full bg-sand-200 object-cover"
        />
        <div className="min-w-0">
          <p className="truncate font-bold text-forest-950">{name}</p>
          <p className="truncate text-sm text-forest-950/55">{role}</p>
        </div>
        <div className="ml-auto flex gap-0.5" aria-label="Rated 5 out of 5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="size-3.5 fill-ember-500 text-ember-500" aria-hidden="true" />
          ))}
        </div>
      </figcaption>
    </figure>
  );
}
