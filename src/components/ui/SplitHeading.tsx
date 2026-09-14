"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP, EASE, MOTION_OK } from "@/lib/gsap";

type SplitHeadingProps = {
  children: ReactNode;
  className?: string;
  as?: Extract<ElementType, "h1" | "h2" | "h3" | "p">;
  /** "lines" reads calmer for long headings; "words" has more snap for short ones. */
  by?: "lines" | "words";
  delay?: number;
};

/**
 * Headline reveal: SplitText cuts the text into lines (or words), each one is
 * masked by its own clipping wrapper, and they rise into place in sequence.
 *
 * Two things this handles that a naive version does not:
 *
 * 1. Line breaks move when the container resizes, so a split made at one width
 *    leaves words stranded at another. We re-split on ScrollTrigger refresh —
 *    which also fires when a pinned section elsewhere on the page recalculates.
 * 2. Once the reveal has played, SplitText is reverted and the original markup
 *    comes back. That means no re-splitting on later refreshes (which was
 *    clipping already-revealed headings mid-glyph), and screen readers and
 *    copy-paste get clean text instead of a pile of wrapper divs.
 */
export function SplitHeading({
  children,
  className,
  as: Tag = "h2",
  by = "lines",
  delay = 0,
}: SplitHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        let split: SplitText | null = null;
        let tween: gsap.core.Tween | null = null;
        let trigger: ScrollTrigger | null = null;
        let done = false;

        const teardown = () => {
          tween?.kill();
          tween = null;
          split?.revert();
          split = null;
        };

        const build = () => {
          if (done) return;
          teardown();

          split = new SplitText(el, {
            type: by === "words" ? "words" : "lines",
            mask: by === "words" ? "words" : "lines",
          });

          const targets = by === "words" ? split.words : split.lines;
          if (!targets.length) return;

          gsap.set(targets, { yPercent: 115, opacity: 0 });

          tween = gsap.to(targets, {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            ease: EASE,
            delay,
            stagger: by === "words" ? 0.05 : 0.12,
            paused: true,
            onComplete: () => {
              // The reveal is over — hand the DOM back.
              done = true;
              split?.revert();
              split = null;
            },
          });

          trigger?.kill();
          trigger = ScrollTrigger.create({
            trigger: el,
            start: "top 90%",
            once: true,
            onEnter: () => tween?.play(),
          });
        };

        build();

        const onRefresh = () => {
          if (!done && by === "lines") build();
        };
        ScrollTrigger.addEventListener("refreshInit", onRefresh);

        return () => {
          ScrollTrigger.removeEventListener("refreshInit", onRefresh);
          trigger?.kill();
          teardown();
        };
      });
    },
    { scope: ref, dependencies: [by, delay] },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
