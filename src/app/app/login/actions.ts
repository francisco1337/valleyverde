"use server";

import { redirect } from "next/navigation";

import type { EstadoLogin } from "@/app/app/login/estado";
import { esErrorDeDominio } from "@/contextos/compartido/dominio/ErrorDeDominio";
import { identidad } from "@/contextos/identidad/infraestructura/dependencias";
import { rutaDelPanel } from "@/lib/paneles";
import { diccionario } from "@/lib/i18n";
import { traducirError } from "@/lib/i18n/traducirError";

/**
 * Adaptador de entrada: el formulario de login.
 *
 * Su único trabajo es traducir — FormData hacia adentro, mensaje de error o
 * redirección hacia afuera. Ninguna regla vive aquí.
 */

export async function iniciarSesion(
  _estadoPrevio: EstadoLogin,
  formData: FormData,
): Promise<EstadoLogin> {
  let destino: string;

  try {
    const usuario = await identidad.iniciarSesion().ejecutar({
      usuario: String(formData.get("usuario") ?? ""),
      contrasena: String(formData.get("contrasena") ?? ""),
    });

    destino = rutaDelPanel(usuario.rol);
  } catch (error) {
    const t = await diccionario();

    // Una regla de negocio ya trae un mensaje pensado para leerse.
    if (esErrorDeDominio(error)) {
      return { error: traducirError(error, t) };
    }

    // Lo demás es una falla técnica: se registra completa y se cuenta a medias.
    console.error("[login] fallo técnico al iniciar sesión:", error);
    return { error: t.login.errorConexion };
  }

  // Fuera del try: redirect() funciona lanzando una excepción que Next
  // intercepta, así que un catch alrededor se la tragaría.
  redirect(destino);
}

export async function cerrarSesion(): Promise<void> {
  await identidad.cerrarSesion().ejecutar();
  redirect("/app/login");
}
