import "server-only";

import type { Herramienta } from "@/lib/groq";
import { clientesDeLaCartera } from "@/contextos/clientes/infraestructura/consultas/ClientesDeLaCartera";
import { ubicacionesDelCliente } from "@/contextos/clientes/infraestructura/consultas/UbicacionesDelCliente";
import { cobranzaResumen } from "@/contextos/eventos/infraestructura/consultas/CobranzaResumen";
import { reporteDeNegocio } from "@/contextos/eventos/infraestructura/consultas/ReporteDeNegocio";
import { catalogoDeServicios } from "@/contextos/asignaciones/infraestructura/consultas/CatalogoDeServicios";
import { asignacionesActivas } from "@/contextos/asignaciones/infraestructura/consultas/AsignacionesActivas";

/**
 * Registro de herramientas del asistente interno: cada una envuelve una
 * consulta que ya existe (lectura directa Prisma, CQRS-lite) sin agregarle
 * reglas de negocio propias. Es seguro exponerlas tal cual porque este
 * asistente solo es alcanzable por OFICINA/ADMINISTRADOR (ver
 * requerirRol("OFICINA") en actions.ts) — TECNICO nunca llega ni a la UI ni a
 * la action, así que no hace falta replicar aquí el filtrado de precios que
 * las páginas de TECNICO hacen con sus propias queries.
 *
 * Las listas se truncan para acotar el costo en tokens de cada respuesta.
 */

const TOPE_DE_FILAS = 50;

function truncar<T>(filas: T[]): { total: number; filas: T[] } {
  return { total: filas.length, filas: filas.slice(0, TOPE_DE_FILAS) };
}

function fechaValida(valor: unknown, campo: string): Date {
  if (typeof valor !== "string") {
    throw new Error(`Falta la fecha "${campo}" (formato AAAA-MM-DD).`);
  }
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) {
    throw new Error(`La fecha "${campo}" no es válida: "${valor}". Usa el formato AAAA-MM-DD.`);
  }
  return fecha;
}

export const herramientasDelAsistente: Record<string, Herramienta> = {
  consultar_clientes: {
    definicion: {
      type: "function",
      function: {
        name: "consultar_clientes",
        description:
          "Lista los clientes activos de la cartera (nombre, contacto, teléfono, correo). Sin montos.",
        parameters: { type: "object", properties: {} },
      },
    },
    ejecutar: async () => truncar(await clientesDeLaCartera()),
  },

  consultar_ubicaciones_de_cliente: {
    definicion: {
      type: "function",
      function: {
        name: "consultar_ubicaciones_de_cliente",
        description: "Lista las ubicaciones activas de un cliente dado su clienteId.",
        parameters: {
          type: "object",
          properties: {
            clienteId: { type: "string", description: "El id del cliente." },
          },
          required: ["clienteId"],
        },
      },
    },
    ejecutar: async (args) => {
      const { clienteId } = args as { clienteId?: string };
      if (!clienteId) throw new Error("Falta clienteId.");
      return truncar(await ubicacionesDelCliente(clienteId));
    },
  },

  consultar_cobranza: {
    definicion: {
      type: "function",
      function: {
        name: "consultar_cobranza",
        description:
          "Resumen de cobranza: eventos completados pendientes de pago y ya cobrados, con totales en pesos (totalPendiente, totalCobrado). Los montos ya vienen sumados, no los recalcules.",
        parameters: { type: "object", properties: {} },
      },
    },
    ejecutar: async () => {
      const resumen = await cobranzaResumen();
      return {
        totalPendiente: resumen.totalPendiente,
        totalCobrado: resumen.totalCobrado,
        pendientes: truncar(resumen.pendientes),
        cobrado: truncar(resumen.cobrado),
      };
    },
  },

  consultar_reporte_de_negocio: {
    definicion: {
      type: "function",
      function: {
        name: "consultar_reporte_de_negocio",
        description:
          "Reporte de ingresos entre dos fechas (inclusive): totales cobrado/por cobrar, trabajos completados, serie diaria y desglose por servicio.",
        parameters: {
          type: "object",
          properties: {
            fechaInicio: { type: "string", description: "Fecha inicial, formato AAAA-MM-DD." },
            fechaFin: { type: "string", description: "Fecha final, formato AAAA-MM-DD." },
          },
          required: ["fechaInicio", "fechaFin"],
        },
      },
    },
    ejecutar: async (args) => {
      const { fechaInicio, fechaFin } = args as { fechaInicio?: unknown; fechaFin?: unknown };
      const inicio = fechaValida(fechaInicio, "fechaInicio");
      const fin = fechaValida(fechaFin, "fechaFin");
      return reporteDeNegocio(inicio, fin);
    },
  },

  consultar_catalogo_de_servicios: {
    definicion: {
      type: "function",
      function: {
        name: "consultar_catalogo_de_servicios",
        description: "Lista el catálogo de servicios con su precio sugerido.",
        parameters: { type: "object", properties: {} },
      },
    },
    ejecutar: async () => truncar(await catalogoDeServicios()),
  },

  consultar_asignaciones_activas: {
    definicion: {
      type: "function",
      function: {
        name: "consultar_asignaciones_activas",
        description:
          "Lista las asignaciones (contratos recurrentes) activas: cliente, ubicación, servicio, periodicidad y precio por evento.",
        parameters: { type: "object", properties: {} },
      },
    },
    ejecutar: async () => truncar(await asignacionesActivas()),
  },
};
