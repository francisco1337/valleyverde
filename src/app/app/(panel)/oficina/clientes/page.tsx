import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, Plus, Users } from "lucide-react";

import { clientesDeLaCartera } from "@/contextos/clientes/infraestructura/consultas/ClientesDeLaCartera";
import { requerirRol } from "@/lib/acceso";

export const metadata: Metadata = {
  title: "Clientes",
  robots: { index: false, follow: false },
};

export default async function PaginaDeClientes() {
  // La puerta: aquí no entra nadie con otro rol, aunque escriba la URL a mano.
  await requerirRol("OFICINA");

  const cartera = await clientesDeLaCartera();

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-forest-600 uppercase">
            Cartera
          </p>
          <h1 className="mt-2.5 text-3xl font-bold tracking-tight text-forest-950">
            Clientes
          </h1>
          <p className="mt-2 text-sm text-forest-950/60">
            {cartera.length === 0
              ? "Todavía no hay ninguno."
              : `${cartera.length} ${cartera.length === 1 ? "cliente activo" : "clientes activos"}.`}
          </p>
        </div>

        <Link
          href="/app/oficina/clientes/nuevo"
          className="flex items-center gap-2 rounded-xl bg-forest-700 px-4 py-2.5 text-sm font-semibold text-sand-50 shadow-sm transition hover:bg-forest-600 focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:ring-offset-2 focus-visible:ring-offset-sand-50 focus-visible:outline-none"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Nuevo cliente
        </Link>
      </header>

      {cartera.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-sand-300 bg-white px-6 py-14 text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
            <Users className="h-5 w-5" aria-hidden />
          </span>
          <p className="mt-4 text-sm font-semibold text-forest-950">
            La cartera está vacía
          </p>
          <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-forest-950/55">
            Da de alta el primer cliente. Después le cuelgas sus ubicaciones y a
            cada ubicación los servicios que tiene contratados.
          </p>
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-sand-200 overflow-hidden rounded-2xl border border-sand-200 bg-white">
          {cartera.map((cliente) => (
            <li
              key={cliente.id}
              className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1.5 px-5 py-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-forest-950">
                  {cliente.nombre}
                </p>
                {cliente.contacto ? (
                  <p className="mt-0.5 truncate text-sm text-forest-950/55">
                    {cliente.contacto}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-forest-950/60">
                {cliente.telefono ? (
                  <a
                    href={`tel:${cliente.telefono.replace(/[^\d+]/g, "")}`}
                    className="flex items-center gap-1.5 transition hover:text-forest-700"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    {cliente.telefono}
                  </a>
                ) : null}

                {cliente.correo ? (
                  <a
                    href={`mailto:${cliente.correo}`}
                    className="flex min-w-0 items-center gap-1.5 transition hover:text-forest-700"
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    <span className="truncate">{cliente.correo}</span>
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
