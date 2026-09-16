"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { requerirRol } from "@/lib/acceso";
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

  if (!ubicacionId) return { error: "Elige una ubicación.", valores };
  if (!servicioId) return { error: "Elige un servicio.", valores };
  if (!["DIARIO", "SEMANAL", "QUINCENAL", "MENSUAL"].includes(periodicidad)) {
    return { error: "Periodicidad inválida.", valores };
  }

  const precio = parseFloat(precioPorEvento);
  if (isNaN(precio)) return { error: "El precio no es un número válido.", valores };

  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  if (isNaN(inicio.getTime())) return { error: "Fecha de inicio inválida.", valores };
  if (isNaN(fin.getTime())) return { error: "Fecha de fin inválida.", valores };

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
      return { error: error.message, valores };
    }
    throw error;
  }

  revalidatePath("/app/oficina/asignaciones");
  redirect("/app/oficina/asignaciones");
}
