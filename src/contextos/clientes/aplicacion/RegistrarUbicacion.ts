import { Ubicacion } from "../dominio/Ubicacion";
import type { RepositorioDeUbicaciones } from "../dominio/puertos/RepositorioDeUbicaciones";

export type DatosDeAltaDeUbicacion = {
  clienteId: string;
  nombre: string;
  direccion: string;
  latitud?: number | null;
  longitud?: number | null;
  notasDeAcceso?: string | null;
};

export class RegistrarUbicacion {
  constructor(private readonly repositorio: RepositorioDeUbicaciones) {}

  async ejecutar(datos: DatosDeAltaDeUbicacion): Promise<{ id: string }> {
    const ubicacion = Ubicacion.registrar(datos);
    await this.repositorio.guardar(ubicacion);
    return { id: ubicacion.id };
  }
}
