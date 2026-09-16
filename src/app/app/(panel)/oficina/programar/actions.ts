"use server";

import { revalidatePath } from "next/cache";

import { requerirRol } from "@/lib/acceso";
import { diccionario } from "@/lib/i18n";
import { traducirError } from "@/lib/i18n/traducirError";
import { eventos } from "@/contextos/eventos/infraestructura/dependencias";
import { ErrorDeDominio } from "@/contextos/compartido/dominio/ErrorDeDominio";
import { clientePrisma } from "@/contextos/compartido/infraestructura/persistencia/ClientePrisma";
import {
  ESTADO_PROGRAMACION_INICIAL,
  type EstadoDeProgramacion,
} from "./estado";

export async function programarEvento(
  _estado: EstadoDeProgramacion,
  datos: FormData,
): Promise<EstadoDeProgramacion> {
  await requerirRol("OFICINA");

  const asignacionId = (datos.get("asignacionId") as string) ?? "";
  const tecnicoId = (datos.get("tecnicoId") as string) ?? "";
  const fechaProgramada = (datos.get("fechaProgramada") as string) ?? "";
  const hora = (datos.get("hora") as string) ?? "";
  const notas = (datos.get("notas") as string) ?? "";

  const valores = { asignacionId, tecnicoId, fechaProgramada, hora, notas };
  const t = await diccionario();

  if (!asignacionId) return { error: t.programar.errores.eligeAsignacion, valores };
  if (!tecnicoId) return { error: t.programar.errores.eligeTecnico, valores };
  if (!fechaProgramada) return { error: t.programar.errores.eligeFecha, valores };
  if (!hora) return { error: t.programar.errores.indicaHora, valores };

  // Buscar la asignación para copiar servicioId, ubicacionId y precio
  const asignacion = await clientePrisma().asignacion.findUnique({
    where: { id: asignacionId },
    select: { servicioId: true, ubicacionId: true, precioPorEvento: true },
  });

  if (!asignacion) return { error: t.programar.errores.asignacionNoExiste, valores };

  const fecha = new Date(fechaProgramada);

  try {
    await eventos.programarEvento().ejecutar({
      asignacionId,
      servicioId: asignacion.servicioId,
      ubicacionId: asignacion.ubicacionId,
      tecnicoId,
      precio: Number(asignacion.precioPorEvento),
      fechaProgramada: fecha,
      hora,
      notas: notas || null,
    });
  } catch (error) {
    if (error instanceof ErrorDeDominio) {
      return { error: traducirError(error, t), valores };
    }
    // El unique constraint de (asignacionId, fechaProgramada, hora) puede causar Prisma P2002
    const prismaError = error as { code?: string };
    if (prismaError?.code === "P2002") {
      return { error: t.programar.errores.eventoDuplicado, valores };
    }
    throw error;
  }

  revalidatePath("/app/oficina/programar");
  // Devuelve estado limpio (no redirect: la lista está en la misma página)
  return ESTADO_PROGRAMACION_INICIAL;
}
