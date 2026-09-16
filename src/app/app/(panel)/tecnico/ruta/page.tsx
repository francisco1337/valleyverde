import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, MapPin } from "lucide-react";
import type { Metadata } from "next";

import { clientePrisma } from "@/contextos/compartido/infraestructura/persistencia/ClientePrisma";
import { requerirRol } from "@/lib/acceso";
import { MapaPinesLazy } from "@/components/ops/MapaPinesLazy";

export const metadata: Metadata = {
  title: "Mi ruta de hoy",
  robots: { index: false, follow: false },
};

/** Fecha de hoy en la zona horaria de Phoenix (MST, UTC−7, sin horario de verano). */
function hoyEnPhoenix(): Date {
  const ahoraUTC = new Date();
  const mst = new Date(ahoraUTC.getTime() - 7 * 60 * 60 * 1000);
  return new Date(mst.getFullYear(), mst.getMonth(), mst.getDate());
}

export default async function PaginaRutaDelDia() {
  const usuario = await requerirRol("TECNICO");

  const hoy = hoyEnPhoenix();
  const manana = new Date(hoy);
  manana.setDate(manana.getDate() + 1);

  const eventos = await clientePrisma().evento.findMany({
    where: {
      tecnicoId: usuario.id,
      fechaProgramada: { gte: hoy, lt: manana },
    },
    select: {
      id: true,
      hora: true,
      estado: true,
      servicio: { select: { nombre: true } },
      ubicacion: {
        select: {
          nombre: true,
          direccion: true,
          latitud: true,
          longitud: true,
          cliente: { select: { nombre: true } },
        },
      },
    },
    orderBy: { hora: "asc" },
  });

  const paradas = eventos.map((e) => ({
    eventoId: e.id,
    hora: e.hora,
    cliente: e.ubicacion.cliente.nombre,
    direccion: e.ubicacion.direccion,
    latitud: e.ubicacion.latitud ? Number(e.ubicacion.latitud) : 0,
    longitud: e.ubicacion.longitud ? Number(e.ubicacion.longitud) : 0,
  }));

  const fechaTexto = hoy.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const pendientes = eventos.filter((e) => e.estado === "PROGRAMADO").length;
  const completados = eventos.filter((e) => e.estado === "COMPLETADO").length;

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-8 sm:px-8">
      <Link
        href="/app/tecnico"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-forest-950/55 transition hover:text-forest-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Panel
      </Link>

      <header className="mb-6">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-forest-600 uppercase capitalize">
          {fechaTexto}
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-forest-950">
          Mi ruta de hoy
        </h1>
        {eventos.length > 0 && (
          <p className="mt-1.5 text-sm text-forest-950/55">
            {pendientes} pendiente{pendientes !== 1 ? "s" : ""}
            {completados > 0 && ` · ${completados} completado${completados !== 1 ? "s" : ""}`}
          </p>
        )}
      </header>

      {/* Mapa con todos los pines */}
      {eventos.length > 0 && (
        <div className="mb-6 overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-sm">
          <div className="h-56 sm:h-72">
            <MapaPinesLazy paradas={paradas} />
          </div>
        </div>
      )}

      {/* Lista de paradas */}
      {eventos.length === 0 ? (
        <div className="rounded-2xl border border-sand-200 bg-white p-10 text-center">
          <MapPin className="mx-auto mb-3 h-8 w-8 text-forest-200" />
          <p className="text-sm font-medium text-forest-950/60">
            No tienes trabajos programados para hoy.
          </p>
        </div>
      ) : (
        <ol className="space-y-3">
          {eventos.map((evento, i) => {
            const completado = evento.estado === "COMPLETADO";
            return (
              <li key={evento.id}>
                <Link
                  href={`/app/tecnico/ruta/${evento.id}`}
                  className={`group flex items-center gap-4 rounded-2xl border p-4 shadow-sm transition ${
                    completado
                      ? "border-sprout-300/60 bg-sprout-50/60"
                      : "border-sand-200 bg-white hover:border-sprout-400/60 hover:shadow-md"
                  }`}
                >
                  {/* Número de parada / check */}
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      completado
                        ? "bg-sprout-400/30 text-forest-700"
                        : "bg-forest-700 text-white"
                    }`}
                  >
                    {completado ? (
                      <CheckCircle2 className="h-4.5 w-4.5" />
                    ) : (
                      i + 1
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-forest-950">
                      {evento.ubicacion.cliente.nombre}
                    </p>
                    <p className="truncate text-xs text-forest-950/55">
                      {evento.ubicacion.nombre} — {evento.servicio.nombre}
                    </p>
                    <div className="mt-1.5 flex items-center gap-3 text-[11px] text-forest-950/45">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {evento.hora}
                      </span>
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{evento.ubicacion.direccion}</span>
                      </span>
                    </div>
                  </div>

                  {!completado && (
                    <ArrowRight className="h-4 w-4 shrink-0 text-forest-400 transition group-hover:translate-x-0.5" />
                  )}
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
