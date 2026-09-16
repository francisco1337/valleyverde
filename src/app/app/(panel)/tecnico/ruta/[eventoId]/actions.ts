"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { clientePrisma } from "@/contextos/compartido/infraestructura/persistencia/ClientePrisma";
import { requerirRol } from "@/lib/acceso";

export async function completarEvento(
  eventoId: string,
  formData: FormData,
): Promise<{ error: string } | undefined> {
  const usuario = await requerirRol("TECNICO");

  const evento = await clientePrisma().evento.findUnique({
    where: { id: eventoId },
    select: { tecnicoId: true, estado: true },
  });

  if (!evento || evento.tecnicoId !== usuario.id) {
    return { error: "Evento no encontrado o no autorizado." };
  }

  if (evento.estado !== "PROGRAMADO") {
    return { error: "Este trabajo ya está cerrado." };
  }

  const notas = (formData.get("notas") as string | null)?.trim() || null;

  await clientePrisma().evento.update({
    where: { id: eventoId },
    data: {
      estado: "COMPLETADO",
      completadoEn: new Date(),
      completadoPor: usuario.id,
      notas,
    },
  });

  revalidatePath("/app/tecnico/ruta");
  redirect("/app/tecnico/ruta");
}
