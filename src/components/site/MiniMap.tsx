import { ExternalLink, MapPin } from "lucide-react";
import { company } from "@/lib/site";
import { AREA_BACKDROP, AREA_VIEWBOX as VB, areaFeatures } from "@/lib/service-area";

const HUB = areaFeatures.find((f) => f.hq)!;

/**
 * Compact "where we are" card for the mobile drawer.
 *
 * Same projected city boundaries as the full service-area map, so the Valley
 * has one shape across the site — just without labels at this size. Tapping it
 * hands off to the Google Maps app (or the web app on desktop) through the
 * official Maps URL scheme, which needs no API key.
 *
 * Deliberately not a Google Maps iframe: an embed in a slide-out drawer costs a
 * third-party frame, cookies and several hundred KB on a phone, to show roughly
 * what this SVG already shows.
 */
export function MiniMap() {
  return (
    <a
      href={company.mapsHref}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-2xl border border-white/10 bg-forest-950/60 transition hover:border-sprout-400/40"
    >
      <div className="relative h-32 w-full">
        <svg
          viewBox={`0 0 ${VB.width} ${VB.height}`}
          className="absolute inset-0 size-full"
          aria-hidden="true"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d={AREA_BACKDROP}
            fillRule="evenodd"
            fill="var(--color-sprout-400)"
            fillOpacity="0.08"
            stroke="var(--color-sprout-400)"
            strokeOpacity="0.2"
            strokeWidth="2"
          />
          {areaFeatures
            .filter((f) => f.d && !f.hq)
            .map((f) => (
              <path
                key={f.name}
                d={f.d}
                fillRule="evenodd"
                fill="var(--color-sprout-400)"
                fillOpacity="0.2"
                stroke="var(--color-sprout-400)"
                strokeOpacity="0.45"
                strokeWidth="1.5"
              />
            ))}
          <path
            d={HUB.d}
            fillRule="evenodd"
            fill="var(--color-ember-500)"
            fillOpacity="0.4"
            stroke="var(--color-ember-500)"
            strokeOpacity="0.9"
            strokeWidth="2.5"
          />
        </svg>

        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/20 to-transparent" />
      </div>

      <div className="flex items-center gap-3 px-4 pb-4 pt-1">
        <MapPin className="size-4 shrink-0 text-sprout-400" aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold text-white">{company.city}</span>
          <span className="block text-xs text-forest-100/55">
            Open our service area in Google Maps
          </span>
        </span>
        <ExternalLink
          className="size-4 shrink-0 text-forest-100/45 transition group-hover:text-sprout-400"
          aria-hidden="true"
        />
      </div>
    </a>
  );
}
