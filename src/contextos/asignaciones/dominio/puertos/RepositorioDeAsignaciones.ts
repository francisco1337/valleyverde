import type { Asignacion } from "../Asignacion";

export interface RepositorioDeAsignaciones {
  guardar(asignacion: Asignacion): Promise<void>;
}
