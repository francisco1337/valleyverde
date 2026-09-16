import "server-only";
import { clientePrisma } from "@/contextos/compartido/infraestructura/persistencia/ClientePrisma";

export type EventoEnLista = {
  id: string;
  fechaProgramada: Date;
  hora: string;
  estado: string;
  servicio: { nombre: string };
  ubicacion: { nombre: string; direccion: string };
  cliente: { nombre: string };
  tecnico: { nombre: string } | null;
  precio: string;
};

export async function eventosProgramados(): Promise<EventoEnLista[]> {
  const filas = await clientePrisma().evento.findMany({
    where: { estado: "PROGRAMADO" },
    orderBy: [{ fechaProgramada: "asc" }, { hora: "asc" }],
    select: {
      id: true,
      fechaProgramada: true,
      hora: true,
      estado: true,
      precio: true,
      servicio: { select: { nombre: true } },
      ubicacion: {
        select: {
          nombre: true,
          direccion: true,
          cliente: { select: { nombre: true } },
        },
      },
      tecnico: { select: { nombre: true } },
    },
  });

  return filas.map((f) => ({
    id: f.id,
    fechaProgramada: f.fechaProgramada,
    hora: f.hora,
    estado: f.estado,
    precio: f.precio.toString(),
    servicio: f.servicio,
    ubicacion: { nombre: f.ubicacion.nombre, direccion: f.ubicacion.direccion },
    cliente: f.ubicacion.cliente,
    tecnico: f.tecnico,
  }));
}

export type AsignacionParaProgramar = {
  id: string;
  servicio: { nombre: string };
  ubicacion: { nombre: string; cliente: { nombre: string } };
  precioPorEvento: string;
  periodicidad: string;
};

export async function asignacionesParaProgramar(): Promise<AsignacionParaProgramar[]> {
  const filas = await clientePrisma().asignacion.findMany({
    where: { activo: true },
    orderBy: [{ ubicacion: { cliente: { nombre: "asc" } } }, { ubicacion: { nombre: "asc" } }],
    select: {
      id: true,
      precioPorEvento: true,
      periodicidad: true,
      servicioId: true,
      ubicacionId: true,
      servicio: { select: { nombre: true } },
      ubicacion: {
        select: {
          nombre: true,
          cliente: { select: { nombre: true } },
        },
      },
    },
  });

  return filas.map((f) => ({
    id: f.id,
    servicio: f.servicio,
    ubicacion: f.ubicacion,
    precioPorEvento: f.precioPorEvento.toString(),
    periodicidad: f.periodicidad,
  }));
}

export type TecnicoOpcion = {
  id: string;
  nombre: string;
};

export async function tecnicosActivos(): Promise<TecnicoOpcion[]> {
  const filas = await clientePrisma().usuario.findMany({
    where: { rol: "TECNICO", activo: true },
    orderBy: { nombre: "asc" },
    select: { id: true, nombre: true },
  });
  return filas;
}
