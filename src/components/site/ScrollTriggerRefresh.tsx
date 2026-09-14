"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * ScrollTrigger caches every trigger's start/end position the moment it is
 * created — during hydration, when lazy images and web fonts have not settled
 * yet. If the page then grows, those cached positions point at scroll offsets
 * that no longer exist and the animation never fires, leaving `gsap.from()`
 * elements stuck at opacity 0.
 *
 * Recomputing after `load` and after the fonts resolve keeps that from
 * happening. Cheap insurance; mount once in the root layout.
 */
export function ScrollTriggerRefresh() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();

    if (document.readyState === "complete") {
      refresh();
    } else {
      window.addEventListener("load", refresh, { once: true });
    }

    document.fonts?.ready.then(refresh).catch(() => {});

    // Late-loading images (Next/Image lazy loads below the fold) shift layout.
    const images = Array.from(document.images).filter((img) => !img.complete);
    images.forEach((img) => img.addEventListener("load", refresh, { once: true }));

    const timer = window.setTimeout(refresh, 1200);

    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(timer);
    };
  }, []);

  return null;
}
