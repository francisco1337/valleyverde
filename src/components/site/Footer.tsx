import Image from "next/image";
import Link from "next/link";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { Marquee } from "@/components/site/Marquee";
import { communities, company, services } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-forest-950 text-forest-100">
      <div className="container-page py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Image
              src="/logo-white.webp"
              alt={company.name}
              width={520}
              height={220}
              className="h-10 w-auto"
            />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-forest-100/65">
              From commercial landscape maintenance and tree trimming to property
              clean ups, erosion damage repairs and irrigation service — you can count
              on {company.name} for every part of your grounds.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href={company.phoneHref}
                className="inline-flex items-center gap-3 rounded-full bg-ember-500 px-6 py-3.5 text-base font-bold text-white transition hover:bg-ember-600"
              >
                <Phone className="size-4" aria-hidden="true" />
                {company.phoneDisplay}
              </a>
              <a
                href={company.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/20 px-5 py-3.5 text-sm font-bold text-white transition hover:border-[#25d366] hover:text-[#25d366]"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                WhatsApp
              </a>
            </div>
          </div>

          <nav aria-label="Services">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-sprout-400">
              Services
            </h2>
            <ul className="mt-5 space-y-3">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm text-forest-100/70 transition hover:text-white"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-sprout-400">
              Company
            </h2>
            <ul className="mt-5 space-y-3">
              {[
                { label: "About us", href: "/about" },
                { label: "Our work", href: "/#work" },
                { label: "Why choose us", href: "/#why-us" },
                { label: "Contact", href: "/contact" },
                { label: "Request a quote", href: "/contact#quote" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-forest-100/70 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="mt-8 flex items-start gap-2 text-sm text-forest-100/60">
              <MapPin className="mt-0.5 size-4 shrink-0 text-sprout-400" aria-hidden="true" />
              {company.city}
            </p>
          </nav>
        </div>

        <div className="mt-14 border-t border-white/10 pt-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-sprout-400">
            Arizona communities we service
          </h2>
          <div className="mt-5">
            <Marquee items={communities} />
          </div>
          {/* The ticker is decorative; the real list stays in the DOM for
              crawlers and for anyone not seeing the animation. */}
          <ul className="sr-only">
            {communities.map((place) => (
              <li key={place}>{place}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-forest-100/50 sm:flex-row">
          <p>
            © {year} {company.name}. All rights reserved.
          </p>
          <p>Licensed &amp; insured in the State of Arizona</p>
        </div>
      </div>
    </footer>
  );
}
