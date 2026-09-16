"use client";

import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle, MessageCircle, Send, TriangleAlert, X } from "lucide-react";

import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { chatWidget } from "@/lib/site";
import { ChatMarkdown } from "@/components/ui/ChatMarkdown";
import { enviarMensajeDeChat } from "@/components/site/ChatWidget/actions";
import { ESTADO_CHAT_PUBLICO_INICIAL } from "@/components/site/ChatWidget/estado";

/**
 * El botón vive en su propio componente porque `useFormStatus` sólo reporta
 * el envío si se lee desde un hijo del <form>.
 */
function BotonEnviar() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-label="Send message"
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

/** Widget de chat público, montado globalmente desde SiteShell. */
export function ChatWidget() {
  const scope = useRef<HTMLDivElement>(null);
  const listaRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [abierto, setAbierto] = useState(false);
  const [estado, accion] = useActionState(enviarMensajeDeChat, ESTADO_CHAT_PUBLICO_INICIAL);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.set(root, { scale: 0, opacity: 0, transformOrigin: "bottom right" });

        const reveal = gsap.to(root, {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
          paused: true,
        });

        const trigger = ScrollTrigger.create({
          start: 420,
          onEnter: () => reveal.play(),
          onLeaveBack: () => reveal.reverse(),
        });

        return () => {
          trigger.kill();
          reveal.kill();
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(root, { scale: 1, opacity: 1 });
      });
    },
    { scope },
  );

  useEffect(() => {
    formRef.current?.reset();
    listaRef.current?.scrollTo({ top: listaRef.current.scrollHeight, behavior: "smooth" });
  }, [estado]);

  return (
    <div ref={scope} className="fixed bottom-4 right-4 z-40 sm:bottom-5 sm:right-5">
      {abierto ? (
        <div className="mb-3 flex h-[28rem] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-xl shadow-forest-950/15">
          <div className="flex items-center justify-between bg-forest-700 px-4 py-3">
            <span className="text-sm font-semibold text-sand-50">{chatWidget.label}</span>
            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label="Close chat"
              className="rounded-full p-1 text-sand-50 transition hover:bg-forest-600"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>

          <div ref={listaRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            <p className="max-w-[85%] rounded-2xl rounded-bl-sm bg-sand-100 px-3.5 py-2.5 text-sm text-forest-950">
              {chatWidget.welcome}
            </p>

            {estado.mensajes.map((mensaje, indice) =>
              mensaje.rol === "user" ? (
                <p
                  key={indice}
                  className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-forest-700 px-3.5 py-2.5 text-sm text-sand-50"
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
              maxLength={500}
              autoComplete="off"
              placeholder={chatWidget.placeholder}
              className="flex-1 rounded-xl border border-sand-300 bg-white px-3 py-2 text-sm text-forest-950 outline-none placeholder:text-forest-950/35 focus:border-forest-400 focus:ring-4 focus:ring-forest-500/10"
            />
            <BotonEnviar />
          </form>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-label={abierto ? "Close chat" : chatWidget.label}
        aria-expanded={abierto}
        className="ml-auto flex items-center justify-center rounded-full bg-forest-700 p-4 text-sand-50 shadow-xl shadow-forest-950/25 transition hover:bg-forest-600"
      >
        {abierto ? <X className="size-6" aria-hidden /> : <MessageCircle className="size-6" aria-hidden />}
      </button>
    </div>
  );
}
