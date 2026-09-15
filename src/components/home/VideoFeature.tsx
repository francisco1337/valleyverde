"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { gsap, useGSAP, EASE, MOTION_OK } from "@/lib/gsap";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { company } from "@/lib/site";

/**
 * The company's own two-minute film, on the home page, at zero cost to the
 * initial load.
 *
 * Next.js optimises images; it does nothing for video. So the win here is not
 * compression, it is *not fetching the file at all* until someone asks for it —
 * the "facade" pattern. What ships in the HTML is a poster image (62 KB WebP,
 * which Next does optimise) and a play button. The `<video>` element is not
 * even in the DOM until the first click, at which point it mounts with
 * `autoPlay` and pulls ~8 MB.
 *
 * That is why this is not simply `<video preload="none">`: even with preload
 * off, the element itself, its poster handling and the extra layout work all
 * land on the critical path, and some browsers still reach for metadata.
 * Mounting on click sidesteps all of it.
 */
export function VideoFeature() {
  const scope = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root || !started) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          root.querySelector("video"),
          { opacity: 0, scale: 1.04 },
          { opacity: 1, scale: 1, duration: 0.6, ease: EASE },
        );
      });
    },
    { scope, dependencies: [started] },
  );

  return (
    <section className="bg-forest-950 py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading
          tone="dark"
          eyebrow="In their own words"
          title="Two decades of the Valley, in two minutes"
          body={`A look at the crews, the trucks and the properties — filmed on ${company.name}'s own routes across Phoenix, Scottsdale and Tempe.`}
        />

        <div ref={scope} className="mx-auto mt-12 max-w-5xl lg:mt-16">
          <div className="relative aspect-video overflow-hidden rounded-3xl bg-forest-900 shadow-2xl">
            {started ? (
              <video
                poster="/images/video-poster.webp"
                controls
                autoPlay
                playsInline
                preload="auto"
                className="size-full object-cover"
              >
                {/* Both encodes are the master's native 640×352. The file this
                    replaced was upscaled to 854×470, which spent bytes on
                    interpolated pixels and then compressed the result — it
                    measured *worse* against the master than either of these
                    while being half again as large.

                    AV1 first, and its `codecs` string has to be exact: a
                    browser that cannot decode av01.0.01M.08 needs to read that
                    from the type and fall through to the H.264 source rather
                    than commit to a stream it will choke on. */}
                <source
                  src="/video/why-valley-verde.av1.mp4"
                  type='video/mp4; codecs="av01.0.01M.08"'
                />
                <source src="/video/why-valley-verde.mp4" type="video/mp4" />
              </video>
            ) : (
              <button
                type="button"
                onClick={() => setStarted(true)}
                aria-label={`Play the ${company.name} company video`}
                className="group absolute inset-0 cursor-pointer"
              >
                <Image
                  src="/images/video-poster.webp"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 64rem, 100vw"
                  quality={82}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/20 to-forest-950/30 transition-colors duration-500 group-hover:from-forest-950/70" />

                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="relative inline-flex size-20 items-center justify-center rounded-full bg-ember-500 text-white shadow-2xl shadow-ember-500/40 transition-transform duration-300 group-hover:scale-110 sm:size-24">
                    <span className="absolute inset-0 animate-ping rounded-full bg-ember-500/40" />
                    <Play className="relative size-8 translate-x-0.5 fill-current sm:size-9" aria-hidden="true" />
                  </span>
                </span>

                <span className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4 text-left">
                  <span>
                    <span className="block text-lg font-extrabold text-white sm:text-xl">
                      Why Choose Valley Verde
                    </span>
                    <span className="block text-sm text-forest-100/70">
                      1:47 · Sound on
                    </span>
                  </span>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
