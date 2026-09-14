"use client";

import Image from "next/image";
import { useRef, useState, type FormEvent } from "react";
import { Check, CheckCircle2, Loader2, Phone, Send } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, EASE } from "@/lib/gsap";
import { company, services } from "@/lib/site";

type Status = "idle" | "sending" | "sent";

export function QuoteCta() {
  const scope = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      const section = scope.current;
      const card = panel.current;
      if (!section || !card) return;

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const fields = card.querySelectorAll("[data-quote-field]");
        gsap.set(card, { opacity: 0, y: 44 });
        gsap.set(fields, { opacity: 0, y: 18 });

        ScrollTrigger.create({
          trigger: section,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap
              .timeline()
              .to(card, {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: EASE,
                clearProps: "transform",
              })
              .to(
                fields,
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.5,
                  ease: EASE,
                  stagger: 0.05,
                  clearProps: "transform",
                },
                0.25,
              );
          },
        });
      });
    },
    { scope },
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    // TODO: POST to /api/quote (Resend, SendGrid or the client's CRM).
    // Simulated for now so the flow is demonstrable end to end.
    await new Promise((resolve) => setTimeout(resolve, 900));
    setStatus("sent");
  }

  return (
    <section
      id="quote"
      ref={scope}
      className="relative scroll-mt-24 overflow-hidden bg-forest-950 py-20 lg:py-28"
    >
      <Image
        src="/images/worker-tree.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-15"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-forest-950 via-forest-950/95 to-forest-900/85" />

      <div className="container-page relative">
        <div
          ref={panel}
          className="grid overflow-hidden rounded-[2rem] bg-white shadow-2xl lg:grid-cols-[0.85fr_1.15fr]"
        >
          {/* Left rail */}
          <div className="flex flex-col justify-between gap-10 bg-forest-800 p-8 text-white lg:p-11">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-sprout-400">
                <span className="h-px w-6 bg-sprout-400/70" aria-hidden="true" />
                Free quote
              </span>
              <h2 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl">
                Let&rsquo;s walk your property
              </h2>
              <p className="mt-4 leading-relaxed text-forest-100/80">
                Tell us what is not working today. We will schedule an on-site review,
                write up an easy-to-understand proposal and guarantee you a reasonable
                price.
              </p>

              <ul className="mt-8 space-y-4 border-t border-white/10 pt-8">
                {[
                  "We call you back within one business day",
                  "We walk the property together — no charge, no obligation",
                  "You get a written plan with the pricing spelled out",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-sprout-400"
                      aria-hidden="true"
                    />
                    <span className="text-forest-100/85">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-5">
              <a
                href={company.phoneHref}
                className="group flex items-center gap-4 rounded-2xl bg-white/10 p-4 transition hover:bg-white/15"
              >
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-ember-500 text-white">
                  <Phone className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-wider text-forest-100/60">
                    Prefer to talk?
                  </span>
                  <span className="block text-lg font-extrabold">
                    {company.phoneDisplay}
                  </span>
                </span>
              </a>
              <p className="text-sm leading-relaxed text-forest-100/60">
                Licensed by the State of Arizona · Workers&rsquo; Compensation and
                liability insured · Serving {company.city} and the greater Valley.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="p-8 lg:p-11">
            {status === "sent" ? (
              <div className="flex h-full min-h-72 flex-col items-center justify-center text-center">
                <CheckCircle2 className="size-14 text-sprout-500" aria-hidden="true" />
                <h3 className="mt-5 text-2xl font-extrabold text-forest-950">
                  Thank you — we got it
                </h3>
                <p className="mt-3 max-w-sm text-forest-950/65">
                  A member of our team will reach out within one business day to
                  schedule your on-site review.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-sm font-bold text-forest-700 underline underline-offset-4 hover:text-ember-500"
                >
                  Send another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                <Field label="First name" name="firstName" required data-quote-field />
                <Field label="Last name" name="lastName" required data-quote-field />
                <Field label="Company" name="company" data-quote-field />
                <Field label="Phone number" name="phone" type="tel" data-quote-field />

                <div className="sm:col-span-2" data-quote-field>
                  <Field label="Email address" name="email" type="email" required />
                </div>

                <div className="sm:col-span-2" data-quote-field>
                  <label
                    htmlFor="service"
                    className="mb-1.5 block text-sm font-bold text-forest-950"
                  >
                    Type of service
                  </label>
                  <select
                    id="service"
                    name="service"
                    defaultValue=""
                    className="w-full rounded-xl border border-sand-300 bg-sand-50 px-4 py-3 text-[0.95rem] text-forest-950 outline-none transition focus:border-forest-700 focus:ring-2 focus:ring-forest-700/15"
                  >
                    <option value="" disabled>
                      Select a service…
                    </option>
                    {services.map((service) => (
                      <option key={service.slug} value={service.slug}>
                        {service.title}
                      </option>
                    ))}
                    <option value="multiple">More than one / not sure yet</option>
                  </select>
                </div>

                <div className="sm:col-span-2" data-quote-field>
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-sm font-bold text-forest-950"
                  >
                    Tell us about the property
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    maxLength={600}
                    placeholder="Property type, approximate size, city, and what needs attention."
                    className="w-full resize-y rounded-xl border border-sand-300 bg-sand-50 px-4 py-3 text-[0.95rem] text-forest-950 outline-none transition placeholder:text-forest-950/35 focus:border-forest-700 focus:ring-2 focus:ring-forest-700/15"
                  />
                </div>

                <div className="sm:col-span-2" data-quote-field>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-ember-500 px-7 py-4 text-base font-bold text-white shadow-lg shadow-ember-500/25 transition hover:bg-ember-600 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="size-5" aria-hidden="true" />
                        Request my free quote
                      </>
                    )}
                  </button>
                  <p className="mt-3 text-xs leading-relaxed text-forest-950/50">
                    We use your information only to respond to this request. No lists, no
                    sharing.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
};

function Field({ label, name, type = "text", required, ...rest }: FieldProps) {
  return (
    <div {...rest}>
      <label htmlFor={name} className="mb-1.5 block text-sm font-bold text-forest-950">
        {label}
        {required ? <span className="text-ember-500"> *</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-sand-300 bg-sand-50 px-4 py-3 text-[0.95rem] text-forest-950 outline-none transition placeholder:text-forest-950/35 focus:border-forest-700 focus:ring-2 focus:ring-forest-700/15"
      />
    </div>
  );
}
