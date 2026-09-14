"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type CounterProps = {
  to: number;
  suffix?: string;
  className?: string;
};

/**
 * Counts up from zero when it scrolls into view.
 * Renders the final value in the SSR markup so no-JS visitors and crawlers
 * still see the real number.
 */
export function Counter({ to, suffix = "", className }: CounterProps) {
  const el = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const node = el.current;
      if (!node) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const counter = { value: 0 };

        gsap.to(counter, {
          value: to,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: () => {
            node.textContent = `${Math.round(counter.value)}${suffix}`;
          },
          scrollTrigger: { trigger: node, start: "top 90%", once: true },
        });
      });
    },
    { dependencies: [to, suffix] },
  );

  return (
    <span ref={el} className={className}>
      {to}
      {suffix}
    </span>
  );
}
