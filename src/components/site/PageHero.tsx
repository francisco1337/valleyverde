"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { gsap, SplitText, useGSAP, EASE, MOTION_OK } from "@/lib/gsap";

type Crumb = { label: string; href?: string };

type PageHeroProps = {
  kicker: string;
  title: string;
  body?: ReactNode;
  image: string;
  imageAlt: string;
  crumbs: Crumb[];
  children?: ReactNode;
};

/**
 * Inner-page hero. Same visual language as the home hero — masked word reveal,
 * background drift on scroll — at a shorter height so the content starts sooner.
 */
export function PageHero({
  kicker,
  title,
  body,
  image,
  imageAlt,
  crumbs,
  children,
}: PageHeroProps) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const heading = root.querySelector("[data-page-title]") as HTMLElement | null;
        const split = heading ? new SplitText(heading, { type: "words", mask: "words" }) : null;
        const words = split?.words ?? [];

        gsap.set(words, { yPercent: 120, opacity: 0 });
        gsap.set(q("[data-page-crumbs]"), { opacity: 0, y: 14 });
        gsap.set(q("[data-page-body]"), { opacity: 0, y: 20 });

        const tl = gsap.timeline({ defaults: { ease: EASE } });
        tl.fromTo(q("[data-page-image]"), { scale: 1.12 }, { scale: 1, duration: 1.8, ease: "power2.out" }, 0)
          .to(q("[data-page-crumbs]"), { opacity: 1, y: 0, duration: 0.6 }, 0.1)
          .to(words, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.06 }, 0.2)
          .to(q("[data-page-body]"), { opacity: 1, y: 0, duration: 0.8 }, 0.6);

        gsap.to(q("[data-page-image]"), {
          yPercent: 14,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
        });

        return () => {
          tl.kill();
          split?.revert();
        };
      });
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      className="relative -mt-20 flex min-h-[30rem] items-end overflow-hidden lg:min-h-[34rem]"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div data-page-image className="absolute inset-0 will-change-transform">
          {/* LCP element for this page — see the note in HeroMedia. */}
          <Image
            src={image}
            alt={imageAlt}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            quality={85}
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/20 to-forest-950/50" />
      </div>

      <div className="container-page relative w-full pb-14 pt-32 lg:pb-16 lg:pt-36">
        <nav data-page-crumbs aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-forest-100/60">
            {crumbs.map((crumb, index) => (
              <li key={crumb.label} className="flex items-center gap-1.5">
                {index > 0 ? (
                  <ChevronRight className="size-3.5 text-forest-100/35" aria-hidden="true" />
                ) : null}
                {crumb.href ? (
                  <Link href={crumb.href} className="transition hover:text-white">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-sprout-400">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <h1
          data-page-title
          className="max-w-3xl text-[2.4rem] font-extrabold leading-[1.05] text-white sm:text-5xl lg:text-6xl"
        >
          {kicker} <span className="text-sprout-400">{title}</span>
        </h1>

        {body ? (
          <p
            data-page-body
            className="mt-5 max-w-2xl text-lg leading-relaxed text-forest-100/85"
          >
            {body}
          </p>
        ) : null}

        {children}
      </div>
    </section>
  );
}
