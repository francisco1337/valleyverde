import type { Metadata } from "next";
import { DollarSign } from "lucide-react";

import { requerirRol } from "@/lib/acceso";
import { diccionario } from "@/lib/i18n";
import { paraCliente } from "@/lib/i18n/paraCliente";
import { idiomaActual } from "@/lib/idioma";
import { formatearFecha } from "@/lib/i18n/fecha";
import { cobranzaResumen } from "@/contextos/eventos/infraestructura/consultas/CobranzaResumen";
import { BotonMarcarPagado } from "@/components/ops/BotonMarcarPagado";

export const metadata: Metadata = {
  title: "Cobranza",
  robots: { index: false, follow: false },
};

function usd(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default async function PaginaCobranza() {
  await requerirRol("OFICINA");
  const [t, idioma, { pendientes, cobrado, totalPendiente, totalCobrado }] = await Promise.all([
    diccionario(),
    idiomaActual(),
    cobranzaResumen(),
  ]);
  const fmt = (fecha: Date) => formatearFecha(fecha, idioma, { day: "2-digit", month: "short", year: "numeric" });
  const tCliente = paraCliente(t);

  const total = totalPendiente + totalCobrado;

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <header className="mb-8">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-forest-600 uppercase">
          {t.cobranza.finanzas}
        </p>
        <h1 className="mt-2.5 text-3xl font-bold tracking-tight text-forest-950">{t.cobranza.cobranza}</h1>
        <p className="mt-2 text-sm text-forest-950/60">
          {t.cobranza.ayuda}
        </p>
      </header>

      {/* Resumen */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-sand-200 bg-white px-5 py-4">
          <p className="text-xs font-semibold tracking-wide text-forest-950/50 uppercase">
            {t.cobranza.totalFacturado}
          </p>
          <p className="mt-1.5 text-2xl font-bold text-forest-950">{usd(total)}</p>
          <p className="mt-0.5 text-xs text-forest-950/40">
            {t.cobranza.trabajosCompletados(pendientes.length + cobrado.length)}
          </p>
        </div>

        <div className="rounded-2xl border border-ember-200 bg-ember-50 px-5 py-4">
          <p className="text-xs font-semibold tracking-wide text-ember-700 uppercase">
            {t.cobranza.porCobrar}
          </p>
          <p className="mt-1.5 text-2xl font-bold text-ember-700">{usd(totalPendiente)}</p>
          <p className="mt-0.5 text-xs text-ember-600/70">
            {pendientes.length} {t.cobranza.trabajo(pendientes.length)}
          </p>
        </div>

        <div className="rounded-2xl border border-sprout-200 bg-sprout-50 px-5 py-4">
          <p className="text-xs font-semibold tracking-wide text-sprout-700 uppercase">
            {t.cobranza.cobrado}
          </p>
          <p className="mt-1.5 text-2xl font-bold text-sprout-700">{usd(totalCobrado)}</p>
          <p className="mt-0.5 text-xs text-sprout-600/70">
            {cobrado.length} {t.cobranza.trabajo(cobrado.length)}
          </p>
        </div>
      </div>

      {/* Pendientes */}
      <section className="mb-10">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-forest-950">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-ember-100 text-[10px] font-bold text-ember-700">
            {pendientes.length}
          </span>
          {t.cobranza.porCobrar}
        </h2>

        {pendientes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-sand-300 bg-white px-6 py-10 text-center">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
              <DollarSign className="h-5 w-5" aria-hidden />
            </span>
            <p className="mt-3 text-sm font-semibold text-forest-950">{t.cobranza.todoCobrado}</p>
            <p className="mt-1 text-sm text-forest-950/50">{t.cobranza.noHayTrabajosPendientes}</p>
          </div>
        ) : (
          <ul className="divide-y divide-sand-200 overflow-hidden rounded-2xl border border-sand-200 bg-white">
            {pendientes.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                    <p className="text-sm font-semibold text-forest-950">{e.cliente.nombre}</p>
                    <p className="text-xs text-forest-950/50">{e.servicio.nombre}</p>
                  </div>
                  <p className="mt-0.5 text-xs text-forest-950/40">{e.ubicacion.nombre}</p>
                  <p className="mt-0.5 text-xs text-forest-950/40">
                    {fmt(e.fechaProgramada)} · {e.hora}
                    {e.tecnico ? ` · ${e.tecnico.nombre}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm font-semibold text-ember-700">{usd(parseFloat(e.precio))}</p>
                  <BotonMarcarPagado eventoId={e.id} t={tCliente} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Cobrado */}
      {cobrado.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-forest-950">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-sprout-100 text-[10px] font-bold text-sprout-700">
              {cobrado.length}
            </span>
            {t.cobranza.cobrado}
          </h2>

          <ul className="divide-y divide-sand-200 overflow-hidden rounded-2xl border border-sand-200 bg-white">
            {cobrado.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4 opacity-70">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                    <p className="text-sm font-semibold text-forest-950">{e.cliente.nombre}</p>
                    <p className="text-xs text-forest-950/50">{e.servicio.nombre}</p>
                  </div>
                  <p className="mt-0.5 text-xs text-forest-950/40">{e.ubicacion.nombre}</p>
                  <p className="mt-0.5 text-xs text-forest-950/40">
                    {fmt(e.fechaProgramada)} · {e.hora}
                    {e.pagadoEn ? t.cobranza.pagadoEl(fmt(e.pagadoEn)) : ""}
                  </p>
                </div>
                <p className="text-sm font-semibold text-sprout-700">{usd(parseFloat(e.precio))}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
