import { ROLES, type Rol } from "@/contextos/identidad/dominio/Rol";

/**
 * Datos de la app de operaciones que no dependen del idioma (todo lo que
 * cuelga de /app). El texto sí depende del idioma y vive en
 * `src/lib/i18n/slices/login.ts`.
 */

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
export const cuentasIniciales: { rol: Rol; usuario: string; contrasena: string }[] = ROLES.map(
  (rol) => ({ rol, usuario: rol, contrasena: rol }),
);
