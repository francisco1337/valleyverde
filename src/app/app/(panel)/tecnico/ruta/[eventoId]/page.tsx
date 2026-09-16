import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, MapPin, Wrench } from "lucide-react";
// MapPin se usa en el encabezado de la dirección
import type { Metadata } from "next";

import { clientePrisma } from "@/contextos/compartido/infraestructura/persistencia/ClientePrisma";
import { requerirRol } from "@/lib/acceso";
import { diccionario } from "@/lib/i18n";
import { paraCliente } from "@/lib/i18n/paraCliente";
import { SubirEvidencia } from "@/components/ops/SubirEvidencia";
import { MapaNavegacionLazy } from "@/components/ops/MapaNavegacionLazy";

export const metadata: Metadata = {
  title: "Trabajo",
  robots: { index: false, follow: false },
};

export default async function PaginaDetalleEvento({
  params,
}: {
  params: Promise<{ eventoId: string }>;
}) {
  const { eventoId } = await params;
  const usuario = await requerirRol("TECNICO");
  const t = await diccionario();
  const tCliente = paraCliente(t);

  const evento = await clientePrisma().evento.findUnique({
    where: { id: eventoId },
    select: {
      id: true,
      hora: true,
      estado: true,
      notas: true,
      tecnicoId: true,
      servicio: { select: { nombre: true } },
      ubicacion: {
        select: {
          nombre: true,
          direccion: true,
          latitud: true,
          longitud: true,
          notasDeAcceso: true,
          cliente: { select: { nombre: true, telefono: true } },
        },
      },
    },
  });

  if (!evento || evento.tecnicoId !== usuario.id) notFound();

  const yaCompletado = evento.estado === "COMPLETADO";

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-8 sm:px-8">
      <Link
        href="/app/tecnico/ruta"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-forest-950/55 transition hover:text-forest-800"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.tecnico.detalle.miRutaDeHoy}
      </Link>

      {/* Encabezado del trabajo */}
      <div className="rounded-2xl border border-sand-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-forest-600 uppercase">
              {evento.ubicacion.cliente.nombre}
            </p>
            <h1 className="mt-1 text-xl font-bold text-forest-950">
              {evento.ubicacion.nombre}
            </h1>
          </div>
          <span
            className={`shrink-0 rounded-md px-2 py-1 text-[11px] font-bold tracking-[0.12em] uppercase ${
              yaCompletado
                ? "bg-sprout-400/20 text-forest-800"
                : "bg-sand-100 text-forest-950/55"
            }`}
          >
            {evento.estado === "PROGRAMADO" ? t.comun.pendienteBadge : t.comun.completadoBadge}
          </span>
        </div>

        <div className="mt-4 space-y-2 text-sm text-forest-950/70">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-forest-400" />
            <span>{evento.hora}</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-forest-400" />
            <span>{evento.ubicacion.direccion}</span>
          </div>
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 shrink-0 text-forest-400" />
            <span>{evento.servicio.nombre}</span>
          </div>
        </div>

        {evento.ubicacion.notasDeAcceso && (
          <div className="mt-4 rounded-lg bg-sand-50 px-3.5 py-3 text-sm text-forest-950/70">
            <span className="font-semibold">{t.tecnico.detalle.acceso}</span>
            {evento.ubicacion.notasDeAcceso}
          </div>
        )}

        {evento.ubicacion.cliente.telefono && (
          <a
            href={`tel:${evento.ubicacion.cliente.telefono}`}
            className="mt-4 block rounded-xl border border-sand-200 px-4 py-2.5 text-center text-sm font-medium text-forest-700 transition hover:bg-sand-50"
          >
            {t.tecnico.detalle.llamarA(evento.ubicacion.cliente.nombre)}
          </a>
        )}
      </div>

      {/* Mapa */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-sm">
        <div className="h-64 sm:h-80">
          <MapaNavegacionLazy
            latitud={evento.ubicacion.latitud ? Number(evento.ubicacion.latitud) : null}
            longitud={evento.ubicacion.longitud ? Number(evento.ubicacion.longitud) : null}
            direccion={evento.ubicacion.direccion}
            cliente={evento.ubicacion.cliente.nombre}
            t={tCliente}
          />
        </div>
      </div>

      {/* Cierre del trabajo */}
      {!yaCompletado && (
        <div className="mt-4 rounded-2xl border border-sand-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-forest-950">{t.tecnico.detalle.cerrarTrabajo}</h2>
          <SubirEvidencia eventoId={evento.id} t={tCliente} />
        </div>
      )}

      {yaCompletado && evento.notas && (
        <div className="mt-4 rounded-2xl border border-sprout-300 bg-sprout-50 p-5">
          <p className="text-sm font-semibold text-forest-800">{t.tecnico.detalle.notasDelCierre}</p>
          <p className="mt-1 text-sm text-forest-950/70">{evento.notas}</p>
        </div>
      )}
    </div>
  );
}
