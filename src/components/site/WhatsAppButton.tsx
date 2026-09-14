"use client";

import { useRef } from "react";
import { MessageCircle } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";
import { company } from "@/lib/site";

/**
 * Floating chat button, same corner the old WordPress widget used
 * (fixed, 15px from the bottom-right on both desktop and mobile).
 *
 * It stays out of the way until the visitor has scrolled past the hero, then
 * pops in and keeps a slow halo pulsing so it stays noticeable without moving.
 * z-40 puts it under the mobile drawer (z-60), so opening the menu covers it
 * instead of letting it float over the overlay.
 */
export function WhatsAppButton() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const button = root.querySelector("[data-wa-button]");
      const halo = root.querySelector("[data-wa-halo]");
      if (!button) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.set(root, { scale: 0, opacity: 0, transformOrigin: "bottom right" });

        const reveal = gsap.to(root, {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
          paused: true,
        });

        const trigger = ScrollTrigger.create({
          start: 420,
          onEnter: () => reveal.play(),
          onLeaveBack: () => reveal.reverse(),
        });

        const pulse = gsap.to(halo, {
          scale: 1.9,
          opacity: 0,
          duration: 1.9,
          repeat: -1,
          ease: "power1.out",
        });

        return () => {
          trigger.kill();
          reveal.kill();
          pulse.kill();
        };
      });

      // No motion preference: just show it, no pop and no pulse.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(root, { scale: 1, opacity: 1 });
        gsap.set(halo, { opacity: 0 });
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className="fixed bottom-4 right-4 z-40 sm:bottom-5 sm:right-5">
      <a
        data-wa-button
        href={company.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat with ${company.name} on WhatsApp at ${company.whatsappDisplay}`}
        className="group relative flex items-center gap-0 overflow-hidden rounded-full bg-[#25d366] p-4 text-white shadow-xl shadow-[#25d366]/35 transition-[gap,padding,background-color] duration-300 hover:bg-[#1eb455] sm:hover:gap-2.5 sm:hover:pr-6"
      >
        <span
          data-wa-halo
          className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[#25d366]/45"
          aria-hidden="true"
        />

        <MessageCircle className="size-6 shrink-0" aria-hidden="true" />

        {/* Label slides open on hover — hidden on touch, where there is no hover
            and the extra width would crowd the screen. */}
        <span className="hidden max-w-0 whitespace-nowrap text-sm font-bold opacity-0 transition-all duration-300 group-hover:max-w-40 group-hover:opacity-100 sm:block">
          Chat with us
        </span>
      </a>
    </div>
  );
}
