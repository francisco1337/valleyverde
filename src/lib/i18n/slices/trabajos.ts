const es = {
  metaTitulo: "Catálogo de trabajos",
  operacion: "Operación",
  catalogoDeTrabajos: "Catálogo de trabajos",
  trabajosCompletados: (n: number) => `${n} ${n === 1 ? "trabajo completado" : "trabajos completados"}`,
  aunNoHayTrabajos: "Aún no hay trabajos completados.",
};

type SliceDeTrabajos = typeof es;

const en: SliceDeTrabajos = {
  metaTitulo: "Job catalog",
  operacion: "Operations",
  catalogoDeTrabajos: "Job catalog",
  trabajosCompletados: (n) => `${n} completed ${n === 1 ? "job" : "jobs"}`,
  aunNoHayTrabajos: "No completed jobs yet.",
};

export const trabajos = { es, en };
