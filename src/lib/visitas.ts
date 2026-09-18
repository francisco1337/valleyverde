"use server";

import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { clientePrisma } from "@/contextos/compartido/infraestructura/persistencia/ClientePrisma";
import { requerirRol, usuarioActual } from "@/lib/acceso";
import { hoyEnPhoenix } from "@/lib/tiempo";

/** El primer salto de x-forwarded-for (o x-real-ip) — no verificado contra un proxy de confianza. */
async function ipDelVisitante(): Promise<string | null> {
  const cabeceras = await headers();
  const reenviada = cabeceras.get("x-forwarded-for");
  if (reenviada) return reenviada.split(",")[0].trim();
  return cabeceras.get("x-real-ip");
}

/** Fecha y hora de Phoenix (MST, sin horario de verano) para el registro. */
function horaEnPhoenix(): string {
  const mst = new Date(Date.now() - 7 * 60 * 60 * 1000);
  const hh = String(mst.getUTCHours()).padStart(2, "0");
  const mm = String(mst.getUTCMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

/**
 * Bitácora de vistas de página, sitio público + panel interno — ver Visita en
 * schema.prisma. Se llama desde `RegistradorDeVisitas` en cada cambio de ruta;
 * si falla, no debe tumbar la navegación del usuario, por eso el llamador la
 * envuelve en un catch silencioso.
 */
export async function registrarVisita(ruta: string): Promise<void> {
  const [usuario, ip] = await Promise.all([usuarioActual(), ipDelVisitante()]);

  await clientePrisma().visita.create({
    data: {
      id: randomUUID(),
      ruta: ruta.slice(0, 255),
      fecha: hoyEnPhoenix(),
      hora: horaEnPhoenix(),
      rol: usuario?.rol,
      usuarioId: usuario?.id,
      ip,
    },
  });
}

/** Borra toda la bitácora de visitas — irreversible, por eso vive detrás de ADMINISTRADOR. */
export async function vaciarVisitas(): Promise<void> {
  await requerirRol("ADMINISTRADOR");
  await clientePrisma().visita.deleteMany({});
  revalidatePath("/app/administrador/visitas");
}
