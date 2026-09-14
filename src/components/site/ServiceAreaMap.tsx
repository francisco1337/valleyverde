"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";
import { AREA_BACKDROP, AREA_VIEWBOX as VB, areaFeatures } from "@/lib/service-area";

/**
 * Coverage map drawn from real municipal boundaries.
 *
 * Not a tile map: no API key, no third-party request, no cookie banner, and it
 * inherits the brand palette and animates. The city limits are the actual
 * published polygons, projected and simplified at build time (see
 * `lib/service-area.ts`), so the shape of each city is correct rather than a
 * dot on an empty field.
 *
 * Every community name is real SVG `<text>` — selectable, translatable and
 * crawlable, the same way the old list of links was.
 */
export function ServiceAreaMap() {
  const scope = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const backdrop = root.querySelectorAll("[data-backdrop]");
        const shapes = root.querySelectorAll("[data-shape]");
        const dots = root.querySelectorAll("[data-dot]");
        const labels = root.querySelectorAll("[data-label]");

        gsap.set(backdrop, { opacity: 0 });
        gsap.set(shapes, { opacity: 0 });
        gsap.set(dots, { scale: 0, transformOrigin: "center" });
        gsap.set(labels, { opacity: 0, y: 5 });

        const tl = gsap.timeline({ paused: true });

        tl.to(backdrop, { opacity: 1, duration: 0.8, ease: "power2.out" })
          // Cities fill in from the centre outward — the markup is ordered by
          // distance from Phoenix, so a flat stagger reads as coverage
          // spreading across the Valley.
          .to(shapes, { opacity: 1, duration: 0.5, stagger: 0.045, ease: "power2.out" }, 0.15)
          .to(dots, { scale: 1, duration: 0.4, stagger: 0.05, ease: "back.out(2)" }, 0.5)
          .to(labels, { opacity: 1, y: 0, duration: 0.4, stagger: 0.03 }, 0.35);

        const trigger = ScrollTrigger.create({
          trigger: root,
          start: "top 78%",
          once: true,
          onEnter: () => tl.play(),
        });

        return () => {
          trigger.kill();
          tl.kill();
        };
      });
    },
    { scope },
  );

  const hub = areaFeatures.find((f) => f.hq)!;
  const ordered = [...areaFeatures].sort(
    (a, b) =>
      Math.hypot(a.x - hub.x, a.y - hub.y) - Math.hypot(b.x - hub.x, b.y - hub.y),
  );

  return (
    <div ref={scope} className="relative">
      <svg
        viewBox={`0 0 ${VB.width} ${VB.height}`}
        className="w-full"
        role="img"
        aria-label="Map of the Phoenix metropolitan area showing the city limits of every community Valley Verde Landscaping services"
      >
        <path
          data-backdrop
          d={AREA_BACKDROP}
          fill="var(--color-sprout-400)"
          fillOpacity="0.06"
          stroke="var(--color-sprout-400)"
          strokeOpacity="0.18"
          strokeWidth="1.5"
          fillRule="evenodd"
        />

        {ordered.map((f) => {
          const isActive = active === f.name;
          return (
            <g
              key={f.name}
              onPointerEnter={() => setActive(f.name)}
              onPointerLeave={() => setActive(null)}
            >
              {f.d ? (
                <path
                  data-shape
                  d={f.d}
                  fillRule="evenodd"
                  className="transition-all duration-200"
                  fill={
                    f.hq
                      ? "var(--color-ember-500)"
                      : isActive
                        ? "var(--color-ember-500)"
                        : "var(--color-sprout-400)"
                  }
                  fillOpacity={f.hq ? 0.3 : isActive ? 0.42 : 0.16}
                  stroke={
                    f.hq || isActive
                      ? "var(--color-ember-500)"
                      : "var(--color-sprout-400)"
                  }
                  strokeOpacity={f.hq || isActive ? 0.9 : 0.5}
                  strokeWidth={f.hq || isActive ? 2 : 1.2}
                  strokeLinejoin="round"
                />
              ) : (
                <circle
                  data-dot
                  cx={f.x}
                  cy={f.y}
                  r={isActive ? 7 : 5}
                  fill={isActive ? "var(--color-white)" : "var(--color-sprout-400)"}
                  stroke="var(--color-forest-950)"
                  strokeWidth="2.5"
                  className="transition-all duration-200"
                  style={{ transformOrigin: `${f.x}px ${f.y}px` }}
                />
              )}
            </g>
          );
        })}

        {/* Labels last so no polygon can paint over them. */}
        {ordered.map((f) => {
          const isActive = active === f.name;
          return (
            <text
              key={`l-${f.name}`}
              data-label
              x={f.side === "left" ? f.x - 12 : f.x + 12}
              y={f.y + f.dy + 5}
              textAnchor={f.side === "left" ? "end" : "start"}
              stroke="var(--color-forest-900)"
              strokeWidth="4"
              strokeLinejoin="round"
              paintOrder="stroke"
              className={[
                "pointer-events-none select-none transition-all duration-200",
                f.hq ? "text-[17px] font-extrabold" : "text-[15px] font-semibold",
              ].join(" ")}
              fill={f.hq || isActive ? "var(--color-white)" : "var(--color-forest-100)"}
              fillOpacity={f.hq || isActive ? 1 : 0.7}
            >
              {f.name}
            </text>
          );
        })}
      </svg>

      <p className="mt-6 text-center text-xs text-forest-100/45">
        City limits shown for orientation — they are municipal boundaries, not
        service boundaries. Not on the map? Call and ask.
      </p>
    </div>
  );
}
