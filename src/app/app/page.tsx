import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Hammer } from "lucide-react";

import { ops } from "@/lib/ops";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

/**
 * Placeholder so the sign-in flow has somewhere to land while the real
 * dashboard, routing and billing modules are built. Replace entirely.
 */
export default function OpsHomePage() {
  return (
    <div className="flex min-h-svh flex-1 items-center justify-center bg-sand-50 px-6 py-16">
      <div className="max-w-md text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-forest-700 text-sand-50">
          <Hammer className="h-5 w-5" aria-hidden />
        </span>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-forest-950">{ops.name}</h1>
        <p className="mt-3 text-sm leading-relaxed text-forest-950/60">
          You are signed in. The dashboard, today&rsquo;s route, estimates and receivables get
          built on top of this shell.
        </p>
        <Link
          href="/app/login"
          className="mt-8 inline-flex items-center gap-1.5 text-xs font-medium text-forest-950/50 transition hover:text-forest-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
