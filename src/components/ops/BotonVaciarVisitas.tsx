"use client";

import { useTransition } from "react";
import { LoaderCircle, Trash2 } from "lucide-react";

import { vaciarVisitas } from "@/lib/visitas";
import type { DiccionarioCliente } from "@/lib/i18n/paraCliente";

export function BotonVaciarVisitas({ t }: { t: DiccionarioCliente }) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(t.visitas.confirmarVaciar)) return;

    startTransition(() => {
      vaciarVisitas().catch(console.error);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="flex items-center gap-1.5 rounded-xl border border-ember-300 bg-ember-50 px-3 py-2 text-xs font-semibold text-ember-700 transition hover:border-ember-400 hover:bg-ember-100 focus-visible:ring-2 focus-visible:ring-ember-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden />
      ) : (
        <Trash2 className="h-3.5 w-3.5" aria-hidden />
      )}
      {t.visitas.vaciarHistorial}
    </button>
  );
}
