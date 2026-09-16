import { Evidencia } from "../dominio/Evidencia";
import type { RepositorioDeEvidencias } from "../dominio/puertos/RepositorioDeEvidencias";

export class RegistrarEvidencias {
  constructor(private readonly repositorio: RepositorioDeEvidencias) {}

  async ejecutar(datos: { eventoId: string; imagenes: string[] }): Promise<void> {
    if (datos.imagenes.length === 0) return;

    const evidencias = Evidencia.registrarVarias(datos.eventoId, datos.imagenes);
    await this.repositorio.guardarVarias(evidencias);
  }
}
