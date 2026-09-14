import { Building2 } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { clientTypes } from "@/lib/site";

export function ClientStrip() {
  return (
    <section className="border-b border-sand-200 bg-white">
      <div className="container-page py-8">
        <Reveal stagger className="flex flex-col items-center gap-5 lg:flex-row lg:gap-10">
          <p className="inline-flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-forest-700">
            <Building2 className="size-4 text-ember-500" aria-hidden="true" />
            Who we maintain
          </p>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2.5 lg:justify-start">
            {clientTypes.map((type) => (
              <li
                key={type}
                className="text-sm font-semibold text-forest-950/60 transition-colors hover:text-forest-700"
              >
                {type}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
