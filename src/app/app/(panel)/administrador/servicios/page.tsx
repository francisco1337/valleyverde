import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, DollarSign, Layers, Plus } from "lucide-react";

import { catalogoDeServicios } from "@/contextos/asignaciones/infraestructura/consultas/CatalogoDeServicios";
import { requerirRol } from "@/lib/acceso";
import { diccionario } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Catálogo de servicios",
  robots: { index: false, follow: false },
};

export default async function PaginaDeCatalogoDeServicios() {
  await requerirRol("ADMINISTRADOR");
  const t = await diccionario();

  const servicios = await catalogoDeServicios();

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <Link
        href="/app/administrador"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-forest-950/55 transition hover:text-forest-800"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.comun.panel}
      </Link>

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-forest-600 uppercase">
            {t.servicios.administrador}
          </p>
          <h1 className="mt-2.5 text-3xl font-bold tracking-tight text-forest-950">
            {t.servicios.catalogoDeServicios}
          </h1>
          <p className="mt-2 text-sm text-forest-950/60">
            {servicios.length === 0 ? t.servicios.todaviaNoHayNinguno : t.servicios.serviciosRegistrados(servicios.length)}
          </p>
        </div>

        <Link
          href="/app/administrador/servicios/nuevo"
          className="flex items-center gap-2 rounded-xl bg-forest-700 px-4 py-2.5 text-sm font-semibold text-sand-50 shadow-sm transition hover:bg-forest-600 focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:ring-offset-2 focus-visible:ring-offset-sand-50 focus-visible:outline-none"
        >
          <Plus className="h-4 w-4" aria-hidden />
          {t.servicios.nuevoServicio}
        </Link>
      </header>

      {servicios.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-sand-300 bg-white px-6 py-14 text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
            <Layers className="h-5 w-5" aria-hidden />
          </span>
          <p className="mt-4 text-sm font-semibold text-forest-950">
            {t.servicios.catalogoVacio}
          </p>
          <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-forest-950/55">
            {t.servicios.catalogoVacioCuerpo}
          </p>
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-sand-200 overflow-hidden rounded-2xl border border-sand-200 bg-white">
          {servicios.map((servicio) => (
            <li
              key={servicio.id}
              className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-4"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-forest-950">
                  {servicio.nombre}
                </p>
                {servicio.descripcion ? (
                  <p className="mt-0.5 truncate text-sm text-forest-950/55">
                    {servicio.descripcion}
                  </p>
                ) : null}
              </div>

              <div className="flex shrink-0 items-center gap-4">
                {servicio.precioSugerido ? (
                  <span className="flex items-center gap-1 text-sm text-forest-950/60">
                    <DollarSign className="h-3.5 w-3.5" aria-hidden />
                    {Number(servicio.precioSugerido).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                ) : null}

                {!servicio.activo ? (
                  <span className="rounded-md bg-sand-100 px-2 py-1 text-[11px] font-bold tracking-[0.12em] text-forest-950/45 uppercase">
                    {t.servicios.inactivo}
                  </span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
