import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Plus } from "lucide-react";

import { requerirRol } from "@/lib/acceso";
import { asignacionesActivas } from "@/contextos/asignaciones/infraestructura/consultas/AsignacionesActivas";

export const metadata: Metadata = {
  title: "Asignaciones",
  robots: { index: false, follow: false },
};

const LABEL_PERIODICIDAD: Record<string, string> = {
  DIARIO: "Diario",
  SEMANAL: "Semanal",
  QUINCENAL: "Quincenal",
  MENSUAL: "Mensual",
};

function formatFecha(d: Date) {
  return d.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function PaginaDeAsignaciones() {
  await requerirRol("OFICINA");
  const lista = await asignacionesActivas();

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-forest-600 uppercase">
            Contratos recurrentes
          </p>
          <h1 className="mt-2.5 text-3xl font-bold tracking-tight text-forest-950">
            Asignaciones
          </h1>
          <p className="mt-2 text-sm text-forest-950/60">
            {lista.length === 0
              ? "Todavía no hay ninguna."
              : `${lista.length} ${lista.length === 1 ? "asignación activa" : "asignaciones activas"}.`}
          </p>
        </div>

        <Link
          href="/app/oficina/asignaciones/nueva"
          className="flex items-center gap-2 rounded-xl bg-forest-700 px-4 py-2.5 text-sm font-semibold text-sand-50 shadow-sm transition hover:bg-forest-600 focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:ring-offset-2 focus-visible:ring-offset-sand-50 focus-visible:outline-none"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Nueva asignación
        </Link>
      </header>

      {lista.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-sand-300 bg-white px-6 py-14 text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
            <CalendarDays className="h-5 w-5" aria-hidden />
          </span>
          <p className="mt-4 text-sm font-semibold text-forest-950">Sin asignaciones</p>
          <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-forest-950/55">
            Define los contratos recurrentes de cada propiedad. Desde aquí se generan los eventos que el técnico ve en su ruta.
          </p>
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-sand-200 overflow-hidden rounded-2xl border border-sand-200 bg-white">
          {lista.map((a) => (
            <li key={a.id} className="px-5 py-4">
              <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-forest-950">{a.ubicacion.nombre}</p>
                  <p className="mt-0.5 text-sm text-forest-950/55">{a.cliente.nombre}</p>
                  <p className="mt-1 text-xs text-forest-950/40">{a.ubicacion.direccion}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-forest-950">{a.servicio.nombre}</p>
                  <p className="mt-0.5 text-sm text-forest-950/55">
                    ${a.precioPorEvento} · {LABEL_PERIODICIDAD[a.periodicidad]}
                  </p>
                  <p className="mt-1 text-xs text-forest-950/40">
                    {formatFecha(a.fechaInicio)} – {formatFecha(a.fechaFin)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
