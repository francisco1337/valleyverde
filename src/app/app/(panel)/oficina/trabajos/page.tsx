import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, MapPin, Wrench } from "lucide-react";
import type { Metadata } from "next";

import { catalogoDeTrabajos } from "@/contextos/eventos/infraestructura/consultas/CatalogoDeTrabajos";
import { requerirRol } from "@/lib/acceso";
import { diccionario } from "@/lib/i18n";
import { idiomaActual } from "@/lib/idioma";
import { formatearFecha } from "@/lib/i18n/fecha";
import { GaleriaDeEvidencias } from "@/components/ops/GaleriaDeEvidencias";

export const metadata: Metadata = {
  title: "Catálogo de trabajos",
  robots: { index: false, follow: false },
};

export default async function PaginaCatalogoDeTrabajos() {
  await requerirRol("OFICINA");
  const [t, idioma, trabajos] = await Promise.all([diccionario(), idiomaActual(), catalogoDeTrabajos()]);

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8">
      <Link
        href="/app/oficina"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-forest-950/55 transition hover:text-forest-800"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.comun.panel}
      </Link>

      <header className="mb-6">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-forest-600 uppercase">
          {t.trabajos.operacion}
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-forest-950">
          {t.trabajos.catalogoDeTrabajos}
        </h1>
        {trabajos.length > 0 && (
          <p className="mt-1.5 text-sm text-forest-950/55">
            {t.trabajos.trabajosCompletados(trabajos.length)}
          </p>
        )}
      </header>

      {trabajos.length === 0 ? (
        <div className="rounded-2xl border border-sand-200 bg-white p-10 text-center">
          <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-forest-200" />
          <p className="text-sm font-medium text-forest-950/60">
            {t.trabajos.aunNoHayTrabajos}
          </p>
        </div>
      ) : (
        <ol className="space-y-4">
          {trabajos.map((trabajo) => {
            const fecha = formatearFecha(new Date(trabajo.fechaProgramada), idioma, {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            return (
              <li
                key={trabajo.id}
                className="rounded-2xl border border-sprout-200/70 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold tracking-[0.14em] text-forest-600 uppercase">
                      {trabajo.cliente.nombre}
                    </p>
                    <h2 className="mt-0.5 truncate text-sm font-semibold text-forest-950">
                      {trabajo.ubicacion.nombre}
                    </h2>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-forest-800">
                    ${Number(trabajo.precio).toFixed(2)}
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-forest-950/60">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 shrink-0 text-forest-400" />
                    <span>{fecha} · {trabajo.hora}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest-400" />
                    <span className="truncate">{trabajo.ubicacion.direccion}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wrench className="h-3.5 w-3.5 shrink-0 text-forest-400" />
                    <span>
                      {trabajo.servicio.nombre}
                      {trabajo.tecnico ? ` · ${trabajo.tecnico.nombre}` : ""}
                    </span>
                  </div>
                </div>

                {trabajo.notas && (
                  <div className="mt-3 rounded-lg bg-sand-50 px-3.5 py-2.5 text-xs text-forest-950/70">
                    <span className="font-semibold">{t.comun.notas}</span>
                    {trabajo.notas}
                  </div>
                )}

                <GaleriaDeEvidencias
                  imagenes={trabajo.evidencias}
                  alts={trabajo.evidencias.map((_, i) => t.comun.evidencia(i + 1))}
                  textoSinFotos={t.comun.sinFotosDeEvidencia}
                />

                {trabajo.completadoEn && (
                  <p className="mt-3 text-xs text-forest-950/40">
                    {t.comun.cerradoEl(
                      formatearFecha(new Date(trabajo.completadoEn), idioma, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }),
                    )}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
