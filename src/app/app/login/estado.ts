/**
 * El estado que `useActionState` pasea entre el formulario y la acción.
 *
 * Vive aparte de actions.ts porque un archivo "use server" sólo puede exportar
 * funciones async: cualquier constante ahí dentro rompe el build.
 */
export type EstadoLogin = { error: string | null };

export const ESTADO_LOGIN_INICIAL: EstadoLogin = { error: null };
