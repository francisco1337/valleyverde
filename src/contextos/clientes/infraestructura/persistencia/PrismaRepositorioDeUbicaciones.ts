import { clientePrisma } from "@/contextos/compartido/infraestructura/persistencia/ClientePrisma";
import type { Ubicacion } from "../../dominio/Ubicacion";
import type { RepositorioDeUbicaciones } from "../../dominio/puertos/RepositorioDeUbicaciones";

export class PrismaRepositorioDeUbicaciones implements RepositorioDeUbicaciones {
  async guardar(ubicacion: Ubicacion): Promise<void> {
    await clientePrisma().ubicacion.upsert({
      where: { id: ubicacion.id },
      create: {
        id: ubicacion.id,
        clienteId: ubicacion.clienteId,
        nombre: ubicacion.nombre,
        direccion: ubicacion.direccion,
        latitud: ubicacion.latitud ?? undefined,
        longitud: ubicacion.longitud ?? undefined,
        notasDeAcceso: ubicacion.notasDeAcceso ?? undefined,
        activo: ubicacion.activo,
      },
      update: {
        nombre: ubicacion.nombre,
        direccion: ubicacion.direccion,
        latitud: ubicacion.latitud ?? null,
        longitud: ubicacion.longitud ?? null,
        notasDeAcceso: ubicacion.notasDeAcceso ?? null,
        activo: ubicacion.activo,
      },
    });
  }
}
