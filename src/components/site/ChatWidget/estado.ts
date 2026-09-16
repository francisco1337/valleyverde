/**
 * Igual que EstadoDeAltaDeCliente: vive aparte de actions.ts porque un archivo
 * "use server" sólo puede exportar funciones async.
 */
export type MensajeDelChat = { rol: "user" | "assistant"; texto: string };

export type EstadoDelChatPublico = {
  mensajes: MensajeDelChat[];
  error: string | null;
};

export const ESTADO_CHAT_PUBLICO_INICIAL: EstadoDelChatPublico = {
  mensajes: [],
  error: null,
};

/** Tope de turnos de usuario antes de empujar hacia el formulario de contacto. */
export const TOPE_DE_TURNOS = 8;

/** Tope de caracteres por mensaje, para no pagar por pegar un ensayo completo. */
export const TOPE_DE_CARACTERES = 500;
