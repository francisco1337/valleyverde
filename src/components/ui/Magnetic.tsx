"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, DESKTOP_MOTION } from "@/lib/gsap";

type MagneticProps = {
  children: ReactNode;
  /** How far the element is allowed to drift toward the pointer, in px. */
  strength?: number;
  className?: string;
};

/**
 * Pulls its child a little toward the cursor while the pointer is over it.
 *
 * Uses `gsap.quickTo()` rather than a tween per pointermove: quickTo keeps one
 * live tween and just updates its target value, so a 120 Hz pointer stream
 * costs almost nothing. Pointer-only and desktop-only — on a touch screen
 * there is no cursor to attract, and the handler would just add jank.
 */
export function Magnetic({ children, strength = 14, className }: MagneticProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = scope.current?.firstElementChild as HTMLElement | null;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(DESKTOP_MOTION, () => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

        /**
         * The box is measured once when the pointer arrives, not on every move.
         *
         * Measuring per move was a forced reflow every single frame: the tween
         * writes a transform, the next move reads geometry, and the browser has
         * to flush layout in between. Caching also removes a feedback loop —
         * `getBoundingClientRect()` includes the transform, so as the element
         * drifted toward the cursor its own centre moved with it and the pull
         * damped itself. The untransformed box is the honest reference.
         */
        let rect: DOMRect | null = null;

        const onEnter = () => {
          rect = el.getBoundingClientRect();
        };

        const onMove = (event: PointerEvent) => {
          if (!rect) rect = el.getBoundingClientRect();
          const relX = event.clientX - (rect.left + rect.width / 2);
          const relY = event.clientY - (rect.top + rect.height / 2);
          xTo((relX / rect.width) * strength * 2);
          yTo((relY / rect.height) * strength * 2);
        };

        const onLeave = () => {
          rect = null;
          xTo(0);
          yTo(0);
        };

        // The cached box is in viewport coordinates, so scrolling or resizing
        // while hovering invalidates it. Both are passive and just drop the
        // cache; the next move re-measures once.
        const invalidate = () => {
          if (rect) rect = null;
        };

        el.addEventListener("pointerenter", onEnter);
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        window.addEventListener("scroll", invalidate, { passive: true });
        window.addEventListener("resize", invalidate);

        return () => {
          el.removeEventListener("pointerenter", onEnter);
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
          window.removeEventListener("scroll", invalidate);
          window.removeEventListener("resize", invalidate);
        };
      });
    },
    { scope, dependencies: [strength] },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
