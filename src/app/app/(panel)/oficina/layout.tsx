import { AsistenteChat } from "@/components/ops/asistente/AsistenteChat";
import { requerirRol } from "@/lib/acceso";
import { diccionario } from "@/lib/i18n";
import { paraCliente } from "@/lib/i18n/paraCliente";

/**
 * Monta el asistente interno solo para OFICINA (y ADMINISTRADOR, que pasa
 * cualquier puerta). Existe como layout propio — en vez de agregarlo al
 * layout compartido de (panel) — precisamente para que TECNICO nunca lo
 * reciba: ese árbol de rutas no importa este archivo.
 */
export default async function LayoutDeOficina({ children }: LayoutProps<"/app/oficina">) {
  await requerirRol("OFICINA");
  const t = await diccionario();

  return (
    <>
      {children}
      <AsistenteChat t={paraCliente(t)} />
    </>
  );
}
