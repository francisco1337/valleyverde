import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { requerirRol } from "@/lib/acceso";
import { diccionario } from "@/lib/i18n";
import { paraCliente } from "@/lib/i18n/paraCliente";
import { clientePrisma } from "@/contextos/compartido/infraestructura/persistencia/ClientePrisma";
import { FormularioDeUbicacion } from "@/components/ops/FormularioDeUbicacion";

export const metadata: Metadata = {
  title: "Nueva ubicación",
  robots: { index: false, follow: false },
};

export default async function PaginaNuevaUbicacion({
  params,
}: {
  params: Promise<{ clienteId: string }>;
}) {
  await requerirRol("OFICINA");
  const t = await diccionario();
  const { clienteId } = await params;

  const cliente = await clientePrisma().cliente.findUnique({
    where: { id: clienteId },
    select: { id: true, nombre: true },
  });

  if (!cliente) notFound();

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-10 sm:px-8 sm:py-14">
      <nav className="mb-6 text-sm text-forest-950/50">
        <Link href="/app/oficina/clientes" className="transition hover:text-forest-700">
          {t.clientes.clientes}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/app/oficina/clientes/${clienteId}`} className="transition hover:text-forest-700">
          {cliente.nombre}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-forest-950">{t.clientes.nuevaUbicacion}</span>
      </nav>

      <header className="mb-8">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-forest-600 uppercase">
          {cliente.nombre}
        </p>
        <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-forest-950">
          {t.clientes.nuevaUbicacion}
        </h1>
        <p className="mt-2 text-sm text-forest-950/60">
          {t.clientes.nuevaUbicacionAyuda}
        </p>
      </header>

      <FormularioDeUbicacion clienteId={clienteId} t={paraCliente(t)} />
    </div>
  );
}
