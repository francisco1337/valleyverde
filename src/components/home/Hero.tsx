"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, BadgeCheck, MousePointer2, Phone, ShieldCheck, Star } from "lucide-react";
import { gsap, SplitText, useGSAP, EASE, MOTION_OK } from "@/lib/gsap";
import { HeroMedia } from "@/components/home/HeroMedia";
import { Magnetic } from "@/components/ui/Magnetic";
import { company } from "@/lib/site";

const trustChips = [
  { icon: ShieldCheck, label: "Licensed & insured in Arizona" },
  { icon: BadgeCheck, label: "100% guaranteed work" },
  { icon: Star, label: `${company.yearsInBusiness}+ years in the Valley` },
];

export function Hero() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const headline = root.querySelector("[data-hero-headline]") as HTMLElement | null;
        const eyebrow = q("[data-hero-eyebrow]");
        const body = q("[data-hero-body]");
        const ctas = q("[data-hero-cta] > *");
        const chips = q("[data-hero-chip]");
        const image = q("[data-hero-image]");
        const scrollCue = q("[data-hero-cue]");

        // Word-level split: each word rides up out of its own mask and
        // un-skews as it lands, which gives the headline weight without the
        // ransom-note look of per-character animation.
        const split = headline
          ? new SplitText(headline, { type: "words", mask: "words" })
          : null;
        const words = split?.words ?? [];

        gsap.set(words, { yPercent: 120, opacity: 0, rotate: 4 });
        gsap.set([...eyebrow, ...body], { opacity: 0, y: 20 });
        gsap.set([...ctas, ...chips], { opacity: 0, y: 22 });
        gsap.set(scrollCue, { opacity: 0 });

        const tl = gsap.timeline({ defaults: { ease: EASE } });

        tl.fromTo(image, { scale: 1.14 }, { scale: 1, duration: 2, ease: "power2.out" }, 0)
          .to(eyebrow, { opacity: 1, y: 0, duration: 0.7 }, 0.1)
          .to(
            words,
            { yPercent: 0, opacity: 1, rotate: 0, duration: 1, stagger: 0.055 },
            0.2,
          )
          .to(body, { opacity: 1, y: 0, duration: 0.8 }, 0.8)
          .to(ctas, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, 0.95)
          .to(chips, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, 1.1)
          .to(scrollCue, { opacity: 1, duration: 0.6 }, 1.4);

        // The cue bobs until the visitor scrolls, then gets out of the way.
        gsap.to(scrollCue, {
          y: 9,
          duration: 1.1,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        // Two speeds on scroll: the background drifts down, the copy lifts and
        // fades. Together they read as depth rather than a flat image scroll.
        gsap.to(image, {
          yPercent: 16,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
        });

        gsap.to(q("[data-hero-copy]"), {
          yPercent: -14,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
        });

        return () => {
          tl.kill();
          split?.revert();
        };
      });
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      className="relative -mt-20 flex min-h-[42rem] items-center overflow-hidden lg:min-h-[46rem]"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <HeroMedia />
        {/* Neutral scrim first so the footage keeps its own colour, then a
            light brand tint on top. A heavy green wash made it look like a
            filter rather than a real property. */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/10 to-forest-950/45" />
      </div>

      <div className="container-page relative w-full pb-20 pt-32 lg:pb-24 lg:pt-36">
        <div data-hero-copy className="max-w-3xl">
          <p
            data-hero-eyebrow
            className="inline-flex items-center gap-2 rounded-full border border-sprout-400/40 bg-sprout-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-sprout-300 backdrop-blur-sm"
          >
            Commercial landscaping · {company.city}
          </p>

          <h1
            data-hero-headline
            className="mt-6 text-[2.6rem] font-extrabold leading-[1.05] text-white sm:text-6xl lg:text-7xl"
          >
            Your property is your first{" "}
            <span className="text-sprout-400">impression.</span>
          </h1>

          <p
            data-hero-body
            className="mt-6 max-w-xl text-lg leading-relaxed text-forest-100/90 sm:text-xl"
          >
            Retail centers, HOAs, schools and office parks across Phoenix, Scottsdale
            and Tempe trust us to keep their grounds sharp — so they can focus on the
            business inside the building.
          </p>

          <div data-hero-cta className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Magnetic>
              <a
                href={company.phoneHref}
                className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-ember-500 px-7 py-4 text-base font-bold text-white shadow-xl shadow-ember-500/30 transition-colors hover:bg-ember-600 sm:w-auto"
              >
                <Phone
                  className="size-5 transition-transform group-hover:-rotate-12"
                  aria-hidden="true"
                />
                Call {company.phoneDisplay}
              </a>
            </Magnetic>

            <Magnetic>
              <Link
                href="#quote"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-white/30 px-7 py-4 text-base font-bold text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white/10 sm:w-auto"
              >
                Request a free quote
                <ArrowRight
                  className="size-5 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </Magnetic>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3">
            {trustChips.map(({ icon: Icon, label }) => (
              <li
                key={label}
                data-hero-chip
                className="inline-flex items-center gap-2 text-sm font-medium text-forest-100/80"
              >
                <Icon className="size-4 text-sprout-400" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        data-hero-cue
        className="absolute inset-x-0 bottom-7 hidden justify-center lg:flex"
        aria-hidden="true"
      >
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
          <MousePointer2 className="size-3.5" />
          Scroll
        </span>
      </div>
    </section>
  );
}
