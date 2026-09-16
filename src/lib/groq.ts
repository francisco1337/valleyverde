import "server-only";

import OpenAI from "openai";
import type {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources/chat/completions";

/**
 * Groq expone una API compatible con la de OpenAI, así que no hace falta un
 * SDK propio: basta con apuntar el cliente de `openai` a su `baseURL`.
 */
function crearCliente(): OpenAI {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "Falta GROQ_API_KEY. Consigue una clave gratis en https://console.groq.com/keys y ponla en tu .env.",
    );
  }
  return new OpenAI({ apiKey, baseURL: "https://api.groq.com/openai/v1" });
}

/** Igual que clientePrisma(): se construye la primera vez que alguien la usa, no al importar el módulo. */
const global_ = globalThis as typeof globalThis & { groqVV?: OpenAI };

export function groqCliente(): OpenAI {
  if (!global_.groqVV) global_.groqVV = crearCliente();
  return global_.groqVV;
}

export const GROQ_MODEL = process.env.GROQ_MODEL?.trim() || "openai/gpt-oss-120b";

export type MensajeDeChat = ChatCompletionMessageParam;

export type Herramienta = {
  definicion: ChatCompletionTool;
  ejecutar: (args: unknown) => Promise<unknown>;
};

const RESPUESTA_DE_AGOTAMIENTO =
  "No pude terminar de procesar tu pregunta. Intenta de nuevo o sé más específico.";

/**
 * Loop de tool-calling genérico, compartido por el widget público (sin
 * herramientas) y el asistente interno (con herramientas sobre datos reales).
 *
 * Llama al modelo; si responde con `tool_calls`, ejecuta cada una localmente
 * y se lo devuelve como mensajes `role: "tool"`, y repite hasta que llegue una
 * respuesta de texto plano o se agote `maxIteraciones`. Nunca lanza: un fallo
 * de herramienta se convierte en `{ error }` para que el propio modelo lo vea
 * y responda en consecuencia.
 */
export async function ejecutarConversacion(opciones: {
  mensajes: MensajeDeChat[];
  herramientas?: Record<string, Herramienta>;
  maxIteraciones?: number;
  maxTokens?: number;
}): Promise<{ respuesta: string; mensajes: MensajeDeChat[] }> {
  const { herramientas, maxIteraciones = 4, maxTokens = 500 } = opciones;
  const mensajes: MensajeDeChat[] = [...opciones.mensajes];
  const tools = herramientas
    ? Object.values(herramientas).map((h) => h.definicion)
    : undefined;

  for (let intento = 0; intento < maxIteraciones; intento++) {
    const respuesta = await groqCliente().chat.completions.create(
      {
        model: GROQ_MODEL,
        messages: mensajes,
        tools,
        max_tokens: maxTokens,
        // gpt-oss es un modelo "razonador": sin esto gasta el presupuesto de
        // tokens pensando y nunca llega a emitir `content` (finish_reason
        // "length" con content vacío). "low" alcanza para esta tarea.
        reasoning_effort: "low",
      },
      { signal: AbortSignal.timeout(15_000) },
    );

    const mensaje = respuesta.choices[0]?.message;
    if (!mensaje) break;

    const llamadas = mensaje.tool_calls?.filter((l) => l.type === "function") ?? [];
    if (llamadas.length === 0) {
      return { respuesta: mensaje.content ?? "", mensajes: [...mensajes, mensaje] };
    }

    mensajes.push(mensaje);

    for (const llamada of llamadas) {
      const herramienta = herramientas?.[llamada.function.name];
      let resultado: unknown;

      if (!herramienta) {
        resultado = { error: `Herramienta desconocida: ${llamada.function.name}` };
      } else {
        try {
          const args = llamada.function.arguments ? JSON.parse(llamada.function.arguments) : {};
          resultado = await herramienta.ejecutar(args);
        } catch (error) {
          resultado = { error: error instanceof Error ? error.message : String(error) };
        }
      }

      mensajes.push({
        role: "tool",
        tool_call_id: llamada.id,
        content: JSON.stringify(resultado),
      });
    }
  }

  console.warn("[groq] se agotaron las iteraciones sin una respuesta final");
  return { respuesta: RESPUESTA_DE_AGOTAMIENTO, mensajes };
}
