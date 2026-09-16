"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { requerirRol } from "@/lib/acceso";
import { diccionario } from "@/lib/i18n";
import { traducirError } from "@/lib/i18n/traducirError";
import { asignaciones } from "@/contextos/asignaciones/infraestructura/dependencias";
import { ErrorDeDominio } from "@/contextos/compartido/dominio/ErrorDeDominio";
import type { Periodicidad } from "@/contextos/asignaciones/dominio/Asignacion";
import {
  ESTADO_CREACION_INICIAL,
  type EstadoDeCreacionDeAsignacion,
} from "./estado";

export async function crearAsignacion(
  _estado: EstadoDeCreacionDeAsignacion,
  datos: FormData,
): Promise<EstadoDeCreacionDeAsignacion> {
  await requerirRol("OFICINA");

  const ubicacionId = (datos.get("ubicacionId") as string) ?? "";
  const servicioId = (datos.get("servicioId") as string) ?? "";
  const periodicidad = (datos.get("periodicidad") as string) ?? "";
  const precioPorEvento = (datos.get("precioPorEvento") as string) ?? "";
  const fechaInicio = (datos.get("fechaInicio") as string) ?? "";
  const fechaFin = (datos.get("fechaFin") as string) ?? "";

  const valores = { ubicacionId, servicioId, periodicidad, precioPorEvento, fechaInicio, fechaFin };
  const t = await diccionario();

  if (!ubicacionId) return { error: t.asignaciones.errores.eligeUbicacion, valores };
  if (!servicioId) return { error: t.asignaciones.errores.eligeServicio, valores };
  if (!["DIARIO", "SEMANAL", "QUINCENAL", "MENSUAL"].includes(periodicidad)) {
    return { error: t.asignaciones.errores.periodicidadInvalida, valores };
  }

  const precio = parseFloat(precioPorEvento);
  if (isNaN(precio)) return { error: t.asignaciones.errores.precioInvalido, valores };

  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  if (isNaN(inicio.getTime())) return { error: t.asignaciones.errores.fechaInicioInvalida, valores };
  if (isNaN(fin.getTime())) return { error: t.asignaciones.errores.fechaFinInvalida, valores };

  try {
    await asignaciones.crearAsignacion().ejecutar({
      ubicacionId,
      servicioId,
      periodicidad: periodicidad as Periodicidad,
      precioPorEvento: precio,
      fechaInicio: inicio,
      fechaFin: fin,
    });
  } catch (error) {
    if (error instanceof ErrorDeDominio) {
      return { error: traducirError(error, t), valores };
    }
    throw error;
  }

  revalidatePath("/app/oficina/asignaciones");
  redirect("/app/oficina/asignaciones");
}
