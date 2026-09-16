import { Evento } from "../dominio/Evento";
import type { RepositorioDeEventos } from "../dominio/puertos/RepositorioDeEventos";

type Datos = {
  asignacionId: string;
  servicioId: string;
  ubicacionId: string;
  tecnicoId: string;
  precio: number;
  fechaProgramada: Date;
  hora: string;
  notas?: string | null;
};

export class ProgramarEvento {
  constructor(private readonly repositorio: RepositorioDeEventos) {}

  async ejecutar(datos: Datos): Promise<{ id: string }> {
    const evento = Evento.programar(datos);
    await this.repositorio.guardar(evento);
    return { id: evento.id };
  }
}
