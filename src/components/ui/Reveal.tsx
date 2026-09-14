"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP, EASE } from "@/lib/gsap";

type RevealProps = {
  children: ReactNode;
  /** Animate each direct child in sequence instead of the wrapper as a block. */
  stagger?: boolean;
  /** Seconds to wait before starting. */
  delay?: number;
  /** Distance in px the element travels up into place. */
  y?: number;
  /** Extra scale-up on the way in — used for image tiles. */
  scaleFrom?: number;
  /** Seconds between staggered children. */
  each?: number;
  className?: string;
};

/**
 * Scroll-triggered fade + rise.
 *
 * Deliberately `set` + `to` rather than `gsap.from()`. A `from()` tween records
 * its end values when it is created; if ScrollTrigger later refreshes (fonts
 * land, a lazy image resizes the page, the viewport changes) that recording can
 * be invalidated on a trigger that has already fired and will never fire again,
 * stranding the element at opacity 0. Animating *to* an explicit final state is
 * immune to that — the worst case is an element that appears without moving.
 *
 * The markup still ships visible, so the page reads correctly with JavaScript
 * disabled; the hidden state is only applied once GSAP is running.
 */
export function Reveal({
  children,
  stagger = false,
  delay = 0,
  y = 28,
  scaleFrom = 1,
  each = 0.1,
  className,
}: RevealProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const targets = stagger
          ? (Array.from(root.children) as HTMLElement[])
          : [root];
        if (!targets.length) return;

        gsap.set(targets, { opacity: 0, y, scale: scaleFrom });

        ScrollTrigger.create({
          trigger: root,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.to(targets, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.85,
              ease: EASE,
              delay,
              stagger: stagger ? each : 0,
              // Drop the inline transform once we are done so hover effects and
              // sticky/absolute children are not stuck inside a stacking context.
              clearProps: "transform",
            });
          },
        });
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
