import type { Ubicacion } from "../Ubicacion";

export interface RepositorioDeUbicaciones {
  guardar(ubicacion: Ubicacion): Promise<void>;
}
