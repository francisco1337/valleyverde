const es = {
  metaTitulo: "Reportes",
  finanzas: "Finanzas",
  reportes: "Reportes",
  comoVaElNegocio: (desde: string, hasta: string) => `Cómo va el negocio — ${desde} al ${hasta}.`,
  desde: "Desde",
  hasta: "Hasta",
  filtrar: "Filtrar",
  mesActual: "Mes actual",
  totalFacturado: "Total facturado",
  cobrado: "Cobrado",
  porCobrar: "Por cobrar",
  trabajosCompletados: "Trabajos completados",
  ingresosPorDia: "Ingresos por día",
  noHayTrabajosEnRango: "No hay trabajos completados en este rango.",
  desglosePorServicio: "Desglose por servicio",
  sinDatosEnRango: "Sin datos en este rango.",
  trabajo: (n: number): string => (n === 1 ? "trabajo" : "trabajos"),
};

type SliceDeReportes = typeof es;

const en: SliceDeReportes = {
  metaTitulo: "Reports",
  finanzas: "Finance",
  reportes: "Reports",
  comoVaElNegocio: (desde, hasta) => `How the business is doing — ${desde} through ${hasta}.`,
  desde: "From",
  hasta: "To",
  filtrar: "Filter",
  mesActual: "Current month",
  totalFacturado: "Total billed",
  cobrado: "Collected",
  porCobrar: "Outstanding",
  trabajosCompletados: "Completed jobs",
  ingresosPorDia: "Revenue by day",
  noHayTrabajosEnRango: "No completed jobs in this range.",
  desglosePorServicio: "Breakdown by service",
  sinDatosEnRango: "No data in this range.",
  trabajo: (n) => (n === 1 ? "job" : "jobs"),
};

export const reportes = { es, en };
