import { ROLES, type Rol } from "@/contextos/identidad/dominio/Rol";
import { paneles } from "@/lib/paneles";

/**
 * Textos de la app de operaciones (todo lo que cuelga de /app).
 *
 * Aparte de lib/site.ts a propósito: ese archivo es lo que lee el cliente, este
 * es la herramienta que usa la cuadrilla. El sitio público va en inglés; la app
 * interna, en español, que es como se trabaja.
 */

export const ops = {
  nombre: "Valley Verde Operaciones",
  nombreCorto: "Verde Ops",
  lema: "Propiedades, cuadrillas y cobranza en un solo lugar",
} as const;

/** Todo lo que cuelga de /app es la app interna y se pinta sin el sitio. */
export const RUTA_BASE_OPS = "/app";

export function esRutaOps(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return pathname === RUTA_BASE_OPS || pathname.startsWith(`${RUTA_BASE_OPS}/`);
}

/**
 * Las cuentas que deja sembradas `npm run db:seed`, mostradas en la pantalla de
 * entrada a propósito: un sistema al que nadie puede entrar no se puede probar.
 *
 * Son credenciales de arranque. Cuando dejen de serlo, se borra esta lista y
 * con ella los botones de la pantalla de login.
 */
export const cuentasIniciales: {
  rol: Rol;
  usuario: string;
  contrasena: string;
  descripcion: string;
}[] = ROLES.map((rol) => ({
  rol,
  usuario: rol,
  contrasena: rol,
  descripcion: paneles[rol].descripcion,
}));

/** Lo que promete la pantalla de entrada, antes de que nadie haya entrado. */
export const puntosFuertesOps = [
  {
    icono: "ruta" as const,
    titulo: "La ruta del día, ya armada",
    cuerpo: "Cada parada programada en orden de manejo y asignada a una cuadrilla.",
  },
  {
    icono: "archivo" as const,
    titulo: "Cotizaciones en menos de un minuto",
    cuerpo: "Eliges propiedad, eliges servicios, mandas el PDF.",
  },
  {
    icono: "cartera" as const,
    titulo: "Quién pagó y quién debe",
    cuerpo: "Cuentas por cobrar por cliente, con antigüedad y sin cuadrar nada a mano.",
  },
];
