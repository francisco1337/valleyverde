const es = {
  enviar: "Enviar",
  cerrarAsistente: "Cerrar asistente",
  abrirAsistente: "Abrir asistente",
  titulo: "Asistente de Valley Verde",
  bienvenida:
    "Pregúntame sobre clientes, cobranza, asignaciones o reportes — consulto los datos reales antes de responder.",
  placeholder: "¿Cuánto tenemos pendiente de cobrar?",
  limiteCaracteres: (tope: number) => `Mantén tu mensaje bajo ${tope} caracteres.`,
  conversacionMuyLarga: "Esta conversación ya es muy larga. Abre el asistente de nuevo para empezar otra.",
  sinRespuesta: "No pude generar una respuesta. Intenta de nuevo.",
  noDisponible: "El asistente no está disponible en este momento. Intenta de nuevo en un rato.",
};

type SliceDeAsistente = typeof es;

const en: SliceDeAsistente = {
  enviar: "Send",
  cerrarAsistente: "Close assistant",
  abrirAsistente: "Open assistant",
  titulo: "Valley Verde Assistant",
  bienvenida:
    "Ask me about clients, billing, assignments or reports — I check the real data before answering.",
  placeholder: "How much is outstanding right now?",
  limiteCaracteres: (tope) => `Keep your message under ${tope} characters.`,
  conversacionMuyLarga: "This conversation is already quite long. Open the assistant again to start a new one.",
  sinRespuesta: "I couldn't generate a response. Please try again.",
  noDisponible: "The assistant isn't available right now. Please try again in a bit.",
};

export const asistente = { es, en };
