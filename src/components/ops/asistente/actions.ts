"use server";

import { ejecutarConversacion, type MensajeDeChat } from "@/lib/groq";
import { herramientasDelAsistente } from "@/lib/asistenteHerramientas";
import { requerirRol } from "@/lib/acceso";
import { diccionario } from "@/lib/i18n";
import { idiomaActual } from "@/lib/idioma";
import {
  type EstadoDelAsistente,
  TOPE_DE_CARACTERES,
  TOPE_DE_TURNOS,
} from "@/components/ops/asistente/estado";
import { promptInterno } from "@/components/ops/asistente/prompt";

/**
 * Adaptador de entrada: el asistente interno.
 *
 * `requerirRol("OFICINA")` deja pasar también a ADMINISTRADOR (ver su
 * semántica en acceso.ts) y nunca a TECNICO — esta action es un endpoint
 * público, se revalida el rol aquí aunque el layout que la monta ya lo haga.
 */
export async function preguntarAlAsistente(
  estadoPrevio: EstadoDelAsistente,
  formData: FormData,
): Promise<EstadoDelAsistente> {
  await requerirRol("OFICINA");
  const [t, idioma] = await Promise.all([diccionario(), idiomaActual()]);

  const texto = String(formData.get("mensaje") ?? "").trim();
  if (!texto) return estadoPrevio;

  if (texto.length > TOPE_DE_CARACTERES) {
    return { ...estadoPrevio, error: t.asistente.limiteCaracteres(TOPE_DE_CARACTERES) };
  }

  const turnosPrevios = estadoPrevio.mensajes.filter((m) => m.rol === "user").length;
  if (turnosPrevios >= TOPE_DE_TURNOS) {
    return { ...estadoPrevio, error: t.asistente.conversacionMuyLarga };
  }

  const historial: MensajeDeChat[] = [
    { role: "system", content: promptInterno(idioma) },
    ...estadoPrevio.mensajes.map(
      (m): MensajeDeChat => ({ role: m.rol, content: m.texto }),
    ),
    { role: "user", content: texto },
  ];

  try {
    const { respuesta } = await ejecutarConversacion({
      mensajes: historial,
      herramientas: herramientasDelAsistente,
      maxIteraciones: 4,
      maxTokens: 500,
    });

    return {
      mensajes: [
        ...estadoPrevio.mensajes,
        { rol: "user", texto },
        { rol: "assistant", texto: respuesta || t.asistente.sinRespuesta },
      ],
      error: null,
    };
  } catch (error) {
    console.error("[asistente] fallo al llamar a Groq:", error);
    return { ...estadoPrevio, error: t.asistente.noDisponible };
  }
}
