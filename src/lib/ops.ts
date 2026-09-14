/**
 * Single source of truth for the operations app (everything under /app).
 * Kept separate from lib/site.ts: that file is marketing copy the client reads,
 * this one is product surface the crew uses.
 */

export const ops = {
  name: "Valley Verde Operations",
  shortName: "Verde Ops",
  tagline: "Properties, crews and cash flow in one place",
} as const;

export type OpsRole = "ADMIN" | "CREW";

/** Everything under /app is the operations app and must render without site chrome. */
export const OPS_BASE_PATH = "/app";

export function isOpsRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return pathname === OPS_BASE_PATH || pathname.startsWith(`${OPS_BASE_PATH}/`);
}

/**
 * Demo credentials, surfaced on the sign-in screen on purpose.
 *
 * A demo nobody can get into is not a demo. These same values seed the
 * database, so the buttons on the sign-in screen always work.
 */
export const demoAccounts: {
  role: OpsRole;
  label: string;
  person: string;
  email: string;
  password: string;
  blurb: string;
}[] = [
  {
    role: "ADMIN",
    label: "Office",
    person: "Dana Whitfield",
    email: "dana@valleyverde.com",
    password: "verde2026",
    blurb: "Clients, estimates, scheduling and invoicing",
  },
  {
    role: "CREW",
    label: "Crew lead",
    person: "Miguel Sandoval",
    email: "miguel@valleyverde.com",
    password: "verde2026",
    blurb: "Today's route and job completion",
  },
];

/** What the sign-in panel promises, before anyone has logged in. */
export const opsHighlights = [
  {
    icon: "route" as const,
    title: "Today's route, already built",
    body: "Every scheduled stop in driving order, assigned to a crew.",
  },
  {
    icon: "file" as const,
    title: "Estimates in under a minute",
    body: "Pick a property, pick services, send the PDF.",
  },
  {
    icon: "wallet" as const,
    title: "Who paid, who owes",
    body: "Receivables by client, aged, with nothing to reconcile by hand.",
  },
];
