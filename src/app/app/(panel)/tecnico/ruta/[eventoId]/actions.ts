"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { clientePrisma } from "@/contextos/compartido/infraestructura/persistencia/ClientePrisma";
import { esErrorDeDominio } from "@/contextos/compartido/dominio/ErrorDeDominio";
import { eventos } from "@/contextos/eventos/infraestructura/dependencias";
import { requerirRol } from "@/lib/acceso";
import { diccionario } from "@/lib/i18n";
import { traducirError } from "@/lib/i18n/traducirError";

const MAXIMO_FOTOS = 5;

export async function completarEvento(
  eventoId: string,
  formData: FormData,
): Promise<{ error: string } | undefined> {
  const usuario = await requerirRol("TECNICO");
  const t = await diccionario();

  const evento = await clientePrisma().evento.findUnique({
    where: { id: eventoId },
    select: { tecnicoId: true, estado: true },
  });

  if (!evento || evento.tecnicoId !== usuario.id) {
    return { error: t.tecnico.detalle.errorNoEncontrado };
  }

  if (evento.estado !== "PROGRAMADO") {
    return { error: t.tecnico.detalle.errorYaCerrado };
  }

  const notas = (formData.get("notas") as string | null)?.trim() || null;

  const imagenes: string[] = [];
  for (let i = 0; i < MAXIMO_FOTOS; i++) {
    const valor = formData.get(`foto_${i}`);
    if (typeof valor === "string" && valor) imagenes.push(valor);
  }

  try {
    await eventos.registrarEvidencias().ejecutar({ eventoId, imagenes });
  } catch (error) {
    if (esErrorDeDominio(error)) return { error: traducirError(error, t) };
    throw error;
  }

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
