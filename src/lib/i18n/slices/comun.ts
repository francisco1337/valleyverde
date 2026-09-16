const es = {
  panel: "Panel",
  salir: "Salir",
  guardar: "Guardar",
  guardando: "Guardando…",
  cancelar: "Cancelar",
  opcional: "opcional",
  disponible: "Disponible",
  pendienteBadge: "Pendiente",
  completadoBadge: "Completado",
  notas: "Notas: ",
  cerradoEl: (fecha: string) => `Cerrado el ${fecha}`,
  sinFotosDeEvidencia: "Sin fotos de evidencia",
  evidencia: (n: number) => `Evidencia ${n}`,
  panelDe: (etiqueta: string) => `Panel de ${etiqueta}`,
  hola: (nombre: string) => `Hola, ${nombre}`,
};

type SliceComun = typeof es;

const en: SliceComun = {
  panel: "Panel",
  salir: "Log out",
  guardar: "Save",
  guardando: "Saving…",
  cancelar: "Cancel",
  opcional: "optional",
  disponible: "Available",
  pendienteBadge: "Pending",
  completadoBadge: "Completed",
  notas: "Notes: ",
  cerradoEl: (fecha) => `Closed on ${fecha}`,
  sinFotosDeEvidencia: "No evidence photos",
  evidencia: (n) => `Evidence ${n}`,
  panelDe: (etiqueta) => `${etiqueta} Panel`,
  hola: (nombre) => `Hi, ${nombre}`,
};

export const comun = { es, en };
