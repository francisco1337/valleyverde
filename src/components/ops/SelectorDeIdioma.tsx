"use client";

import { usePathname } from "next/navigation";

import { cambiarIdioma } from "@/app/app/acciones-idioma";
import type { Idioma } from "@/lib/idioma";

const OPCIONES: Idioma[] = ["es", "en"];

export function SelectorDeIdioma({ idioma }: { idioma: Idioma }) {
  const pathname = usePathname();

  return (
    <div className="flex items-center overflow-hidden rounded-lg border border-sand-200">
      {OPCIONES.map((opcion) => (
        <form key={opcion} action={cambiarIdioma}>
          <input type="hidden" name="idioma" value={opcion} />
          <input type="hidden" name="regresarA" value={pathname ?? "/app"} />
          <button
            type="submit"
            disabled={opcion === idioma}
            aria-current={opcion === idioma}
            className={`px-2.5 py-1.5 text-[11px] font-bold tracking-[0.08em] uppercase transition ${
              opcion === idioma
                ? "bg-forest-700 text-sand-50"
                : "text-forest-950/55 hover:bg-sand-100"
            }`}
          >
            {opcion}
          </button>
        </form>
      ))}
    </div>
  );
}
