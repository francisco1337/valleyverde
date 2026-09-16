const es = {
  metaTitulo: "Cobranza",
  finanzas: "Finanzas",
  cobranza: "Cobranza",
  ayuda: "Trabajos terminados — quién pagó y quién debe.",
  totalFacturado: "Total facturado",
  trabajosCompletados: (n: number) => `${n} trabajos completados`,
  porCobrar: "Por cobrar",
  cobrado: "Cobrado",
  trabajo: (n: number): string => (n === 1 ? "trabajo" : "trabajos"),
  todoCobrado: "Todo cobrado",
  noHayTrabajosPendientes: "No hay trabajos pendientes de pago.",
  pagadoEl: (fecha: string) => ` · pagado ${fecha}`,
  marcarPagado: "Marcar pagado",
  guardando: "Guardando…",
};

type SliceDeCobranza = typeof es;

const en: SliceDeCobranza = {
  metaTitulo: "Billing",
  finanzas: "Finance",
  cobranza: "Billing",
  ayuda: "Finished jobs — who paid and who owes.",
  totalFacturado: "Total billed",
  trabajosCompletados: (n) => `${n} completed jobs`,
  porCobrar: "Outstanding",
  cobrado: "Collected",
  trabajo: (n) => (n === 1 ? "job" : "jobs"),
  todoCobrado: "All collected",
  noHayTrabajosPendientes: "No jobs pending payment.",
  pagadoEl: (fecha) => ` · paid ${fecha}`,
  marcarPagado: "Mark as paid",
  guardando: "Saving…",
};

export const cobranza = { es, en };
