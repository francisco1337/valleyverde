import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, MapPin, Wrench } from "lucide-react";
import type { Metadata } from "next";

import { clientePrisma } from "@/contextos/compartido/infraestructura/persistencia/ClientePrisma";
import { requerirRol } from "@/lib/acceso";
import { diccionario } from "@/lib/i18n";
import { idiomaActual } from "@/lib/idioma";
import { formatearFecha } from "@/lib/i18n/fecha";

export const metadata: Metadata = {
  title: "Trabajos anteriores",
  robots: { index: false, follow: false },
};

export default async function PaginaHistorial() {
  const usuario = await requerirRol("TECNICO");
  const [t, idioma] = await Promise.all([diccionario(), idiomaActual()]);

  const eventos = await clientePrisma().evento.findMany({
    where: {
      tecnicoId: usuario.id,
      estado: "COMPLETADO",
    },
    select: {
      id: true,
      hora: true,
      notas: true,
      completadoEn: true,
      fechaProgramada: true,
      servicio: { select: { nombre: true } },
      ubicacion: {
        select: {
          nombre: true,
          direccion: true,
          cliente: { select: { nombre: true } },
        },
      },
    },
    orderBy: { completadoEn: "desc" },
    take: 50,
  });

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-8 sm:px-8">
      <Link
        href="/app/tecnico"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-forest-950/55 transition hover:text-forest-800"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.comun.panel}
      </Link>

      <header className="mb-6">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-forest-600 uppercase">
          {usuario.nombre}
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-forest-950">
          {t.tecnico.historial.trabajosAnteriores}
        </h1>
        {eventos.length > 0 && (
          <p className="mt-1.5 text-sm text-forest-950/55">
            {t.tecnico.historial.trabajosCompletados(eventos.length)}
          </p>
        )}
      </header>

      {eventos.length === 0 ? (
        <div className="rounded-2xl border border-sand-200 bg-white p-10 text-center">
          <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-forest-200" />
          <p className="text-sm font-medium text-forest-950/60">
            {t.tecnico.historial.aunNoTieneTrabajos}
          </p>
        </div>
      ) : (
        <ol className="space-y-3">
          {eventos.map((evento) => {
            const fecha = formatearFecha(new Date(evento.fechaProgramada), idioma, {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            return (
              <li
                key={evento.id}
                className="rounded-2xl border border-sprout-200/70 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold tracking-[0.14em] text-forest-600 uppercase">
                      {evento.ubicacion.cliente.nombre}
                    </p>
                    <h2 className="mt-0.5 truncate text-sm font-semibold text-forest-950">
                      {evento.ubicacion.nombre}
                    </h2>
                  </div>
                  <span className="shrink-0 rounded-md bg-sprout-400/20 px-2 py-1 text-[11px] font-bold tracking-[0.12em] text-forest-800 uppercase">
                    {t.comun.completadoBadge}
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-forest-950/60">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 shrink-0 text-forest-400" />
                    <span>{fecha} · {evento.hora}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest-400" />
                    <span className="truncate">{evento.ubicacion.direccion}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wrench className="h-3.5 w-3.5 shrink-0 text-forest-400" />
                    <span>{evento.servicio.nombre}</span>
                  </div>
                </div>

                {evento.notas && (
                  <div className="mt-3 rounded-lg bg-sand-50 px-3.5 py-2.5 text-xs text-forest-950/70">
                    <span className="font-semibold">{t.comun.notas}</span>
                    {evento.notas}
                  </div>
                )}

                {evento.completadoEn && (
                  <div className="mt-3">
                    <span className="text-xs text-forest-950/40">
                      {t.comun.cerradoEl(
                        formatearFecha(new Date(evento.completadoEn), idioma, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }),
                      )}
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
