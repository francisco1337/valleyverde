import type { Metadata } from "next";

import { PanelDeRol } from "@/components/ops/PanelDeRol";
import { requerirRol } from "@/lib/acceso";
import { diccionario } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "OFICINA",
  robots: { index: false, follow: false },
};

export default async function PaginaDeOficina() {
  // La puerta: aquí no entra nadie con otro rol, aunque escriba la URL a mano.
  const usuario = await requerirRol("OFICINA");
  const t = await diccionario();

  return <PanelDeRol usuario={usuario} t={t} />;
}
