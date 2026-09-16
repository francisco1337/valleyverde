import "server-only";
import { clientePrisma } from "@/contextos/compartido/infraestructura/persistencia/ClientePrisma";

export type EventoDeCobranza = {
  id: string;
  fechaProgramada: Date;
  hora: string;
  precio: string;
  pagado: boolean;
  pagadoEn: Date | null;
  servicio: { nombre: string };
  ubicacion: { nombre: string; direccion: string };
  cliente: { id: string; nombre: string };
  tecnico: { nombre: string } | null;
};

export type ResumenCobranza = {
  pendientes: EventoDeCobranza[];
  cobrado: EventoDeCobranza[];
  totalPendiente: number;
  totalCobrado: number;
};

export async function cobranzaResumen(): Promise<ResumenCobranza> {
  const filas = await clientePrisma().evento.findMany({
    where: { estado: "COMPLETADO" },
    orderBy: [{ fechaProgramada: "desc" }, { hora: "desc" }],
    select: {
      id: true,
      fechaProgramada: true,
      hora: true,
      precio: true,
      pagado: true,
      pagadoEn: true,
      servicio: { select: { nombre: true } },
      ubicacion: {
        select: {
          nombre: true,
          direccion: true,
          cliente: { select: { id: true, nombre: true } },
        },
      },
      tecnico: { select: { nombre: true } },
    },
  });

  const todos: EventoDeCobranza[] = filas.map((f) => ({
    id: f.id,
    fechaProgramada: f.fechaProgramada,
    hora: f.hora,
    precio: f.precio.toString(),
    pagado: f.pagado,
    pagadoEn: f.pagadoEn,
    servicio: f.servicio,
    ubicacion: { nombre: f.ubicacion.nombre, direccion: f.ubicacion.direccion },
    cliente: f.ubicacion.cliente,
    tecnico: f.tecnico,
  }));

  const pendientes = todos.filter((e) => !e.pagado);
  const cobrado = todos.filter((e) => e.pagado);

  const totalPendiente = pendientes.reduce((s, e) => s + parseFloat(e.precio), 0);
  const totalCobrado = cobrado.reduce((s, e) => s + parseFloat(e.precio), 0);

  return { pendientes, cobrado, totalPendiente, totalCobrado };
}
