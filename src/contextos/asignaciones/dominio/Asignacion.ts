import { randomUUID } from "crypto";
import { ErrorDeDominio } from "@/contextos/compartido/dominio/ErrorDeDominio";

export type Periodicidad = "DIARIO" | "SEMANAL" | "QUINCENAL" | "MENSUAL";

export class PrecioInvalido extends ErrorDeDominio {
  constructor() {
    super("El precio debe ser mayor que cero.");
  }
}

export class FechasInvalidas extends ErrorDeDominio {
  constructor() {
    super("La fecha de fin debe ser posterior a la fecha de inicio.");
  }
}

export type DatosDeAlta = {
  ubicacionId: string;
  servicioId: string;
  periodicidad: Periodicidad;
  precioPorEvento: number;
  fechaInicio: Date;
  fechaFin: Date;
};

export class Asignacion {
  private constructor(
    readonly id: string,
    readonly ubicacionId: string,
    readonly servicioId: string,
    readonly periodicidad: Periodicidad,
    readonly precioPorEvento: number,
    readonly fechaInicio: Date,
    readonly fechaFin: Date,
    readonly activo: boolean,
  ) {}

  static crear(datos: DatosDeAlta): Asignacion {
    if (datos.precioPorEvento <= 0) throw new PrecioInvalido();
    if (datos.fechaFin <= datos.fechaInicio) throw new FechasInvalidas();

    return new Asignacion(
      randomUUID(),
      datos.ubicacionId,
      datos.servicioId,
      datos.periodicidad,
      datos.precioPorEvento,
      datos.fechaInicio,
      datos.fechaFin,
      true,
    );
  }
}
