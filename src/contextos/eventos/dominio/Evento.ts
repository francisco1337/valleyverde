import { randomUUID } from "crypto";
import { ErrorDeDominio } from "@/contextos/compartido/dominio/ErrorDeDominio";

export class HoraInvalida extends ErrorDeDominio {
  constructor() {
    super('La hora debe tener el formato HH:MM (ej. 08:30).');
  }
}

export class FechaProgramadaInvalida extends ErrorDeDominio {
  constructor() {
    super("La fecha programada no es válida.");
  }
}

type DatosDeAlta = {
  asignacionId: string;
  servicioId: string;
  ubicacionId: string;
  tecnicoId: string;
  precio: number;
  fechaProgramada: Date;
  hora: string; // "HH:MM"
  notas?: string | null;
};

const HORA_RE = /^\d{2}:\d{2}$/;

export class Evento {
  private constructor(
    readonly id: string,
    readonly asignacionId: string,
    readonly servicioId: string,
    readonly ubicacionId: string,
    readonly tecnicoId: string,
    readonly precio: number,
    readonly fechaProgramada: Date,
    readonly hora: string,
    readonly notas: string | null,
  ) {}

  static programar(datos: DatosDeAlta): Evento {
    if (!HORA_RE.test(datos.hora)) throw new HoraInvalida();
    if (isNaN(datos.fechaProgramada.getTime())) throw new FechaProgramadaInvalida();

    return new Evento(
      randomUUID(),
      datos.asignacionId,
      datos.servicioId,
      datos.ubicacionId,
      datos.tecnicoId,
      datos.precio,
      datos.fechaProgramada,
      datos.hora,
      datos.notas?.trim() || null,
    );
  }
}
