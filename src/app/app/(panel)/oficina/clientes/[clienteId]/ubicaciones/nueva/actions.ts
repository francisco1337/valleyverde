"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { requerirRol } from "@/lib/acceso";
import { diccionario } from "@/lib/i18n";
import { traducirError } from "@/lib/i18n/traducirError";
import { clientes } from "@/contextos/clientes/infraestructura/dependencias";
import { ErrorDeDominio } from "@/contextos/compartido/dominio/ErrorDeDominio";
import {
  ESTADO_ALTA_INICIAL,
  type EstadoDeAltaDeUbicacion,
} from "./estado";

export async function registrarUbicacion(
  _estado: EstadoDeAltaDeUbicacion,
  datos: FormData,
): Promise<EstadoDeAltaDeUbicacion> {
  await requerirRol("OFICINA");

  const clienteId = datos.get("clienteId") as string;
  const nombre = (datos.get("nombre") as string) ?? "";
  const direccion = (datos.get("direccion") as string) ?? "";
  const notasDeAcceso = (datos.get("notasDeAcceso") as string) ?? "";

  const valores = { nombre, direccion, notasDeAcceso };

  try {
    await clientes.registrarUbicacion().ejecutar({
      clienteId,
      nombre,
      direccion,
      notasDeAcceso: notasDeAcceso || null,
    });
  } catch (error) {
    if (error instanceof ErrorDeDominio) {
      const t = await diccionario();
      return { error: traducirError(error, t), valores };
    }
    throw error;
  }

  revalidatePath(`/app/oficina/clientes/${clienteId}`);
  redirect(`/app/oficina/clientes/${clienteId}`);
}
