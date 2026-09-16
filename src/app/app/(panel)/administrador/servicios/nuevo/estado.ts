export type ValoresDeServicio = {
  nombre: string;
  descripcion: string;
  precioSugerido: string;
};

export type EstadoDeAltaDeServicio = {
  error: string | null;
  valores: ValoresDeServicio;
};

export const VALORES_VACIOS: ValoresDeServicio = {
  nombre: "",
  descripcion: "",
  precioSugerido: "",
};

export const ESTADO_ALTA_INICIAL: EstadoDeAltaDeServicio = {
  error: null,
  valores: VALORES_VACIOS,
};
