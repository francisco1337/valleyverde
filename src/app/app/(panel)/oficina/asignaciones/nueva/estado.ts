export type ValoresDeAsignacion = {
  ubicacionId: string;
  servicioId: string;
  periodicidad: string;
  precioPorEvento: string;
  fechaInicio: string;
  fechaFin: string;
};

export type EstadoDeCreacionDeAsignacion = {
  error: string | null;
  valores: ValoresDeAsignacion;
};

export const ESTADO_CREACION_INICIAL: EstadoDeCreacionDeAsignacion = {
  error: null,
  valores: {
    ubicacionId: "",
    servicioId: "",
    periodicidad: "SEMANAL",
    precioPorEvento: "",
    fechaInicio: "",
    fechaFin: "",
  },
};
