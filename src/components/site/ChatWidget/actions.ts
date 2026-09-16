"use server";

import { ejecutarConversacion, type MensajeDeChat } from "@/lib/groq";
import { chatWidget } from "@/lib/site";
import {
  type EstadoDelChatPublico,
  TOPE_DE_CARACTERES,
  TOPE_DE_TURNOS,
} from "@/components/site/ChatWidget/estado";
import { PROMPT_PUBLICO } from "@/components/site/ChatWidget/prompt";

/**
 * Adaptador de entrada: el widget de chat público.
 *
 * Sin requerirSesion/requerirRol — es público por diseño. Sin herramientas y
 * con maxIteraciones: 1, así que nunca hay más de una llamada a Groq por
 * mensaje y el modelo jamás tiene datos del negocio en su contexto.
 */
export async function enviarMensajeDeChat(
  estadoPrevio: EstadoDelChatPublico,
  formData: FormData,
): Promise<EstadoDelChatPublico> {
  const texto = String(formData.get("mensaje") ?? "").trim();

  if (!texto) return estadoPrevio;

  if (texto.length > TOPE_DE_CARACTERES) {
    return { ...estadoPrevio, error: `Keep your message under ${TOPE_DE_CARACTERES} characters.` };
  }

  const turnosPrevios = estadoPrevio.mensajes.filter((m) => m.rol === "user").length;
  if (turnosPrevios >= TOPE_DE_TURNOS) {
    return {
      mensajes: [
        ...estadoPrevio.mensajes,
        { rol: "user", texto },
        { rol: "assistant", texto: chatWidget.turnLimitMessage },
      ],
      error: null,
    };
  }

  const historial: MensajeDeChat[] = [
    { role: "system", content: PROMPT_PUBLICO },
    ...estadoPrevio.mensajes.map(
      (m): MensajeDeChat => ({ role: m.rol, content: m.texto }),
    ),
    { role: "user", content: texto },
  ];

  try {
    const { respuesta } = await ejecutarConversacion({
      mensajes: historial,
      maxIteraciones: 1,
      maxTokens: 300,
    });

    return {
      mensajes: [
        ...estadoPrevio.mensajes,
        { rol: "user", texto },
        { rol: "assistant", texto: respuesta || "Sorry, I didn't catch that — could you rephrase?" },
      ],
      error: null,
    };
  } catch (error) {
    console.error("[chat-publico] fallo al llamar a Groq:", error);
    return {
      ...estadoPrevio,
      error: "The chat is temporarily unavailable. Please try again in a moment.",
    };
  }
}
