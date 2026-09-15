import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import type { UsuarioAutenticado } from "@/contextos/identidad/aplicacion/UsuarioAutenticado";
import type { Rol } from "@/contextos/identidad/dominio/Rol";
import { identidad } from "@/contextos/identidad/infraestructura/dependencias";
import { rutaDelPanel } from "@/lib/paneles";

/**
 * Adaptador de entrada para páginas y layouts: traduce el caso de uso al
 * lenguaje de Next (redirecciones).
 *
 * `cache` de React lo memoriza por render, así que el layout y la página
 * pueden preguntar quién entró sin pegarle dos veces a la base.
 */
export const usuarioActual = cache(
  async (): Promise<UsuarioAutenticado | null> =>
    identidad.obtenerUsuarioAutenticado().ejecutar(),
);

/** Exige sesión. Sin ella, al login. */
export async function requerirSesion(): Promise<UsuarioAutenticado> {
  const usuario = await usuarioActual();
  if (!usuario) redirect("/app/login");
  return usuario;
}

/**
 * Exige un rol concreto.
 *
 * Si entró con otro rol se le manda a su propio panel en vez de enseñarle un
 * error: no se equivocó de sistema, se equivocó de puerta.
 */
export async function requerirRol(rol: Rol): Promise<UsuarioAutenticado> {
  const usuario = await requerirSesion();
  if (usuario.rol !== rol) redirect(rutaDelPanel(usuario.rol));
  return usuario;
}
