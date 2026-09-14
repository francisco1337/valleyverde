"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { Maximize2 } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, EASE } from "@/lib/gsap";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Lightbox } from "@/components/site/Lightbox";
import { gallery } from "@/lib/site";

/**
 * Pinned horizontal gallery.
 *
 * On desktop the section pins and the strip of work travels sideways as the
 * page scrolls down — the vertical scroll distance is derived from the real
 * width of the track, so it never runs short or long. Below 1024px, and for
 * anyone who asked for reduced motion, the exact same markup falls back to a
 * normal wrapping grid: no pin, no horizontal scroll, nothing to get trapped in.
 */
export function Work() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const thumbs = useRef<(HTMLElement | null)[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // The lightbox needs the element it flew out of so it can fly back into it.
  const getThumb = useCallback((i: number) => thumbs.current[i] ?? null, []);

  useGSAP(
    () => {
      const wrapper = section.current;
      const strip = track.current;
      if (!wrapper || !strip) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const distance = () => strip.scrollWidth - wrapper.offsetWidth;

        const tween = gsap.to(strip, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            start: "top top",
            // Scroll one viewport-height per screenful of horizontal travel.
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Each tile counter-drifts a little inside its frame while the strip
        // moves, so the images feel like they have depth instead of sliding
        // past as one flat sheet.
        const inner = strip.querySelectorAll("[data-work-inner]");
        inner.forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: wrapper,
                start: "top top",
                end: () => `+=${distance()}`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        });

        return () => {
          tween.kill();
        };
      });

      // Small screens: plain reveal on the grid.
      mm.add("(max-width: 1023px)", () => {
        const tiles = strip.querySelectorAll("[data-work-tile]");
        gsap.set(tiles, { opacity: 0, y: 36 });

        ScrollTrigger.create({
          trigger: strip,
          start: "top 88%",
          once: true,
          onEnter: () =>
            gsap.to(tiles, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: EASE,
              stagger: 0.08,
              clearProps: "transform",
            }),
        });
      });
    },
    { scope: section },
  );

  return (
    <section
      id="work"
      ref={section}
      className="scroll-mt-24 overflow-hidden bg-sand-100 py-20 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-0"
    >
      <div className="container-page">
        <SectionHeading
          eyebrow="Our recent work"
          title="Properties we keep looking their best"
          body="Real jobs across the Valley — retail frontage, HOA common areas, campus grounds and office parks."
        />
      </div>

      <div className="mt-12 lg:mt-14">
        <div
          ref={track}
          className={[
            // Mobile: a wrapping grid. Desktop: one long horizontal strip.
            "grid grid-cols-2 gap-3 px-5 sm:gap-4",
            "lg:flex lg:w-max lg:gap-6 lg:px-[max(2rem,calc((100vw-80rem)/2))]",
          ].join(" ")}
        >
          {gallery.map((item, index) => (
            <figure
              key={item.src}
              data-work-tile
              ref={(el) => {
                thumbs.current[index] = el;
              }}
              className={[
                "group relative overflow-hidden rounded-2xl bg-forest-900",
                "aspect-[4/3]",
                // Alternating sizes on desktop give the strip a rhythm.
                index % 3 === 0
                  ? "lg:aspect-[3/4] lg:w-[22rem]"
                  : "lg:aspect-[4/3] lg:w-[30rem]",
              ].join(" ")}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                aria-label={`View larger: ${item.caption}`}
                className="absolute inset-0 z-10 cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sprout-400"
              />
              <div data-work-inner className="absolute inset-0 lg:scale-110">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 30rem, 50vw"
                  quality={82}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <span className="pointer-events-none absolute right-4 top-4 inline-flex size-9 scale-90 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                <Maximize2 className="size-4" aria-hidden="true" />
              </span>

              <figcaption className="pointer-events-none absolute inset-x-5 bottom-5 translate-y-3 text-sm font-semibold text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                {item.caption}
              </figcaption>
            </figure>
          ))}

          {/* Closing card — the strip ends on a call to action instead of an image. */}
          <div
            data-work-tile
            className="col-span-2 flex flex-col justify-center rounded-2xl bg-forest-900 p-8 text-white lg:aspect-[4/3] lg:w-[26rem] lg:p-10"
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sprout-400">
              Your property next
            </p>
            <p className="mt-4 text-2xl font-extrabold leading-tight lg:text-3xl">
              Every one of these started with a walk-through.
            </p>
            <a
              href="#quote"
              className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-ember-500 px-6 py-3 text-sm font-bold transition hover:bg-ember-600"
            >
              Book yours
              <span className="sr-only"> — request a free property walk-through</span>
            </a>
          </div>
        </div>
      </div>

      <Lightbox
        items={gallery}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
        getThumb={getThumb}
      />
    </section>
  );
}
