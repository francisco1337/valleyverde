import type { GestorDeSesiones } from "@/contextos/identidad/dominio/puertos/GestorDeSesiones";

/** Caso de uso: alguien sale del sistema. */
export class CerrarSesion {
  constructor(private readonly sesiones: GestorDeSesiones) {}

  async ejecutar(): Promise<void> {
    await this.sesiones.cerrar();
  }
}
