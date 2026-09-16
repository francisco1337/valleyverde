import type { Evidencia } from "../Evidencia";

export interface RepositorioDeEvidencias {
  guardarVarias(evidencias: Evidencia[]): Promise<void>;
}
