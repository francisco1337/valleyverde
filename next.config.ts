import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first: roughly 20-30% smaller than WebP at the same quality on the
    // photographic content this site is built from. Browsers that do not take
    // it fall back to WebP automatically.
    formats: ["image/avif", "image/webp"],

    // The hero is full-bleed, so allow a 2560 variant for large displays.
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2048, 2560],

    // Next 16 requires this allowlist and defaults it to [75]. A `quality` that
    // is not on the list is silently coerced to the nearest one that is — which
    // is why every quality={8x} in this codebase was being served at 75 until
    // this was added. Keep the list short: each entry multiplies the number of
    // variants the optimizer can be asked to generate and cache.
    //   82 — gallery tiles and service cards
    //   85 — hero images and anything full-bleed
    //   88 — the lightbox, where the image is the whole point
    qualities: [75, 82, 85, 88],
  },
};

export default nextConfig;
