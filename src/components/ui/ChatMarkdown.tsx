"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Estilos mínimos para que el Markdown que devuelve el LLM (listas, negritas,
 * tablas de reportes) se vea bien dentro de una burbuja de chat angosta —
 * sin depender del plugin de tipografía de Tailwind, que no está instalado.
 */
const COMPONENTES: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-4 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-4 last:mb-0">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="rounded bg-black/8 px-1 py-0.5 text-[0.85em]">{children}</code>
  ),
  table: ({ children }) => (
    <div className="mb-2 overflow-x-auto last:mb-0">
      <table className="w-full border-collapse text-left text-xs">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-current/20 py-1 pr-3 font-semibold">{children}</th>
  ),
  td: ({ children }) => <td className="border-b border-current/10 py-1 pr-3 align-top">{children}</td>,
};

/** Renderiza la respuesta del asistente como Markdown (listas, negritas, tablas). */
export function ChatMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={COMPONENTES}>
      {children}
    </ReactMarkdown>
  );
}
