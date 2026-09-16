import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { FormularioDeServicio } from "@/components/ops/FormularioDeServicio";
import { requerirRol } from "@/lib/acceso";
import { diccionario } from "@/lib/i18n";
import { paraCliente } from "@/lib/i18n/paraCliente";

export const metadata: Metadata = {
  title: "Nuevo servicio",
  robots: { index: false, follow: false },
};

export default async function PaginaDeNuevoServicio() {
  await requerirRol("ADMINISTRADOR");
  const t = await diccionario();

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-10 sm:px-8 sm:py-14">
      <Link
        href="/app/administrador/servicios"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-forest-950/50 transition hover:text-forest-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        {t.servicios.catalogoDeServicios}
      </Link>

      <header className="mt-5">
        <h1 className="text-3xl font-bold tracking-tight text-forest-950">
          {t.servicios.nuevoServicio}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-forest-950/60">
          {t.servicios.nuevoServicioAyuda}
        </p>
      </header>

      <div className="mt-8">
        <FormularioDeServicio t={paraCliente(t)} />
      </div>
    </div>
  );
}
