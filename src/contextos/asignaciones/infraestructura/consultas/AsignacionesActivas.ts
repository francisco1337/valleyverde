import "server-only";
import { clientePrisma } from "@/contextos/compartido/infraestructura/persistencia/ClientePrisma";

export type AsignacionEnLista = {
  id: string;
  ubicacion: { id: string; nombre: string; direccion: string };
  cliente: { id: string; nombre: string };
  servicio: { id: string; nombre: string };
  periodicidad: string;
  precioPorEvento: string;
  fechaInicio: Date;
  fechaFin: Date;
};

export async function asignacionesActivas(): Promise<AsignacionEnLista[]> {
  const filas = await clientePrisma().asignacion.findMany({
    where: { activo: true },
    orderBy: [{ ubicacion: { cliente: { nombre: "asc" } } }, { ubicacion: { nombre: "asc" } }],
    select: {
      id: true,
      periodicidad: true,
      precioPorEvento: true,
      fechaInicio: true,
      fechaFin: true,
      ubicacion: {
        select: {
          id: true,
          nombre: true,
          direccion: true,
          cliente: { select: { id: true, nombre: true } },
        },
      },
      servicio: { select: { id: true, nombre: true } },
    },
  });

  return filas.map((f) => ({
    id: f.id,
    ubicacion: f.ubicacion,
    cliente: f.ubicacion.cliente,
    servicio: f.servicio,
    periodicidad: f.periodicidad,
    precioPorEvento: f.precioPorEvento.toString(),
  fechaInicio: f.fechaInicio,
    fechaFin: f.fechaFin,
  }));
}
