"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { EstadoDeAltaDeServicio } from "@/app/app/(panel)/administrador/servicios/nuevo/estado";
import { clientePrisma } from "@/contextos/compartido/infraestructura/persistencia/ClientePrisma";
import { requerirRol } from "@/lib/acceso";
import { diccionario } from "@/lib/i18n";

export async function crearServicio(
  _estadoPrevio: EstadoDeAltaDeServicio,
  formData: FormData,
): Promise<EstadoDeAltaDeServicio> {
  await requerirRol("ADMINISTRADOR");

  const texto = (campo: string) => String(formData.get(campo) ?? "").trim();

  const valores = {
    nombre: texto("nombre"),
    descripcion: texto("descripcion"),
    precioSugerido: texto("precioSugerido"),
  };

  const t = await diccionario();

  if (!valores.nombre) {
    return { error: t.servicios.errores.nombreObligatorio, valores };
  }

  const precio =
    valores.precioSugerido !== ""
      ? parseFloat(valores.precioSugerido.replace(/,/g, ""))
      : null;

  if (precio !== null && (isNaN(precio) || precio < 0)) {
    return { error: t.servicios.errores.precioInvalido, valores };
  }

  try {
    await clientePrisma().servicio.create({
      data: {
        id: randomUUID(),
        nombre: valores.nombre,
        descripcion: valores.descripcion || null,
        precioSugerido: precio,
      },
    });
  } catch (error: unknown) {
    const e = error as { code?: string };
    if (e?.code === "P2002") {
      return { error: t.servicios.errores.nombreDuplicado(valores.nombre), valores };
    }
    console.error("[servicios] fallo técnico al crear:", error);
    return { error: t.servicios.errores.errorGuardar, valores };
  }

  revalidatePath("/app/administrador/servicios");
  redirect("/app/administrador/servicios");
}
