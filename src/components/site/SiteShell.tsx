"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { ScrollTriggerRefresh } from "@/components/site/ScrollTriggerRefresh";

/**
 * The marketing site and the operations app share one root layout (and one
 * font), but they must not share chrome: a CRM with a marketing nav bar on top
 * looks like a website pretending to be software.
 *
 * Server-rendered <Header /> and <Footer /> are passed in as props so this thin
 * client component can decide, from the pathname alone, whether to mount them.
 * Everything under /app is the operations app and renders bare.
 */
export function SiteShell({
  header,
  footer,
  chat,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  /** The public chat widget — floats over the marketing site. */
  chat?: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isOpsApp = pathname === "/app" || pathname.startsWith("/app/");

  if (isOpsApp) {
    return <main className="flex flex-1 flex-col">{children}</main>;
  }

  return (
    <>
      <ScrollTriggerRefresh />
      {header}
      <main className="flex-1">{children}</main>
      {footer}
      {chat}
    </>
  );
}
