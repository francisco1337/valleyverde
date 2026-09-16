import { AsistenteChat } from "@/components/ops/asistente/AsistenteChat";
import { requerirRol } from "@/lib/acceso";
import { diccionario } from "@/lib/i18n";
import { paraCliente } from "@/lib/i18n/paraCliente";

/** Ver src/app/app/(panel)/oficina/layout.tsx — mismo motivo, rol distinto. */
export default async function LayoutDeAdministrador({
  children,
}: LayoutProps<"/app/administrador">) {
  await requerirRol("ADMINISTRADOR");
  const t = await diccionario();

  return (
    <>
      {children}
      <AsistenteChat t={paraCliente(t)} />
    </>
  );
}
