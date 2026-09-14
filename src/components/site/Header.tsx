"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Lock, Menu, Phone, X } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";
import { Magnetic } from "@/components/ui/Magnetic";
import { MiniMap } from "@/components/site/MiniMap";
import { company, nav, portal } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  /**
   * The transparent → solid swap is driven by a `data-solid` attribute written
   * straight to the DOM, NOT by React state.
   *
   * Setting state from ScrollTrigger's onUpdate re-rendered the whole header on
   * every scroll frame; on a phone that showed up as the header stuttering and
   * appearing to jump as you scrolled. Styling off a data attribute keeps the
   * scroll path free of React entirely — CSS does the work on the compositor.
   */
  useGSAP(() => {
    const el = header.current;
    const bar = progress.current;
    if (!el) return;

    const apply = (solid: boolean) => {
      const next = solid ? "true" : "false";
      if (el.dataset.solid !== next) el.dataset.solid = next;
    };

    apply(window.scrollY > 80);

    const trigger = ScrollTrigger.create({
      start: 80,
      onEnter: () => apply(true),
      onLeaveBack: () => apply(false),
    });

    let scrub: gsap.core.Tween | undefined;
    if (bar) {
      scrub = gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
          },
        },
      );
    }

    return () => {
      trigger.kill();
      scrub?.kill();
    };
  });

  // Drawer links cascade in. Gentler than before: the items start almost with
  // the panel, run longer, and use a soft ease so it reads as one motion
  // instead of a pause followed by a snap.
  useGSAP(
    () => {
      const node = panel.current;
      if (!node || !open) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          node.querySelectorAll("[data-nav-item]"),
          { opacity: 0, x: 22 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.07,
            delay: 0.08,
            ease: "power1.out",
            clearProps: "transform",
          },
        );
      });
    },
    { dependencies: [open] },
  );

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div className="hidden bg-forest-900 text-forest-100 lg:block">
        <div className="container-page flex h-10 items-center justify-between text-xs">
          <p className="tracking-wide">
            Licensed &amp; insured · Serving the Valley of the Sun for{" "}
            {company.yearsInBusiness}+ years
          </p>
          <a
            href={company.phoneHref}
            className="inline-flex items-center gap-2 font-semibold transition hover:text-sprout-400"
          >
            <Phone className="size-3.5" aria-hidden="true" />
            {company.phoneDisplay}
          </a>
        </div>
      </div>

      <header
        ref={header}
        data-solid="false"
        className={[
          "group/header sticky top-0 z-50 bg-transparent",
          "transition-[background-color,box-shadow] duration-300",
          "data-[solid=true]:bg-white/95 data-[solid=true]:shadow-[0_1px_0_0_rgb(0_0_0/0.06),0_8px_24px_-16px_rgb(0_0_0/0.35)] data-[solid=true]:backdrop-blur",
        ].join(" ")}
      >
        <div className="container-page flex h-20 items-center justify-between gap-6">
          {/* Both logos are in the DOM and cross-fade — swapping `src` on a
              state change made the logo blink while the new file decoded. */}
          <Link
            href="/"
            className="relative z-10 shrink-0"
            aria-label={`${company.name} — home`}
          >
            <span className="relative block h-9 w-[104px] sm:h-10 sm:w-[118px]">
              <Image
                src="/logo-white.webp"
                alt={company.name}
                fill
                loading="eager"
                fetchPriority="low"
                sizes="118px"
                className="object-contain transition-opacity duration-300 group-data-[solid=true]/header:opacity-0"
              />
              <Image
                src="/logo-color.webp"
                alt=""
                fill
                loading="eager"
                fetchPriority="low"
                sizes="118px"
                className="object-contain opacity-0 transition-opacity duration-300 group-data-[solid=true]/header:opacity-100"
              />
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
            {nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={[
                  "relative text-sm font-semibold transition-colors",
                  "after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:bg-ember-500 after:transition-all hover:after:w-full",
                  "text-white/90 hover:text-white",
                  "group-data-[solid=true]/header:text-forest-950 group-data-[solid=true]/header:hover:text-forest-700",
                ].join(" ")}
              >
                {item.label}
              </Link>
            ))}

            <span
              className="h-4 w-px bg-white/25 group-data-[solid=true]/header:bg-forest-950/15"
              aria-hidden="true"
            />

            <Link
              href={portal.href}
              className={[
                "inline-flex items-center gap-1.5 text-sm font-semibold transition-colors",
                "text-white/70 hover:text-white",
                "group-data-[solid=true]/header:text-forest-950/60 group-data-[solid=true]/header:hover:text-forest-700",
              ].join(" ")}
            >
              <Lock className="size-3.5" aria-hidden="true" />
              {portal.label}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Magnetic className="hidden sm:block">
              <a
                href={company.phoneHref}
                className="inline-flex items-center gap-2 rounded-full bg-ember-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-ember-500/25 transition-colors hover:bg-ember-600"
              >
                <Phone className="size-4" aria-hidden="true" />
                {company.phoneDisplay}
              </a>
            </Magnetic>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-drawer"
              className={[
                "inline-flex size-11 items-center justify-center rounded-full border transition lg:hidden",
                "border-white/30 text-white hover:bg-white/10",
                "group-data-[solid=true]/header:border-forest-950/15 group-data-[solid=true]/header:text-forest-950 group-data-[solid=true]/header:hover:bg-forest-50",
              ].join(" ")}
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          ref={progress}
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-sprout-400 to-ember-500"
          aria-hidden="true"
        />
      </header>

      {/* Mobile drawer — the slide is a plain CSS transition on purpose. */}
      <div
        id="mobile-drawer"
        className={[
          "fixed inset-0 z-[60] lg:hidden",
          open ? "" : "pointer-events-none",
        ].join(" ")}
        aria-hidden={!open}
      >
        <div
          className={[
            "absolute inset-0 bg-forest-950/70 backdrop-blur-sm transition-opacity duration-400",
            open ? "opacity-100" : "opacity-0",
          ].join(" ")}
          onClick={() => setOpen(false)}
        />
        <div
          ref={panel}
          className={[
            "absolute right-0 top-0 flex h-full w-[min(20rem,86vw)] flex-col overflow-y-auto bg-forest-900 px-6 py-6",
            "transition-transform duration-[600ms] ease-[cubic-bezier(0.32,0.72,0,1)]",
            open ? "translate-x-0" : "translate-x-full",
          ].join(" ")}
        >
          <div className="flex items-center justify-between">
            <Image
              src="/logo-white.webp"
              alt={company.name}
              width={520}
              height={220}
              className="h-8 w-auto"
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <nav className="mt-8 flex flex-col gap-1" aria-label="Mobile">
            {nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                data-nav-item
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-lg font-semibold text-white transition hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div data-nav-item className="mt-7">
            <MiniMap />
          </div>

          <a
            href={company.phoneHref}
            data-nav-item
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-ember-500 px-5 py-3.5 text-base font-bold text-white"
          >
            <Phone className="size-4" aria-hidden="true" />
            {company.phoneDisplay}
          </a>

          <a
            href={company.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            data-nav-item
            className="mt-3 inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white"
          >
            WhatsApp
          </a>

          <Link
            href={portal.href}
            data-nav-item
            onClick={() => setOpen(false)}
            className="mt-6 mb-2 inline-flex items-center justify-center gap-2 border-t border-white/10 pt-6 text-sm font-semibold text-white/55 transition hover:text-white"
          >
            <Lock className="size-3.5" aria-hidden="true" />
            {portal.label}
          </Link>
        </div>
      </div>
    </>
  );
}
