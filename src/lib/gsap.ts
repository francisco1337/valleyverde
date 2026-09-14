"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

/**
 * Register once, in a client-only module, so every component imports the same
 * configured instance. Every GSAP plugin is free as of 3.13, so SplitText and
 * the rest ship straight from the main package — no membership, no CDN.
 */
gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP);

/** Shared easing so every animation on the site feels like one system. */
export const EASE = "power3.out";
export const EASE_IN_OUT = "power3.inOut";

/** Media query GSAP's matchMedia uses to skip motion for those who ask. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const DESKTOP_MOTION = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

export { gsap, ScrollTrigger, SplitText, Flip, useGSAP };
