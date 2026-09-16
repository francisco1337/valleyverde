export type ValoresDeEvento = {
  asignacionId: string;
  tecnicoId: string;
  fechaProgramada: string;
  hora: string;
  notas: string;
};

export type EstadoDeProgramacion = {
  error: string | null;
  valores: ValoresDeEvento;
};

export const ESTADO_PROGRAMACION_INICIAL: EstadoDeProgramacion = {
  error: null,
  valores: {
    asignacionId: "",
    tecnicoId: "",
    fechaProgramada: "",
    hora: "08:00",
    notas: "",
  },
};
