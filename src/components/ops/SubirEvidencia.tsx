"use client";

import { useRef, useState, useTransition } from "react";
import { Camera, CheckCircle2, Loader2, X } from "lucide-react";
import { completarEvento } from "@/app/app/(panel)/tecnico/ruta/[eventoId]/actions";
import type { DiccionarioCliente } from "@/lib/i18n/paraCliente";

const LADO_MAXIMO = 1280;
const CALIDAD_JPEG = 0.75;

/** Reduce la foto a un JPEG liviano antes de mandarla — se guarda como texto en la base. */
async function comprimirImagen(archivo: File): Promise<string> {
  const bitmap = await createImageBitmap(archivo);
  const escala = Math.min(1, LADO_MAXIMO / Math.max(bitmap.width, bitmap.height));
  const ancho = Math.round(bitmap.width * escala);
  const alto = Math.round(bitmap.height * escala);

  const canvas = document.createElement("canvas");
  canvas.width = ancho;
  canvas.height = alto;
  const contexto = canvas.getContext("2d");
  if (!contexto) throw new Error("No se pudo procesar la imagen.");
  contexto.drawImage(bitmap, 0, 0, ancho, alto);

  return canvas.toDataURL("image/jpeg", CALIDAD_JPEG);
}

export function SubirEvidencia({ eventoId, t }: { eventoId: string; t: DiccionarioCliente }) {
  const [fotos, setFotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function seleccionarFotos(files: FileList | null) {
    if (!files) return;
    const nuevas = Array.from(files).slice(0, 5 - fotos.length);
    setFotos((prev) => [...prev, ...nuevas]);
    setPreviews((prev) => [
      ...prev,
      ...nuevas.map((f) => URL.createObjectURL(f)),
    ]);
  }

  function quitarFoto(index: number) {
    URL.revokeObjectURL(previews[index]);
    setFotos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  function enviar(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        const imagenes = await Promise.all(fotos.map(comprimirImagen));
        imagenes.forEach((dataUrl, i) => formData.append(`foto_${i}`, dataUrl));
      } catch {
        setError(t.tecnico.subirEvidencia.errorProcesarFoto);
        return;
      }

      const result = await completarEvento(eventoId, formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form action={enviar} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-forest-900">
          {t.tecnico.subirEvidencia.evidenciaFotografica}
        </label>

        <div className="flex flex-wrap gap-2">
          {previews.map((src, i) => (
            <div key={src} className="relative h-20 w-20 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${t.tecnico.subirEvidencia.foto} ${i + 1}`}
                className="h-full w-full rounded-lg object-cover ring-1 ring-sand-200"
              />
              <button
                type="button"
                onClick={() => quitarFoto(i)}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow ring-1 ring-sand-200 transition hover:bg-red-50"
              >
                <X className="h-3 w-3 text-red-500" />
              </button>
            </div>
          ))}

          {fotos.length < 5 && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex h-20 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-sand-300 text-forest-950/40 transition hover:border-forest-400 hover:text-forest-600"
            >
              <Camera className="h-5 w-5" />
              <span className="text-[10px] font-medium">{t.tecnico.subirEvidencia.foto}</span>
            </button>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          className="sr-only"
          onChange={(e) => seleccionarFotos(e.target.files)}
        />
      </div>

      <div>
        <label
          htmlFor="notas"
          className="mb-1.5 block text-sm font-medium text-forest-900"
        >
          {t.tecnico.subirEvidencia.notasDelTrabajo} <span className="font-normal text-forest-950/45">({t.comun.opcional})</span>
        </label>
        <textarea
          id="notas"
          name="notas"
          rows={3}
          placeholder={t.tecnico.subirEvidencia.notasPlaceholder}
          className="w-full rounded-xl border border-sand-200 bg-white px-3.5 py-2.5 text-sm text-forest-950 placeholder-forest-950/35 focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-400/30"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-sprout-500 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-sprout-600 disabled:opacity-60"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t.comun.guardando}
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4" />
            {t.tecnico.subirEvidencia.marcarCompletado}
          </>
        )}
      </button>
    </form>
  );
}
