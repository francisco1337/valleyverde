import "server-only";
import { clientePrisma } from "@/contextos/compartido/infraestructura/persistencia/ClientePrisma";

export type UbicacionEnLista = {
  id: string;
  nombre: string;
  direccion: string;
  latitud: string | null;
  longitud: string | null;
  notasDeAcceso: string | null;
};

export async function ubicacionesDelCliente(clienteId: string): Promise<UbicacionEnLista[]> {
  const filas = await clientePrisma().ubicacion.findMany({
    where: { clienteId, activo: true },
    orderBy: { nombre: "asc" },
    select: {
      id: true,
      nombre: true,
      direccion: true,
      latitud: true,
      longitud: true,
      notasDeAcceso: true,
    },
  });

  return filas.map((f) => ({
    ...f,
    latitud: f.latitud?.toString() ?? null,
    longitud: f.longitud?.toString() ?? null,
  }));
}
