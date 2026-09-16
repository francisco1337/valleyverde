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
 * ADMINISTRADOR tiene acceso total: pasa por cualquier puerta.
 * Los demás roles sólo entran a su propia sección; si se equivocan de puerta
 * se les manda a su panel en vez de mostrarles un error.
 */
export async function requerirRol(rol: Rol): Promise<UsuarioAutenticado> {
  const usuario = await requerirSesion();
  if (usuario.rol !== rol && usuario.rol !== "ADMINISTRADOR")
    redirect(rutaDelPanel(usuario.rol));
  return usuario;
}
