"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { establecerIdioma } from "@/lib/idioma";

export async function cambiarIdioma(formData: FormData): Promise<void> {
  const idioma = formData.get("idioma");
  const regresarA = String(formData.get("regresarA") ?? "/app");

  if (idioma === "es" || idioma === "en") {
    await establecerIdioma(idioma);
  }

  // Todo /app depende del idioma vía layout — sin esto, la navegación de
  // vuelta puede servir el router cache con el idioma anterior.
  revalidatePath("/app", "layout");
  redirect(regresarA);
}
