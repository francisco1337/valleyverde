import { LayoutGrid } from "lucide-react";

import type { UsuarioAutenticado } from "@/contextos/identidad/aplicacion/UsuarioAutenticado";
import { paneles } from "@/lib/paneles";

/**
 * El panel de cualquier rol.
 *
 * Por ahora cada sección es una tarjeta vacía que dice a qué rol pertenece:
 * es el esqueleto sobre el que se van a colgar los módulos de verdad. Los tres
 * roles comparten este componente porque hoy se diferencian sólo en la lista de
 * secciones; en cuanto uno necesite algo propio, se separa.
 */
export function PanelDeRol({ usuario }: { usuario: UsuarioAutenticado }) {
  const panel = paneles[usuario.rol];

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <header>
        <p className="text-[11px] font-semibold tracking-[0.18em] text-forest-600 uppercase">
          Panel de {panel.etiqueta}
        </p>
        <h1 className="mt-2.5 text-3xl font-bold tracking-tight text-forest-950">
          Hola, {usuario.nombre}
        </h1>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-forest-950/60">
          {panel.descripcion}
        </p>
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {panel.secciones.map((seccion) => (
          <section
            key={seccion.titulo}
            className="rounded-2xl border border-sand-200 bg-white p-5 shadow-sm"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest-50 text-forest-700">
              <LayoutGrid className="h-4.5 w-4.5" aria-hidden />
            </span>

            <h2 className="mt-4 text-sm font-semibold text-forest-950">
              {seccion.titulo}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-forest-950/55">
              {seccion.resumen}
            </p>

            <p className="mt-4 inline-flex rounded-md bg-sand-100 px-2 py-1 text-[11px] font-bold tracking-[0.12em] text-forest-800 uppercase">
              {panel.etiqueta}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
