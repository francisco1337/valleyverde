import "server-only";
import { clientePrisma } from "@/contextos/compartido/infraestructura/persistencia/ClientePrisma";

export type PuntoDeIngresoDiario = {
  fecha: Date;
  cobrado: number;
  porCobrar: number;
};

export type IngresoPorServicio = {
  nombre: string;
  cantidad: number;
  cobrado: number;
  porCobrar: number;
};

export type ReporteDeNegocio = {
  totalCobrado: number;
  totalPorCobrar: number;
  trabajosCompletados: number;
  serieDiaria: PuntoDeIngresoDiario[];
  porServicio: IngresoPorServicio[];
};

function unDia(fecha: Date): Date {
  const siguiente = new Date(fecha);
  siguiente.setDate(siguiente.getDate() + 1);
  return siguiente;
}

export async function reporteDeNegocio(
  fechaInicio: Date,
  fechaFin: Date,
): Promise<ReporteDeNegocio> {
  const fechaFinExclusiva = unDia(fechaFin);

  const filas = await clientePrisma().evento.findMany({
    where: {
      estado: "COMPLETADO",
      fechaProgramada: { gte: fechaInicio, lt: fechaFinExclusiva },
    },
    select: {
      fechaProgramada: true,
      precio: true,
      pagado: true,
      servicio: { select: { nombre: true } },
    },
  });

  const porDia = new Map<string, PuntoDeIngresoDiario>();
  for (let d = new Date(fechaInicio); d < fechaFinExclusiva; d = unDia(d)) {
    porDia.set(d.toISOString().slice(0, 10), { fecha: new Date(d), cobrado: 0, porCobrar: 0 });
  }

  const porServicioMapa = new Map<string, IngresoPorServicio>();

  let totalCobrado = 0;
  let totalPorCobrar = 0;

  for (const fila of filas) {
    const precio = parseFloat(fila.precio.toString());
    const clave = fila.fechaProgramada.toISOString().slice(0, 10);

    const dia = porDia.get(clave);
    if (dia) {
      if (fila.pagado) dia.cobrado += precio;
      else dia.porCobrar += precio;
    }

    if (fila.pagado) totalCobrado += precio;
    else totalPorCobrar += precio;

    const servicio = porServicioMapa.get(fila.servicio.nombre) ?? {
      nombre: fila.servicio.nombre,
      cantidad: 0,
      cobrado: 0,
      porCobrar: 0,
    };
    servicio.cantidad += 1;
    if (fila.pagado) servicio.cobrado += precio;
    else servicio.porCobrar += precio;
    porServicioMapa.set(fila.servicio.nombre, servicio);
  }

  const porServicio = [...porServicioMapa.values()].sort(
    (a, b) => b.cobrado + b.porCobrar - (a.cobrado + a.porCobrar),
  );

  return {
    totalCobrado,
    totalPorCobrar,
    trabajosCompletados: filas.length,
    serieDiaria: [...porDia.values()],
    porServicio,
  };
}
