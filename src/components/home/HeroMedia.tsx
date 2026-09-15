"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

/**
 * Hero background: a cross-fading stack of stills, each drifting slowly under
 * its own Ken Burns push.
 *
 * This replaced a looping `<video>`. The only footage the company has is a 2021
 * export at 640×352, and the hero is full-bleed — roughly 3000 CSS pixels wide
 * on a retina laptop. Upscaling 360p that far is what made it look pixelated,
 * and no encode fixes it because the detail was never captured. These stills
 * come from the same shoots at 2016–2400 px, so they are genuinely sharp at
 * every viewport, and the whole rotation costs less than the 3.7 MB the
 * desktop video did.
 *
 * Cost control: only the first slide is in the initial render — it is the LCP
 * element, and nothing else is allowed to compete with it. The rest mount once
 * the browser is idle, and the rotation does not start until they have all
 * decoded, so a slow connection never cross-fades to a blank layer.
 *
 * Skipped entirely for `prefers-reduced-motion` and for Save-Data: those
 * visitors get the first still and nothing else is ever fetched.
 */

type Slide = {
  src: string;
  alt: string;
  /**
   * The hero is a wide letterbox on desktop and a tall portrait on phones, so
   * the two crops cut on different axes: X frames the phone, Y frames desktop.
   */
  position: string;
  /** Start and end of this slide's drift. Alternating directions keep the
   *  rotation from feeling like one repeated camera move. */
  drift: CSSProperties;
};

const drift = (
  fromScale: number,
  toScale: number,
  from: [string, string],
  to: [string, string],
  seconds: number,
): CSSProperties =>
  ({
    "--drift-from-scale": fromScale,
    "--drift-to-scale": toScale,
    "--drift-from-x": from[0],
    "--drift-from-y": from[1],
    "--drift-to-x": to[0],
    "--drift-to-y": to[1],
    "--drift-seconds": `${seconds}s`,
  }) as CSSProperties;

const SLIDES: Slide[] = [
  {
    src: "/images/hero.webp",
    alt: "Manicured commercial landscaping in front of an office building in Phoenix, Arizona",
    position: "50% 50%",
    drift: drift(1.0, 1.08, ["0%", "0%"], ["-1.5%", "-1%"], 30),
  },
  {
    src: "/images/hero-2-tree.webp",
    alt: "",
    position: "50% 45%",
    drift: drift(1.08, 1.0, ["1.5%", "1%"], ["0%", "0%"], 32),
  },
  {
    src: "/images/hero-3-truck.webp",
    alt: "",
    position: "42% 50%",
    drift: drift(1.0, 1.09, ["1%", "0%"], ["-1%", "-1.5%"], 28),
  },
  {
    src: "/images/hero-4-irrigation.webp",
    alt: "",
    position: "50% 55%",
    drift: drift(1.09, 1.0, ["-1%", "1%"], ["0%", "0%"], 34),
  },
];

/** How long each slide holds, and how long the cross-fade between them takes. */
const HOLD_MS = 7000;
const FADE_MS = 1800;

export function HeroMedia() {
  // Extra slides are mounted only once the page is idle, so they never sit in
  // front of the LCP image in the network queue.
  const [enhanced, setEnhanced] = useState(false);
  const [decoded, setDecoded] = useState(0);
  // [outgoing, current]. Keeping both in one value means the cross-fade never
  // sees a render where they disagree.
  const [[previous, current], setPair] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;

    if (
      connection?.saveData === true ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const idle = window.requestIdleCallback;
    if (idle) {
      const handle = idle(() => setEnhanced(true), { timeout: 3000 });
      return () => window.cancelIdleCallback(handle);
    }

    const timer = window.setTimeout(() => setEnhanced(true), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  const armed = enhanced && decoded >= SLIDES.length - 1;

  useEffect(() => {
    if (!armed) return;

    const id = window.setInterval(() => {
      setPair(([, active]) => [active, (active + 1) % SLIDES.length]);
    }, HOLD_MS);

    return () => window.clearInterval(id);
  }, [armed]);

  const slides = enhanced ? SLIDES : SLIDES.slice(0, 1);

  return (
    <div data-hero-image className="absolute inset-0 will-change-transform">
      {slides.map((slide, i) => {
        const isCurrent = i === current;
        // The outgoing slide stays fully opaque underneath while the incoming
        // one fades in on top. Cross-fading both at once would dip to the
        // background colour halfway through.
        const isOutgoing = i === previous && previous !== current;

        return (
          <div
            key={slide.src}
            className="absolute inset-0 transition-opacity ease-linear"
            style={{
              opacity: isCurrent || isOutgoing ? 1 : 0,
              zIndex: isCurrent ? 2 : isOutgoing ? 1 : 0,
              transitionDuration: `${FADE_MS}ms`,
            }}
          >
            <div className="hero-drift absolute inset-0" style={slide.drift}>
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                // The first slide is the LCP element. In Next 16 `priority` is
                // deprecated and does not set either of the two things that
                // actually matter here, so we set them ourselves.
                loading="eager"
                fetchPriority={i === 0 ? "high" : "low"}
                sizes="100vw"
                quality={85}
                onLoad={i === 0 ? undefined : () => setDecoded((n) => n + 1)}
                style={{ objectPosition: slide.position }}
                className="object-cover"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
