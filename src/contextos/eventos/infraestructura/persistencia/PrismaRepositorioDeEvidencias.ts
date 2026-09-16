import { clientePrisma } from "@/contextos/compartido/infraestructura/persistencia/ClientePrisma";
import type { Evidencia } from "../../dominio/Evidencia";
import type { RepositorioDeEvidencias } from "../../dominio/puertos/RepositorioDeEvidencias";

export class PrismaRepositorioDeEvidencias implements RepositorioDeEvidencias {
  async guardarVarias(evidencias: Evidencia[]): Promise<void> {
    if (evidencias.length === 0) return;

    await clientePrisma().evidencia.createMany({
      data: evidencias.map((evidencia) => ({
        id: evidencia.id,
        eventoId: evidencia.eventoId,
        imagen: evidencia.imagen,
      })),
    });
  }
}
