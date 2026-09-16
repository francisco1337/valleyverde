import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CalendarClock } from "lucide-react";

import { requerirRol } from "@/lib/acceso";
import { diccionario } from "@/lib/i18n";
import { paraCliente } from "@/lib/i18n/paraCliente";
import { idiomaActual } from "@/lib/idioma";
import { formatearFecha } from "@/lib/i18n/fecha";
import {
  eventosProgramados,
  asignacionesParaProgramar,
  tecnicosActivos,
} from "@/contextos/eventos/infraestructura/consultas/EventosProgramados";
import { FormularioProgramar } from "@/components/ops/FormularioProgramar";

export const metadata: Metadata = {
  title: "Programar",
  robots: { index: false, follow: false },
};

export default async function PaginaProgramar() {
  await requerirRol("OFICINA");

  const [t, idioma, eventosLista, asignacionesLista, tecnicos] = await Promise.all([
    diccionario(),
    idiomaActual(),
    eventosProgramados(),
    asignacionesParaProgramar(),
    tecnicosActivos(),
  ]);

  const formatFecha = (d: Date) =>
    formatearFecha(d, idioma, { weekday: "short", day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <Link
        href="/app/oficina"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-forest-950/55 transition hover:text-forest-800"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.comun.panel}
      </Link>

      <header className="mb-8">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-forest-600 uppercase">
          {t.programar.agenda}
        </p>
        <h1 className="mt-2.5 text-3xl font-bold tracking-tight text-forest-950">{t.programar.programar}</h1>
        <p className="mt-2 text-sm text-forest-950/60">
          {t.programar.ayuda}
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
        {/* Lista de eventos programados */}
        <section>
          <h2 className="mb-4 text-sm font-semibold text-forest-950">
            {t.programar.visitasProgramadas}
            <span className="ml-2 text-forest-950/40">({eventosLista.length})</span>
          </h2>

          {eventosLista.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-sand-300 bg-white px-6 py-12 text-center">
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
                <CalendarClock className="h-5 w-5" aria-hidden />
              </span>
              <p className="mt-4 text-sm font-semibold text-forest-950">{t.programar.sinVisitasProgramadas}</p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-forest-950/55">
                {t.programar.usaElFormulario}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-sand-200 overflow-hidden rounded-2xl border border-sand-200 bg-white">
              {eventosLista.map((e) => (
                <li key={e.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-1">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-forest-950">{e.servicio.nombre}</p>
                      <p className="mt-0.5 text-sm text-forest-950/55">
                        {e.ubicacion.nombre} · {e.cliente.nombre}
                      </p>
                      {e.tecnico && (
                        <p className="mt-0.5 text-xs text-forest-950/40">{e.tecnico.nombre}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-forest-950">
                        {formatFecha(e.fechaProgramada)}
                      </p>
                      <p className="mt-0.5 text-sm text-forest-950/55">{e.hora}</p>
                      <p className="mt-0.5 text-xs text-forest-950/40">${e.precio}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Formulario de programación */}
        <aside className="lg:sticky lg:top-8">
          <h2 className="mb-4 text-sm font-semibold text-forest-950">{t.programar.nuevaVisita}</h2>

          {asignacionesLista.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-sand-300 bg-white px-6 py-10 text-center text-sm text-forest-950/55">
              {t.programar.noHayAsignacionesActivas}
            </div>
          ) : (
            <FormularioProgramar
              asignaciones={asignacionesLista}
              tecnicos={tecnicos}
              t={paraCliente(t)}
            />
          )}
        </aside>
      </div>
    </div>
  );
}
