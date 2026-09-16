"use client";

import { useState } from "react";
import { ImageOff, X } from "lucide-react";

/**
 * `alts` y `textoSinFotos` llegan ya traducidos desde el Server Component: el
 * texto de cada foto necesita pluralizar ("Evidencia 1", "Evidence 1"...), y
 * las funciones del diccionario no pueden cruzar a un Client Component — ver
 * `src/lib/i18n/paraCliente.ts`.
 */
export function GaleriaDeEvidencias({
  imagenes,
  alts,
  textoSinFotos,
}: {
  imagenes: string[];
  alts: string[];
  textoSinFotos: string;
}) {
  const [abierta, setAbierta] = useState<number | null>(null);

  if (imagenes.length === 0) {
    return (
      <div className="mt-3 flex items-center gap-2 text-xs text-forest-950/35">
        <ImageOff className="h-3.5 w-3.5" />
        {textoSinFotos}
      </div>
    );
  }

  return (
    <>
      <div className="mt-3 flex flex-wrap gap-2">
        {imagenes.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src}
            alt={alts[i] ?? ""}
            onClick={() => setAbierta(i)}
            className="h-20 w-20 cursor-pointer rounded-lg object-cover ring-1 ring-sand-200 transition hover:ring-2 hover:ring-forest-400"
          />
        ))}
      </div>

      {abierta !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-forest-950/85 p-6"
          onClick={() => setAbierta(null)}
        >
          <button
            type="button"
            onClick={() => setAbierta(null)}
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imagenes[abierta]}
            alt={alts[abierta] ?? ""}
            className="max-h-full max-w-full rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
