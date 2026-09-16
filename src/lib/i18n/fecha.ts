import type { Idioma } from "@/lib/idioma";

/** El locale de formato de fecha para cada idioma de la UI. Phoenix es MST — esto sólo cambia el texto, no la zona horaria. */
const LOCALE_POR_IDIOMA: Record<Idioma, string> = {
  es: "es-MX",
  en: "en-US",
};

export function formatearFecha(
  fecha: Date,
  idioma: Idioma,
  opciones: Intl.DateTimeFormatOptions,
): string {
  return fecha.toLocaleDateString(LOCALE_POR_IDIOMA[idioma], opciones);
}
