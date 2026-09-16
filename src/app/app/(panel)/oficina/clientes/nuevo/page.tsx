import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { FormularioDeCliente } from "@/components/ops/FormularioDeCliente";
import { requerirRol } from "@/lib/acceso";
import { diccionario } from "@/lib/i18n";
import { paraCliente } from "@/lib/i18n/paraCliente";

export const metadata: Metadata = {
  title: "Nuevo cliente",
  robots: { index: false, follow: false },
};

export default async function PaginaDeNuevoCliente() {
  await requerirRol("OFICINA");
  const t = await diccionario();

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-10 sm:px-8 sm:py-14">
      <Link
        href="/app/oficina/clientes"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-forest-950/50 transition hover:text-forest-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        {t.clientes.clientes}
      </Link>

      <header className="mt-5">
        <h1 className="text-3xl font-bold tracking-tight text-forest-950">
          {t.clientes.nuevoCliente}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-forest-950/60">
          {t.clientes.nuevoClienteAyuda}
        </p>
      </header>

      <div className="mt-8">
        <FormularioDeCliente t={paraCliente(t)} />
      </div>
    </div>
  );
}
