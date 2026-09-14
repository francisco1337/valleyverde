"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

type FaqProps = {
  items: { q: string; a: string }[];
};

/**
 * Accordion with a height tween rather than a CSS transition, because `auto`
 * height is not animatable in CSS and a fixed max-height either clips long
 * answers or eases at the wrong speed for short ones.
 */
export function Faq({ items }: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      const panels = Array.from(
        root.querySelectorAll<HTMLElement>("[data-faq-panel]"),
      );

      mm.add(MOTION_OK, () => {
        panels.forEach((panel, index) => {
          const isOpen = index === openIndex;
          gsap.to(panel, {
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0,
            duration: 0.45,
            ease: "power2.inOut",
          });
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        panels.forEach((panel, index) => {
          gsap.set(panel, {
            height: index === openIndex ? "auto" : 0,
            opacity: index === openIndex ? 1 : 0,
          });
        });
      });
    },
    { scope, dependencies: [openIndex] },
  );

  return (
    <div ref={scope} className="divide-y divide-sand-200 border-y border-sand-200">
      {items.map((item, index) => {
        const isOpen = index === openIndex;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="flex w-full items-start justify-between gap-6 py-6 text-left"
              >
                <span className="text-lg font-bold text-forest-950">{item.q}</span>
                <span
                  className={[
                    "mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                    isOpen
                      ? "rotate-45 border-forest-700 bg-forest-700 text-white"
                      : "border-sand-300 text-forest-700",
                  ].join(" ")}
                  aria-hidden="true"
                >
                  <Plus className="size-4" />
                </span>
              </button>
            </h3>
            <div data-faq-panel className="overflow-hidden">
              <p className="pb-6 pr-14 leading-relaxed text-forest-950/70">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
