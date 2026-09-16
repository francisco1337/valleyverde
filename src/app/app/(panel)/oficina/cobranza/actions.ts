"use server";

import { revalidatePath } from "next/cache";
import { requerirRol } from "@/lib/acceso";
import { clientePrisma } from "@/contextos/compartido/infraestructura/persistencia/ClientePrisma";

export async function marcarPagado(eventoId: string): Promise<void> {
  await requerirRol("OFICINA");

  const evento = await clientePrisma().evento.findUnique({
    where: { id: eventoId },
    select: { estado: true, pagado: true },
  });

  if (!evento) throw new Error("Evento no encontrado.");
  if (evento.estado !== "COMPLETADO") throw new Error("Solo se pueden cobrar eventos completados.");
  if (evento.pagado) return; // idempotente

  await clientePrisma().evento.update({
    where: { id: eventoId },
    data: { pagado: true, pagadoEn: new Date() },
  });

  revalidatePath("/app/oficina/cobranza");
}
