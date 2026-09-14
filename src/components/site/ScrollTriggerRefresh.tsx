"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * A single, coalesced `ScrollTrigger.refresh()` after the page settles.
 *
 * ScrollTrigger caches every trigger's start/end position when the trigger is
 * created — during hydration, before web fonts have swapped in. If the page
 * grows afterwards, those cached offsets point at scroll positions that no
 * longer exist. One refresh once things have settled fixes that.
 *
 * `refresh()` is NOT cheap, and it is not just a ScrollTrigger cost: it reverts
 * and re-measures every trigger on the page, and it fires `refreshInit`, which
 * every pending SplitText heading listens to in order to re-split itself. An
 * earlier version of this file called it on `load`, on `fonts.ready`, on a
 * timer, and once per incomplete image — 23 full refreshes on the home page,
 * which measured out at ~1.9 s of forced layout.
 *
 * So: every request goes through one debouncer, and the per-image listeners are
 * gone. They were never needed — every `<Image>` here carries width/height or
 * `fill`, so its box is reserved before the bytes arrive and a late image
 * cannot shift layout. Anything that genuinely does change the page height is
 * caught by the ResizeObserver below, which covers far more than images did.
 */
export function ScrollTriggerRefresh() {
  useEffect(() => {
    let frame = 0;
    let timer = 0;
    let disposed = false;

    /** Collapses any number of requests in the same tick into one refresh. */
    const request = () => {
      if (disposed || frame || timer) return;
      timer = window.setTimeout(() => {
        timer = 0;
        frame = requestAnimationFrame(() => {
          frame = 0;
          ScrollTrigger.refresh();
        });
      }, 100);
    };

    if (document.readyState === "complete") request();
    else window.addEventListener("load", request, { once: true });

    document.fonts?.ready.then(request).catch(() => {});

    // Catches the real thing the image listeners were guessing at: the document
    // actually getting taller or shorter. Rounded to whole pixels so subpixel
    // noise during a pin does not retrigger it.
    let lastHeight = Math.round(document.body.scrollHeight);
    const observer = new ResizeObserver(() => {
      // A refresh pins sections, which itself changes the body height. Without
      // this guard the observer would answer its own refresh and loop.
      // `isRefreshing` is set by ScrollTrigger at runtime but missing from its
      // published typings, hence the cast.
      if ((ScrollTrigger as unknown as { isRefreshing?: boolean }).isRefreshing) return;
      const height = Math.round(document.body.scrollHeight);
      if (Math.abs(height - lastHeight) < 4) return;
      lastHeight = height;
      request();
    });
    observer.observe(document.body);

    return () => {
      disposed = true;
      window.removeEventListener("load", request);
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return null;
}
