"use client";

import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Bot, LoaderCircle, Send, TriangleAlert, X } from "lucide-react";

import { ChatMarkdown } from "@/components/ui/ChatMarkdown";
import { preguntarAlAsistente } from "@/components/ops/asistente/actions";
import { ESTADO_ASISTENTE_INICIAL } from "@/components/ops/asistente/estado";
import type { DiccionarioCliente } from "@/lib/i18n/paraCliente";

function BotonEnviar({ t }: { t: DiccionarioCliente }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={t.asistente.enviar}
      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-forest-700 text-sand-50 transition hover:bg-forest-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <LoaderCircle className="size-4 animate-spin" aria-hidden />
      ) : (
        <Send className="size-4" aria-hidden />
      )}
    </button>
  );
}

/**
 * Botón flotante + panel del asistente interno, montado solo en los layouts
 * de OFICINA y ADMINISTRADOR (nunca en el de TECNICO — ver los layout.tsx de
 * cada sección).
 */
export function AsistenteChat({ t }: { t: DiccionarioCliente }) {
  const listaRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [abierto, setAbierto] = useState(false);
  const [estado, accion] = useActionState(preguntarAlAsistente, ESTADO_ASISTENTE_INICIAL);

  useEffect(() => {
    formRef.current?.reset();
    listaRef.current?.scrollTo({ top: listaRef.current.scrollHeight, behavior: "smooth" });
  }, [estado]);

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {abierto ? (
        <div className="mb-3 flex h-[30rem] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-xl shadow-forest-950/15">
          <div className="flex items-center justify-between bg-forest-700 px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-semibold text-sand-50">
              <Bot className="size-4" aria-hidden />
              {t.asistente.titulo}
            </span>
            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label={t.asistente.cerrarAsistente}
              className="rounded-full p-1 text-sand-50 transition hover:bg-forest-600"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>

          <div ref={listaRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            <p className="max-w-[85%] rounded-2xl rounded-bl-sm bg-sand-100 px-3.5 py-2.5 text-sm text-forest-950">
              {t.asistente.bienvenida}
            </p>

            {estado.mensajes.map((mensaje, indice) =>
              mensaje.rol === "user" ? (
                <p
                  key={indice}
                  className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-forest-700 px-3.5 py-2.5 text-sm whitespace-pre-wrap text-sand-50"
                >
                  {mensaje.texto}
                </p>
              ) : (
                <div
                  key={indice}
                  className="max-w-[85%] rounded-2xl rounded-bl-sm bg-sand-100 px-3.5 py-2.5 text-sm text-forest-950"
                >
                  <ChatMarkdown>{mensaje.texto}</ChatMarkdown>
                </div>
              ),
            )}

            {estado.error ? (
              <p className="flex items-start gap-2 rounded-xl border border-ember-300 bg-ember-50 px-3 py-2 text-xs text-ember-700">
                <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                <span>{estado.error}</span>
              </p>
            ) : null}
          </div>

          <form
            ref={formRef}
            action={accion}
            className="flex items-center gap-2 border-t border-sand-200 p-3"
          >
            <input
              name="mensaje"
              type="text"
              required
              maxLength={1000}
              autoComplete="off"
              placeholder={t.asistente.placeholder}
              className="flex-1 rounded-xl border border-sand-300 bg-white px-3 py-2 text-sm text-forest-950 outline-none placeholder:text-forest-950/35 focus:border-forest-400 focus:ring-4 focus:ring-forest-500/10"
            />
            <BotonEnviar t={t} />
          </form>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-label={abierto ? t.asistente.cerrarAsistente : t.asistente.abrirAsistente}
        aria-expanded={abierto}
        className="ml-auto flex items-center justify-center rounded-full bg-forest-700 p-4 text-sand-50 shadow-xl shadow-forest-950/25 transition hover:bg-forest-600"
      >
        {abierto ? <X className="size-6" aria-hidden /> : <Bot className="size-6" aria-hidden />}
      </button>
    </div>
  );
}
