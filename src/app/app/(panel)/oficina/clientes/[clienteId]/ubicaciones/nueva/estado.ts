export type ValoresDeUbicacion = {
  nombre: string;
  direccion: string;
  notasDeAcceso: string;
};

export type EstadoDeAltaDeUbicacion = {
  error: string | null;
  valores: ValoresDeUbicacion;
};

export const ESTADO_ALTA_INICIAL: EstadoDeAltaDeUbicacion = {
  error: null,
  valores: { nombre: "", direccion: "", notasDeAcceso: "" },
};
