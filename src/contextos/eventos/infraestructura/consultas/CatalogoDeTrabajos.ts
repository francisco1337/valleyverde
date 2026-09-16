import "server-only";
import { clientePrisma } from "@/contextos/compartido/infraestructura/persistencia/ClientePrisma";

export type TrabajoEnCatalogo = {
  id: string;
  fechaProgramada: Date;
  hora: string;
  precio: string;
  notas: string | null;
  completadoEn: Date | null;
  servicio: { nombre: string };
  ubicacion: { nombre: string; direccion: string };
  cliente: { nombre: string };
  tecnico: { nombre: string } | null;
  evidencias: string[];
};

export async function catalogoDeTrabajos(): Promise<TrabajoEnCatalogo[]> {
  const filas = await clientePrisma().evento.findMany({
    where: { estado: "COMPLETADO" },
    orderBy: [{ completadoEn: "desc" }],
    take: 50,
    select: {
      id: true,
      fechaProgramada: true,
      hora: true,
      precio: true,
      notas: true,
      completadoEn: true,
      servicio: { select: { nombre: true } },
      ubicacion: {
        select: {
          nombre: true,
          direccion: true,
          cliente: { select: { nombre: true } },
        },
      },
      tecnico: { select: { nombre: true } },
      evidencias: {
        select: { imagen: true },
        orderBy: { creadoEn: "asc" },
      },
    },
  });

  return filas.map((f) => ({
    id: f.id,
    fechaProgramada: f.fechaProgramada,
    hora: f.hora,
    precio: f.precio.toString(),
    notas: f.notas,
    completadoEn: f.completadoEn,
    servicio: f.servicio,
    ubicacion: { nombre: f.ubicacion.nombre, direccion: f.ubicacion.direccion },
    cliente: f.ubicacion.cliente,
    tecnico: f.tecnico,
    evidencias: f.evidencias.map((e) => e.imagen),
  }));
}
