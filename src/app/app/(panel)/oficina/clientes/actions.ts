"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { EstadoDeAltaDeCliente } from "@/app/app/(panel)/oficina/clientes/estado";
import { esErrorDeDominio } from "@/contextos/compartido/dominio/ErrorDeDominio";
import { clientes } from "@/contextos/clientes/infraestructura/dependencias";
import { requerirRol } from "@/lib/acceso";
import { diccionario } from "@/lib/i18n";
import { traducirError } from "@/lib/i18n/traducirError";

/**
 * Adaptador de entrada: el formulario de alta de cliente.
 *
 * Traduce FormData hacia adentro y mensaje de error o redirección hacia
 * afuera. Ninguna regla de negocio vive aquí.
 */
export async function registrarCliente(
  _estadoPrevio: EstadoDeAltaDeCliente,
  formData: FormData,
): Promise<EstadoDeAltaDeCliente> {
  // Una server action es un endpoint público: se comprueba el rol aquí también,
  // no basta con que la página que pinta el formulario lo haya hecho.
  await requerirRol("OFICINA");

  const texto = (campo: string) => String(formData.get(campo) ?? "");

  const valores = {
    nombre: texto("nombre"),
    contacto: texto("contacto"),
    telefono: texto("telefono"),
    correo: texto("correo"),
    notas: texto("notas"),
  };

  const t = await diccionario();

  try {
    await clientes.registrarCliente().ejecutar(valores);
  } catch (error) {
    // Una regla de negocio ya trae un mensaje pensado para leerse.
    if (esErrorDeDominio(error)) {
      return { error: traducirError(error, t), valores };
    }

    console.error("[clientes] fallo técnico al registrar:", error);
    return { error: t.clientes.errorGuardarCliente, valores };
  }

  revalidatePath("/app/oficina/clientes");

  // Fuera del try: redirect() funciona lanzando una excepción que Next
  // intercepta, así que un catch alrededor se la tragaría.
  redirect("/app/oficina/clientes");
}
