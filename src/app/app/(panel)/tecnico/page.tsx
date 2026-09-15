import type { Metadata } from "next";

import { PanelDeRol } from "@/components/ops/PanelDeRol";
import { requerirRol } from "@/lib/acceso";
import { paneles } from "@/lib/paneles";

export const metadata: Metadata = {
  title: paneles.TECNICO.etiqueta,
  robots: { index: false, follow: false },
};

export default async function PaginaDeTecnico() {
  // La puerta: aquí no entra nadie con otro rol, aunque escriba la URL a mano.
  const usuario = await requerirRol("TECNICO");

  return <PanelDeRol usuario={usuario} />;
}
