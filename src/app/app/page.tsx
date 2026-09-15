import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { requerirSesion } from "@/lib/acceso";
import { rutaDelPanel } from "@/lib/paneles";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * /app no tiene pantalla propia: es el desvío hacia el panel que le toca a cada
 * quien. Así un enlace a "el sistema" sirve igual para los tres roles.
 */
export default async function PaginaDeOps() {
  const usuario = await requerirSesion();
  redirect(rutaDelPanel(usuario.rol));
}
