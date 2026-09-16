import type { Metadata } from "next";
import Link from "next/link";

import { requerirRol } from "@/lib/acceso";
import {
  ubicacionesParaAsignar,
  serviciosParaAsignar,
} from "@/contextos/asignaciones/infraestructura/consultas/OpcionesDeFormulario";
import { FormularioDeAsignacion } from "@/components/ops/FormularioDeAsignacion";

export const metadata: Metadata = {
  title: "Nueva asignación",
  robots: { index: false, follow: false },
};

export default async function PaginaNuevaAsignacion() {
  await requerirRol("OFICINA");

  const [ubicaciones, servicios] = await Promise.all([
    ubicacionesParaAsignar(),
    serviciosParaAsignar(),
  ]);

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-10 sm:px-8 sm:py-14">
      <nav className="mb-6 text-sm text-forest-950/50">
        <Link href="/app/oficina/asignaciones" className="transition hover:text-forest-700">
          Asignaciones
        </Link>
        <span className="mx-2">/</span>
        <span className="text-forest-950">Nueva</span>
      </nav>

      <header className="mb-8">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-forest-600 uppercase">
          Programación
        </p>
        <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-forest-950">
          Nueva asignación
        </h1>
        <p className="mt-2 text-sm text-forest-950/60">
          Define el servicio recurrente para una propiedad: qué se hace, con qué frecuencia y a qué precio. El técnico se asigna al programar cada visita.
        </p>
      </header>

      {ubicaciones.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-sand-300 bg-white px-6 py-12 text-center">
          <p className="text-sm font-semibold text-forest-950">No hay ubicaciones</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-forest-950/55">
            Primero da de alta un cliente y agrega sus propiedades.
          </p>
          <Link
            href="/app/oficina/clientes"
            className="mt-4 inline-block rounded-xl bg-forest-700 px-4 py-2.5 text-sm font-semibold text-sand-50"
          >
            Ir a Clientes
          </Link>
        </div>
      ) : (
        <FormularioDeAsignacion ubicaciones={ubicaciones} servicios={servicios} />
      )}
    </div>
  );
}
