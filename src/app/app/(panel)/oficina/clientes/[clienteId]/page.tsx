import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Plus } from "lucide-react";

import { requerirRol } from "@/lib/acceso";
import { clientePrisma } from "@/contextos/compartido/infraestructura/persistencia/ClientePrisma";
import { ubicacionesDelCliente } from "@/contextos/clientes/infraestructura/consultas/UbicacionesDelCliente";

export const metadata: Metadata = {
  title: "Cliente",
  robots: { index: false, follow: false },
};

export default async function PaginaDeCliente({
  params,
}: {
  params: Promise<{ clienteId: string }>;
}) {
  await requerirRol("OFICINA");
  const { clienteId } = await params;

  const cliente = await clientePrisma().cliente.findUnique({
    where: { id: clienteId },
    select: { id: true, nombre: true, contacto: true, telefono: true, correo: true },
  });

  if (!cliente) notFound();

  const ubicaciones = await ubicacionesDelCliente(clienteId);

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <nav className="mb-6 text-sm text-forest-950/50">
        <Link href="/app/oficina/clientes" className="transition hover:text-forest-700">
          Clientes
        </Link>
        <span className="mx-2">/</span>
        <span className="text-forest-950">{cliente.nombre}</span>
      </nav>

      <header className="mb-10">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-forest-600 uppercase">
          Cliente
        </p>
        <h1 className="mt-2.5 text-3xl font-bold tracking-tight text-forest-950">
          {cliente.nombre}
        </h1>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-forest-950/60">
          {cliente.contacto && <span>{cliente.contacto}</span>}
          {cliente.telefono && (
            <a href={`tel:${cliente.telefono.replace(/[^\d+]/g, "")}`} className="transition hover:text-forest-700">
              {cliente.telefono}
            </a>
          )}
          {cliente.correo && (
            <a href={`mailto:${cliente.correo}`} className="transition hover:text-forest-700">
              {cliente.correo}
            </a>
          )}
        </div>
      </header>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] text-forest-600 uppercase">
              Propiedades
            </p>
            <h2 className="mt-1.5 text-xl font-bold tracking-tight text-forest-950">
              Ubicaciones
            </h2>
            <p className="mt-1 text-sm text-forest-950/60">
              {ubicaciones.length === 0
                ? "Todavía no hay ninguna."
                : `${ubicaciones.length} ${ubicaciones.length === 1 ? "ubicación activa" : "ubicaciones activas"}.`}
            </p>
          </div>

          <Link
            href={`/app/oficina/clientes/${clienteId}/ubicaciones/nueva`}
            className="flex items-center gap-2 rounded-xl bg-forest-700 px-4 py-2.5 text-sm font-semibold text-sand-50 shadow-sm transition hover:bg-forest-600 focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:ring-offset-2 focus-visible:ring-offset-sand-50 focus-visible:outline-none"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Nueva ubicación
          </Link>
        </div>

        {ubicaciones.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-sand-300 bg-white px-6 py-12 text-center">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
              <MapPin className="h-5 w-5" aria-hidden />
            </span>
            <p className="mt-4 text-sm font-semibold text-forest-950">Sin ubicaciones</p>
            <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-forest-950/55">
              Agrega las propiedades de este cliente para poder asignarles servicios.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-sand-200 overflow-hidden rounded-2xl border border-sand-200 bg-white">
            {ubicaciones.map((u) => (
              <li key={u.id} className="px-5 py-4">
                <p className="text-sm font-semibold text-forest-950">{u.nombre}</p>
                <p className="mt-0.5 text-sm text-forest-950/55">{u.direccion}</p>
                {u.notasDeAcceso && (
                  <p className="mt-1 text-xs text-forest-950/40">{u.notasDeAcceso}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
