"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Hero background: a sharp still, with the crew b-roll fading in on top once it
 * is actually playing. Autoplays on a loop everywhere — phones get their own,
 * lighter encode rather than a different behaviour.
 *
 *   desktop  hero.mp4         1280×704, 16 s, 3.7 MB
 *   phone    hero-mobile.mp4    640×352, 16 s, 1.0 MB
 *
 * Neither is in the initial HTML payload: `preload="none"` plus a `src`
 * assigned from JS means the download only starts once we have decided it is
 * worth it. Skipped entirely for `prefers-reduced-motion` and for Save-Data —
 * and if autoplay is refused, the promise rejects, `playing` never fires, and
 * the still image simply stays. No broken state, no black rectangle.
 */
export function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;

    if (
      connection?.saveData === true ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const onPlaying = () => setPlaying(true);
    video.addEventListener("playing", onPlaying, { once: true });

    video.src = window.matchMedia("(max-width: 767px)").matches
      ? "/video/hero-mobile.mp4"
      : "/video/hero.mp4";
    video.load();
    void video.play().catch(() => {
      // Autoplay refused — the still image is already the fallback.
    });

    return () => video.removeEventListener("playing", onPlaying);
  }, []);

  return (
    <div data-hero-image className="absolute inset-0 will-change-transform">
      <Image
        src="/images/hero.webp"
        alt="Manicured commercial landscaping in front of an office building in Phoenix, Arizona"
        fill
        // This is the LCP element. In Next 16 `priority` is deprecated and does
        // not set either of the two things that actually matter here, so we set
        // them ourselves: load it immediately, at high priority.
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        quality={85}
        className="object-cover object-center"
      />

      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        className={[
          "absolute inset-0 size-full object-cover object-center transition-opacity duration-1000 ease-out",
          playing ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />
    </div>
  );
}
