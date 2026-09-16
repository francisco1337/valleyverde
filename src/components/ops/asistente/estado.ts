/** Mismo shape que el chat público — vive aparte de actions.ts por la misma razón. */
export type MensajeDelChat = { rol: "user" | "assistant"; texto: string };

export type EstadoDelAsistente = {
  mensajes: MensajeDelChat[];
  error: string | null;
};

export const ESTADO_ASISTENTE_INICIAL: EstadoDelAsistente = {
  mensajes: [],
  error: null,
};

/** Tope de turnos más holgado que el público: uso interno, no expuesto sin auth. */
export const TOPE_DE_TURNOS = 25;

export const TOPE_DE_CARACTERES = 1000;
