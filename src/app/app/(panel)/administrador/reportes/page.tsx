import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BarChart3, CalendarRange, CheckCircle2, DollarSign } from "lucide-react";

import { requerirRol } from "@/lib/acceso";
import { diccionario } from "@/lib/i18n";
import { idiomaActual } from "@/lib/idioma";
import { formatearFecha } from "@/lib/i18n/fecha";
import { hoyEnPhoenix } from "@/lib/tiempo";
import { reporteDeNegocio } from "@/contextos/eventos/infraestructura/consultas/ReporteDeNegocio";
import { GraficaDeIngresos } from "@/components/ops/GraficaDeIngresos";

export const metadata: Metadata = {
  title: "Reportes",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ desde?: string; hasta?: string }>;
};

function aISO(fecha: Date): string {
  return fecha.toISOString().slice(0, 10);
}

/** "YYYY-MM-DD" (tal como lo manda <input type="date">) a Date local, sin desfase de zona horaria. */
function deISO(valor: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor);
  if (!match) return null;
  const [, anio, mes, dia] = match;
  return new Date(Number(anio), Number(mes) - 1, Number(dia));
}

function usd(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default async function PaginaDeReportes({ searchParams }: Props) {
  await requerirRol("ADMINISTRADOR");
  const [t, idioma] = await Promise.all([diccionario(), idiomaActual()]);
  const fmt = (fecha: Date) => formatearFecha(fecha, idioma, { day: "2-digit", month: "short", year: "numeric" });

  const params = await searchParams;
  const hoy = hoyEnPhoenix();
  const inicioDeMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

  const fechaInicio = deISO(params.desde ?? "") ?? inicioDeMes;
  const fechaFinBruta = deISO(params.hasta ?? "") ?? hoy;
  const fechaFin = fechaFinBruta < fechaInicio ? fechaInicio : fechaFinBruta;

  const { totalCobrado, totalPorCobrar, trabajosCompletados, serieDiaria, porServicio } =
    await reporteDeNegocio(fechaInicio, fechaFin);

  const totalFacturado = totalCobrado + totalPorCobrar;

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <Link
        href="/app/administrador"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-forest-950/55 transition hover:text-forest-800"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.comun.panel}
      </Link>

      <header className="mb-8">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-forest-600 uppercase">
          {t.reportes.finanzas}
        </p>
        <h1 className="mt-2.5 text-3xl font-bold tracking-tight text-forest-950">{t.reportes.reportes}</h1>
        <p className="mt-2 text-sm text-forest-950/60">
          {t.reportes.comoVaElNegocio(fmt(fechaInicio), fmt(fechaFin))}
        </p>
      </header>

      {/* Filtro de fechas */}
      <form className="mb-8 flex flex-wrap items-end gap-4 rounded-2xl border border-sand-200 bg-white px-5 py-4">
        <div>
          <label htmlFor="desde" className="block text-xs font-semibold text-forest-950/50 uppercase">
            {t.reportes.desde}
          </label>
          <input
            id="desde"
            name="desde"
            type="date"
            defaultValue={aISO(fechaInicio)}
            max={aISO(hoy)}
            className="mt-1.5 rounded-lg border border-sand-300 px-3 py-1.5 text-sm text-forest-950 focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:outline-none"
          />
        </div>
        <div>
          <label htmlFor="hasta" className="block text-xs font-semibold text-forest-950/50 uppercase">
            {t.reportes.hasta}
          </label>
          <input
            id="hasta"
            name="hasta"
            type="date"
            defaultValue={aISO(fechaFin)}
            max={aISO(hoy)}
            className="mt-1.5 rounded-lg border border-sand-300 px-3 py-1.5 text-sm text-forest-950 focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:outline-none"
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl bg-forest-700 px-4 py-2 text-sm font-semibold text-sand-50 shadow-sm transition hover:bg-forest-600 focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:ring-offset-2 focus-visible:ring-offset-sand-50 focus-visible:outline-none"
        >
          <CalendarRange className="h-4 w-4" aria-hidden />
          {t.reportes.filtrar}
        </button>
        <a
          href="/app/administrador/reportes"
          className="text-sm text-forest-950/50 underline-offset-2 hover:text-forest-800 hover:underline"
        >
          {t.reportes.mesActual}
        </a>
      </form>

      {/* Resumen */}
      <div className="mb-10 grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-sand-200 bg-white px-5 py-4">
          <p className="text-xs font-semibold tracking-wide text-forest-950/50 uppercase">
            {t.reportes.totalFacturado}
          </p>
          <p className="mt-1.5 text-2xl font-bold text-forest-950">{usd(totalFacturado)}</p>
        </div>

        <div className="rounded-2xl border border-forest-200 bg-forest-50 px-5 py-4">
          <p className="text-xs font-semibold tracking-wide text-forest-700 uppercase">{t.reportes.cobrado}</p>
          <p className="mt-1.5 text-2xl font-bold text-forest-700">{usd(totalCobrado)}</p>
        </div>

        <div className="rounded-2xl border border-ember-200 bg-ember-50 px-5 py-4">
          <p className="text-xs font-semibold tracking-wide text-ember-700 uppercase">{t.reportes.porCobrar}</p>
          <p className="mt-1.5 text-2xl font-bold text-ember-700">{usd(totalPorCobrar)}</p>
        </div>

        <div className="rounded-2xl border border-sand-200 bg-white px-5 py-4">
          <p className="text-xs font-semibold tracking-wide text-forest-950/50 uppercase">
            {t.reportes.trabajosCompletados}
          </p>
          <p className="mt-1.5 text-2xl font-bold text-forest-950">{trabajosCompletados}</p>
        </div>
      </div>

      {/* Gráfica de ingresos por día */}
      <section className="mb-10 rounded-2xl border border-sand-200 bg-white px-5 py-5">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-forest-950">
          <BarChart3 className="h-4 w-4 text-forest-600" aria-hidden />
          {t.reportes.ingresosPorDia}
        </h2>
        {trabajosCompletados === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center text-center">
            <DollarSign className="h-6 w-6 text-forest-200" aria-hidden />
            <p className="mt-2 text-sm text-forest-950/50">
              {t.reportes.noHayTrabajosEnRango}
            </p>
          </div>
        ) : (
          <>
            <GraficaDeIngresos serie={serieDiaria} idioma={idioma} etiquetas={{ cobrado: t.reportes.cobrado, porCobrar: t.reportes.porCobrar }} />
            <div className="mt-3 flex items-center gap-4 text-xs text-forest-950/50">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-sprout-400" /> {t.reportes.cobrado}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-ember-500" /> {t.reportes.porCobrar}
              </span>
            </div>
          </>
        )}
      </section>

      {/* Desglose por servicio */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-forest-950">
          <CheckCircle2 className="h-4 w-4 text-forest-600" aria-hidden />
          {t.reportes.desglosePorServicio}
        </h2>

        {porServicio.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-sand-300 bg-white px-6 py-10 text-center">
            <p className="text-sm text-forest-950/50">{t.reportes.sinDatosEnRango}</p>
          </div>
        ) : (
          <ul className="divide-y divide-sand-200 overflow-hidden rounded-2xl border border-sand-200 bg-white">
            {porServicio.map((s) => (
              <li key={s.nombre} className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-forest-950">{s.nombre}</p>
                  <p className="mt-0.5 text-xs text-forest-950/40">
                    {s.cantidad} {t.reportes.trabajo(s.cantidad)}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-semibold text-forest-700">{usd(s.cobrado)}</span>
                  {s.porCobrar > 0 && (
                    <span className="font-semibold text-ember-700">{usd(s.porCobrar)}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
