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

        const onMove = (event: PointerEvent) => {
          const rect = el.getBoundingClientRect();
          const relX = event.clientX - (rect.left + rect.width / 2);
          const relY = event.clientY - (rect.top + rect.height / 2);
          xTo((relX / rect.width) * strength * 2);
          yTo((relY / rect.height) * strength * 2);
        };

        const onLeave = () => {
          xTo(0);
          yTo(0);
        };

        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);

        return () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
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
