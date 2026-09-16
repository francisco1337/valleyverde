import { clientePrisma } from "@/contextos/compartido/infraestructura/persistencia/ClientePrisma";
import type { Asignacion } from "../../dominio/Asignacion";
import type { RepositorioDeAsignaciones } from "../../dominio/puertos/RepositorioDeAsignaciones";

export class PrismaRepositorioDeAsignaciones implements RepositorioDeAsignaciones {
  async guardar(asignacion: Asignacion): Promise<void> {
    await clientePrisma().asignacion.create({
      data: {
        id: asignacion.id,
        ubicacionId: asignacion.ubicacionId,
        servicioId: asignacion.servicioId,
        periodicidad: asignacion.periodicidad,
        precioPorEvento: asignacion.precioPorEvento,
        fechaInicio: asignacion.fechaInicio,
        fechaFin: asignacion.fechaFin,
        activo: asignacion.activo,
      },
    });
  }
}
