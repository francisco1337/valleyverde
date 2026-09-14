"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, DESKTOP_MOTION } from "@/lib/gsap";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees at the corners. Keep it small — 6–10 reads as depth, 20 reads as a toy. */
  max?: number;
};

/**
 * Subtle 3D tilt that tracks the pointer, plus a light sheen that follows it.
 *
 * `quickTo` again, so pointermove never allocates a new tween. Desktop and
 * pointer-only: a tilt triggered by a tap is just a glitch.
 */
export function TiltCard({ children, className, max = 7 }: TiltCardProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const card = scope.current;
      if (!card) return;

      const mm = gsap.matchMedia();

      mm.add(DESKTOP_MOTION, () => {
        const rotX = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3.out" });
        const rotY = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3.out" });

        gsap.set(card, { transformPerspective: 900, transformOrigin: "center" });

        // Measured on arrival, not per move — see the note in Magnetic. This
        // one was the worse of the two: the handler also wrote the two sheen
        // custom properties, so every frame was a write followed by a read,
        // which is the textbook layout thrash.
        let rect: DOMRect | null = null;

        const onEnter = () => {
          rect = card.getBoundingClientRect();
        };

        const onMove = (event: PointerEvent) => {
          if (!rect) rect = card.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width - 0.5;
          const py = (event.clientY - rect.top) / rect.height - 0.5;
          rotY(px * max * 2);
          rotX(-py * max * 2);
          card.style.setProperty("--sheen-x", `${(px + 0.5) * 100}%`);
          card.style.setProperty("--sheen-y", `${(py + 0.5) * 100}%`);
        };

        const onLeave = () => {
          rect = null;
          rotX(0);
          rotY(0);
        };

        const invalidate = () => {
          if (rect) rect = null;
        };

        card.addEventListener("pointerenter", onEnter);
        card.addEventListener("pointermove", onMove);
        card.addEventListener("pointerleave", onLeave);
        window.addEventListener("scroll", invalidate, { passive: true });
        window.addEventListener("resize", invalidate);

        return () => {
          card.removeEventListener("pointerenter", onEnter);
          card.removeEventListener("pointermove", onMove);
          card.removeEventListener("pointerleave", onLeave);
          window.removeEventListener("scroll", invalidate);
          window.removeEventListener("resize", invalidate);
        };
      });
    },
    { scope, dependencies: [max] },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
