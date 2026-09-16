"use client";

import { useTransition } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { marcarPagado } from "@/app/app/(panel)/oficina/cobranza/actions";
import type { DiccionarioCliente } from "@/lib/i18n/paraCliente";

export function BotonMarcarPagado({ eventoId, t }: { eventoId: string; t: DiccionarioCliente }) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(() => {
      marcarPagado(eventoId).catch(console.error);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="flex items-center gap-1.5 rounded-xl border border-forest-300 bg-forest-50 px-3 py-2 text-xs font-semibold text-forest-700 transition hover:bg-forest-100 hover:border-forest-400 focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden />
          {t.comun.guardando}
        </>
      ) : (
        <>
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
          {t.cobranza.marcarPagado}
        </>
      )}
    </button>
  );
}
