import { randomUUID } from "crypto";
import { ErrorDeDominio } from "@/contextos/compartido/dominio/ErrorDeDominio";

export class DireccionInvalida extends ErrorDeDominio {
  constructor() {
    super("La dirección no puede estar vacía.");
  }
}

export class NombreDeUbicacionInvalido extends ErrorDeDominio {
  constructor() {
    super("El nombre de la ubicación no puede estar vacío.");
  }
}

type DatosDeAlta = {
  clienteId: string;
  nombre: string;
  direccion: string;
  latitud?: number | null;
  longitud?: number | null;
  notasDeAcceso?: string | null;
};

type DatosRaw = DatosDeAlta & { id: string; activo: boolean };

export class Ubicacion {
  private constructor(
    readonly id: string,
    readonly clienteId: string,
    readonly nombre: string,
    readonly direccion: string,
    readonly latitud: number | null,
    readonly longitud: number | null,
    readonly notasDeAcceso: string | null,
    readonly activo: boolean,
  ) {}

  static registrar(datos: DatosDeAlta): Ubicacion {
    const nombre = datos.nombre.trim().replace(/\s+/g, " ");
    if (!nombre) throw new NombreDeUbicacionInvalido();

    const direccion = datos.direccion.trim();
    if (!direccion) throw new DireccionInvalida();

    return new Ubicacion(
      randomUUID(),
      datos.clienteId,
      nombre,
      direccion,
      datos.latitud ?? null,
      datos.longitud ?? null,
      textoOpcional(datos.notasDeAcceso),
      true,
    );
  }

  static rehidratar(datos: DatosRaw): Ubicacion {
    return new Ubicacion(
      datos.id,
      datos.clienteId,
      datos.nombre,
      datos.direccion,
      datos.latitud ?? null,
      datos.longitud ?? null,
      datos.notasDeAcceso ?? null,
      datos.activo,
    );
  }
}

function textoOpcional(valor?: string | null): string | null {
  if (!valor) return null;
  const t = valor.trim();
  return t || null;
}
