import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";

import type { UsuarioAutenticado } from "@/contextos/identidad/aplicacion/UsuarioAutenticado";
import { paneles, type ClaveDeSeccion } from "@/lib/paneles";
import type { Diccionario } from "@/lib/i18n";

type CopyDeSeccion = { titulo: string; resumen: string };

/**
 * El panel de cualquier rol.
 *
 * Cada sección es una tarjeta. Las que ya tienen módulo construido llevan
 * `ruta` y se vuelven enlaces; las demás siguen siendo esqueleto, para que se
 * vea a dónde va esto sin prometer una pantalla que todavía no existe.
 *
 * Los tres roles comparten este componente porque hoy se diferencian sólo en la
 * lista de secciones; en cuanto uno necesite algo propio, se separa.
 */
export function PanelDeRol({ usuario, t }: { usuario: UsuarioAutenticado; t: Diccionario }) {
  const panelRutas = paneles[usuario.rol];
  const panelCopy = t.paneles[usuario.rol];

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <header>
        <p className="text-[11px] font-semibold tracking-[0.18em] text-forest-600 uppercase">
          {t.comun.panelDe(panelCopy.etiqueta)}
        </p>
        <h1 className="mt-2.5 text-3xl font-bold tracking-tight text-forest-950">
          {t.comun.hola(usuario.nombre)}
        </h1>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-forest-950/60">
          {panelCopy.descripcion}
        </p>
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {panelRutas.secciones.map((seccion) => {
          const listo = Boolean(seccion.ruta);
          // Cada rol sólo itera las claves que su propio diccionario define — ver paneles.ts.
          const copy = (panelCopy.secciones as Record<ClaveDeSeccion, CopyDeSeccion>)[seccion.clave];

          const contenido = (
            <>
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  listo ? "bg-forest-700 text-sand-50" : "bg-forest-50 text-forest-700"
                }`}
              >
                <LayoutGrid className="h-4.5 w-4.5" aria-hidden />
              </span>

              <h2 className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-forest-950">
                {copy.titulo}
                {listo ? (
                  <ArrowRight
                    className="h-3.5 w-3.5 text-forest-600 transition group-hover:translate-x-0.5"
                    aria-hidden
                  />
                ) : null}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-forest-950/55">
                {copy.resumen}
              </p>

              <p
                className={`mt-4 inline-flex rounded-md px-2 py-1 text-[11px] font-bold tracking-[0.12em] uppercase ${
                  listo
                    ? "bg-sprout-400/20 text-forest-800"
                    : "bg-sand-100 text-forest-950/45"
                }`}
              >
                {listo ? t.comun.disponible : t.comun.pendienteBadge}
              </p>
            </>
          );

          return seccion.ruta ? (
            <Link
              key={seccion.clave}
              href={seccion.ruta}
              className="group rounded-2xl border border-sand-200 bg-white p-5 shadow-sm transition hover:border-sprout-400/60 hover:shadow-md focus-visible:ring-2 focus-visible:ring-forest-400 focus-visible:outline-none"
            >
              {contenido}
            </Link>
          ) : (
            <section
              key={seccion.clave}
              className="rounded-2xl border border-sand-200 bg-white/60 p-5"
            >
              {contenido}
            </section>
          );
        })}
      </div>

    </div>
  );
}
