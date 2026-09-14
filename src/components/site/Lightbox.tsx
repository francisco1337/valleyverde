"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { gsap, Flip } from "@/lib/gsap";

export type LightboxItem = { src: string; alt: string; caption?: string };

type LightboxProps = {
  items: LightboxItem[];
  /** Index of the open item, or null when closed. */
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
  /** Returns the thumbnail element the given index was opened from. */
  getThumb: (index: number) => HTMLElement | null;
};

/**
 * Full-screen viewer that grows out of the thumbnail you clicked.
 *
 * The effect is GSAP Flip: we record the thumbnail's position and size, move
 * the *same* image element into the overlay, and let Flip work out the
 * transform between the two states. The image never cross-fades or jumps — it
 * physically travels from the grid to the centre of the screen, and back into
 * the grid on close. That is what Flip is for, and it is the reason the
 * transition survives the tile being a different aspect ratio than the viewer.
 *
 * Rendered through a portal to <body> for a specific reason: the gallery lives
 * inside a ScrollTrigger-pinned section, and a pinned element carries a
 * transform. A transformed ancestor becomes the containing block for
 * `position: fixed` descendants, so an overlay rendered in place would be
 * trapped inside the gallery instead of covering the viewport — the header and
 * the chat button would sit on top of it.
 */
export function Lightbox({ items, index, onClose, onNavigate, getThumb }: LightboxProps) {
  const overlay = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const open = index !== null;
  // Server renders nothing; the client portals once hydrated.
  const canPortal = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const close = useCallback(() => {
    const frameEl = frame.current;
    const overlayEl = overlay.current;
    if (!frameEl || !overlayEl || index === null) {
      onClose();
      return;
    }

    const thumb = getThumb(index);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!thumb || reduced) {
      gsap.to(overlayEl, { opacity: 0, duration: 0.2, onComplete: onClose });
      return;
    }

    // Fly back to the thumbnail we came from.
    const state = Flip.getState(frameEl);
    const rect = thumb.getBoundingClientRect();
    gsap.set(frameEl, {
      position: "fixed",
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      borderRadius: 16,
    });

    Flip.from(state, {
      duration: 0.45,
      ease: "power3.inOut",
      absolute: true,
      onComplete: onClose,
    });

    gsap.to(overlayEl.querySelectorAll("[data-lb-chrome]"), { opacity: 0, duration: 0.15 });
    gsap.to(overlayEl, { backgroundColor: "rgba(0,0,0,0)", duration: 0.45 });
  }, [getThumb, index, onClose]);

  // Open animation — layout effect so we measure before the browser paints.
  useLayoutEffect(() => {
    if (index === null) return;
    const frameEl = frame.current;
    const overlayEl = overlay.current;
    if (!frameEl || !overlayEl) return;

    const thumb = getThumb(index);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        overlayEl,
        { backgroundColor: "rgba(0,0,0,0)" },
        { backgroundColor: "rgba(1,21,3,0.94)", duration: 0.35 },
      );

      if (thumb && !reduced) {
        const rect = thumb.getBoundingClientRect();
        // Start life exactly where the thumbnail is…
        gsap.set(frameEl, {
          position: "fixed",
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          borderRadius: 16,
        });
        const state = Flip.getState(frameEl);
        // …then clear the overrides and let Flip animate to the final layout.
        gsap.set(frameEl, { clearProps: "position,top,left,width,height,borderRadius" });
        Flip.from(state, { duration: 0.5, ease: "power3.inOut", absolute: true });
      }

      gsap.fromTo(
        overlayEl.querySelectorAll("[data-lb-chrome]"),
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, delay: 0.2, stagger: 0.05 },
      );
    }, overlayEl);

    return () => ctx.revert();
    // Re-running on index change is what makes next/prev animate too.
  }, [index, getThumb]);

  // Keyboard: Escape closes, arrows navigate.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") onNavigate((index! + 1) % items.length);
      if (event.key === "ArrowLeft") onNavigate((index! - 1 + items.length) % items.length);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, index, items.length, close, onNavigate]);

  if (index === null || !canPortal) return null;
  const item = items[index];

  return createPortal(
    <div
      ref={overlay}
      role="dialog"
      aria-modal="true"
      aria-label={item.caption ?? item.alt}
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center p-4 sm:p-8"
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <button
        type="button"
        data-lb-chrome
        onClick={close}
        aria-label="Close"
        className="absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10 sm:right-6 sm:top-6"
      >
        <X className="size-5" aria-hidden="true" />
      </button>

      <div
        ref={frame}
        className="relative aspect-[4/3] w-full max-w-5xl overflow-hidden rounded-2xl bg-forest-900"
      >
        <Image
          key={item.src}
          src={item.src}
          alt={item.alt}
          fill
          sizes="(min-width: 1024px) 64rem, 100vw"
          quality={88}
          loading="eager"
          fetchPriority="high"
          className="object-cover"
        />
      </div>

      <div
        data-lb-chrome
        className="mt-5 flex w-full max-w-5xl items-center justify-between gap-4"
      >
        <p className="text-sm font-semibold text-white/85">{item.caption ?? item.alt}</p>
        <div className="flex shrink-0 items-center gap-2">
          <span className="mr-2 text-xs tabular-nums text-white/45">
            {index + 1} / {items.length}
          </span>
          <button
            type="button"
            onClick={() => onNavigate((index - 1 + items.length) % items.length)}
            aria-label="Previous image"
            className="inline-flex size-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate((index + 1) % items.length)}
            aria-label="Next image"
            className="inline-flex size-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
