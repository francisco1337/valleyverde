import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  body?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
};

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "center",
  tone = "light",
}: SectionHeadingProps) {
  const isCenter = align === "center";
  const isDark = tone === "dark";

  return (
    <div
      className={[
        "flex flex-col gap-4",
        isCenter ? "mx-auto max-w-2xl items-center text-center" : "max-w-2xl items-start",
      ].join(" ")}
    >
      <Reveal>
        <span
          className={[
            "inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em]",
            isDark ? "text-sprout-400" : "text-forest-700",
          ].join(" ")}
        >
          <span
            className={["h-px w-6", isDark ? "bg-sprout-400/70" : "bg-ember-500"].join(" ")}
            aria-hidden="true"
          />
          {eyebrow}
        </span>
      </Reveal>

      <SplitHeading
        as="h2"
        by="lines"
        className={[
          "text-3xl font-extrabold leading-tight sm:text-4xl lg:text-[2.75rem]",
          isDark ? "text-white" : "text-forest-950",
        ].join(" ")}
      >
        {title}
      </SplitHeading>

      {body ? (
        <Reveal delay={0.15}>
          <p
            className={[
              "text-base leading-relaxed sm:text-lg",
              isDark ? "text-forest-100/85" : "text-forest-950/70",
            ].join(" ")}
          >
            {body}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
