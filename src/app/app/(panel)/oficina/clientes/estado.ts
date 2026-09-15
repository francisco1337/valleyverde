/**
 * El estado que `useActionState` pasea entre el formulario y la acción.
 *
 * Vive aparte de actions.ts porque un archivo "use server" sólo puede exportar
 * funciones async: cualquier constante ahí dentro rompe el build.
 *
 * `valores` devuelve lo que la persona ya había escrito. Sin eso, un error de
 * validación le vacía el formulario y la obliga a recapturar todo.
 */
export type ValoresDeCliente = {
  nombre: string;
  contacto: string;
  telefono: string;
  correo: string;
  notas: string;
};

export type EstadoDeAltaDeCliente = {
  error: string | null;
  valores: ValoresDeCliente;
};

export const VALORES_VACIOS: ValoresDeCliente = {
  nombre: "",
  contacto: "",
  telefono: "",
  correo: "",
  notas: "",
};

export const ESTADO_ALTA_INICIAL: EstadoDeAltaDeCliente = {
  error: null,
  valores: VALORES_VACIOS,
};
