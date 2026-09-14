"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, EASE } from "@/lib/gsap";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps } from "@/lib/site";

export function Process() {
  const scope = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const list = scope.current;
      const track = line.current;
      if (!list || !track) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The connecting line draws itself as the section scrolls past.
        gsap.fromTo(
          track,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: list,
              start: "top 70%",
              end: "bottom 80%",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        );

        const steps = list.querySelectorAll("[data-process-step]");
        gsap.set(steps, { opacity: 0, x: -28 });

        ScrollTrigger.create({
          trigger: list,
          start: "top 80%",
          once: true,
          onEnter: () =>
            gsap.to(steps, {
              opacity: 1,
              x: 0,
              duration: 0.7,
              ease: EASE,
              stagger: 0.1,
              clearProps: "transform",
            }),
        });
      });
    },
    { scope },
  );

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="How it works"
          title="No mystery, no surprise invoices"
          body="The same six steps for every property we take on — from the first phone call to the day our crew shows up."
        />

        <div ref={scope} className="relative mx-auto mt-14 max-w-3xl lg:mt-16">
          {/* Track + animated progress line */}
          <div
            className="absolute left-[1.4rem] top-3 hidden h-[calc(100%-2rem)] w-0.5 bg-sand-200 sm:block"
            aria-hidden="true"
          >
            <div
              ref={line}
              className="h-full w-full origin-top bg-gradient-to-b from-sprout-400 to-forest-700"
            />
          </div>

          <ol className="space-y-8">
            {processSteps.map((item) => (
              <li
                key={item.step}
                data-process-step
                className="relative flex flex-col gap-4 sm:flex-row sm:gap-7"
              >
                <span className="relative z-10 inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-forest-700 text-sm font-extrabold text-white ring-8 ring-white">
                  {item.step}
                </span>
                <div className="pt-1.5">
                  <h3 className="text-lg font-bold text-forest-950">{item.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-forest-950/65">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
