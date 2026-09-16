import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";

/**
 * Idioma de la app interna (/app). El sitio público siempre está en inglés —
 * esto es sólo para el panel de operaciones, que se construyó en español
 * porque así trabaja la cuadrilla real, pero se vende a otras compañías que
 * pueden preferir inglés.
 */
export type Idioma = "es" | "en";

export const COOKIE_IDIOMA = "vv_idioma";

/** Español por default: es como trabaja hoy la cuadrilla real de Valley Verde. */
const IDIOMA_POR_DEFECTO: Idioma = "es";

export const idiomaActual = cache(async (): Promise<Idioma> => {
  const almacen = await cookies();
  const valor = almacen.get(COOKIE_IDIOMA)?.value;
  return valor === "en" ? "en" : IDIOMA_POR_DEFECTO;
});

export async function establecerIdioma(idioma: Idioma): Promise<void> {
  const almacen = await cookies();
  almacen.set(COOKIE_IDIOMA, idioma, {
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
}
