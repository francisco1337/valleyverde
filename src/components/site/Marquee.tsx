"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

type MarqueeProps = {
  items: readonly string[];
  /** Seconds for one full pass. Bigger is slower. */
  duration?: number;
};

/**
 * Infinite horizontal ticker.
 *
 * The list is rendered twice and the track is moved by exactly -50%, so the
 * second copy lands where the first started and the wrap is invisible. GSAP's
 * `repeat: -1` on a single tween means no per-frame JS and no layout thrash.
 */
export function Marquee({ items, duration = 38 }: MarqueeProps) {
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = track.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const tween = gsap.to(el, {
          xPercent: -50,
          duration,
          ease: "none",
          repeat: -1,
        });

        // Pause on hover so a reader can actually read a city name.
        const pause = () => tween.pause();
        const resume = () => tween.resume();
        el.addEventListener("pointerenter", pause);
        el.addEventListener("pointerleave", resume);

        return () => {
          el.removeEventListener("pointerenter", pause);
          el.removeEventListener("pointerleave", resume);
          tween.kill();
        };
      });
    },
    { dependencies: [duration] },
  );

  const doubled = [...items, ...items];

  return (
    <div
      className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6rem,black_calc(100%-6rem),transparent)]"
      aria-hidden="true"
    >
      <div ref={track} className="flex w-max items-center gap-8 py-1">
        {doubled.map((item, index) => (
          <span key={`${item}-${index}`} className="flex shrink-0 items-center gap-8">
            <span className="text-sm font-semibold text-forest-100/55">{item}</span>
            <span className="size-1 rounded-full bg-sprout-400/50" />
          </span>
        ))}
      </div>
    </div>
  );
}
