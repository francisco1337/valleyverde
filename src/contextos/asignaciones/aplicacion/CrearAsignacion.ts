import { Asignacion, type DatosDeAlta } from "../dominio/Asignacion";
import type { RepositorioDeAsignaciones } from "../dominio/puertos/RepositorioDeAsignaciones";

export class CrearAsignacion {
  constructor(private readonly repositorio: RepositorioDeAsignaciones) {}

  async ejecutar(datos: DatosDeAlta): Promise<{ id: string }> {
    const asignacion = Asignacion.crear(datos);
    await this.repositorio.guardar(asignacion);
    return { id: asignacion.id };
  }
}
