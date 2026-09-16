import type { Evento } from "../Evento";

export interface RepositorioDeEventos {
  guardar(evento: Evento): Promise<void>;
}
