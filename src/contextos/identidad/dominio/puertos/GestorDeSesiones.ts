import type { SesionDeUsuario } from "@/contextos/identidad/dominio/SesionDeUsuario";

/**
 * Puerto de salida: dónde vive la sesión entre peticiones.
 *
 * Hoy es un JWT en una cookie httpOnly. Podría ser Redis mañana sin que el
 * dominio ni los casos de uso se enteren.
 */
export interface GestorDeSesiones {
  abrir(sesion: SesionDeUsuario): Promise<void>;

  actual(): Promise<SesionDeUsuario | null>;

  cerrar(): Promise<void>;
}
