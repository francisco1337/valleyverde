"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle, Save, TriangleAlert } from "lucide-react";

import { registrarCliente } from "@/app/app/(panel)/oficina/clientes/actions";
import {
  ESTADO_ALTA_INICIAL,
  type ValoresDeCliente,
} from "@/app/app/(panel)/oficina/clientes/estado";

const CLASES_CAMPO =
  "w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-sm text-forest-950 outline-none transition placeholder:text-forest-950/35 focus:border-forest-400 focus:ring-4 focus:ring-forest-500/10 disabled:opacity-60";

function Etiqueta({
  htmlFor,
  children,
  opcional,
}: {
  htmlFor: string;
  children: React.ReactNode;
  opcional?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="flex items-baseline gap-2 text-xs font-semibold tracking-wide text-forest-900/70 uppercase"
    >
      {children}
      {opcional ? (
        <span className="text-[10px] font-medium tracking-normal text-forest-950/35 normal-case">
          opcional
        </span>
      ) : null}
    </label>
  );
}

/**
 * El botón vive en su propio componente porque `useFormStatus` sólo reporta el
 * envío si se lee desde un hijo del <form>, no desde el componente que lo pinta.
 */
function BotonGuardar() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center justify-center gap-2 rounded-xl bg-forest-700 px-5 py-3 text-sm font-semibold text-sand-50 shadow-sm transition hover:bg-forest-600 focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:ring-offset-2 focus-visible:ring-offset-sand-50 focus-visible:outline-none active:bg-forest-800 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? (
        <>
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
          Guardando…
        </>
      ) : (
        <>
          <Save className="h-4 w-4" aria-hidden />
          Guardar cliente
        </>
      )}
    </button>
  );
}

export function FormularioDeCliente() {
  const [estado, accion] = useActionState(registrarCliente, ESTADO_ALTA_INICIAL);

  // Si el alta falló, se repinta lo que la persona ya había escrito.
  const v: ValoresDeCliente = estado.valores;

  return (
    <form action={accion} className="space-y-5" noValidate>
      <div className="space-y-1.5">
        <Etiqueta htmlFor="nombre">Nombre o razón social</Etiqueta>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          autoFocus
          maxLength={160}
          defaultValue={v.nombre}
          placeholder="Administradora Plaza Norte S.A. de C.V."
          className={CLASES_CAMPO}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Etiqueta htmlFor="contacto" opcional>
            Persona de contacto
          </Etiqueta>
          <input
            id="contacto"
            name="contacto"
            type="text"
            maxLength={160}
            defaultValue={v.contacto}
            placeholder="Dana Whitfield"
            className={CLASES_CAMPO}
          />
        </div>

        <div className="space-y-1.5">
          <Etiqueta htmlFor="telefono" opcional>
            Teléfono
          </Etiqueta>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            inputMode="tel"
            maxLength={40}
            defaultValue={v.telefono}
            placeholder="(623) 551-8156"
            className={CLASES_CAMPO}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Etiqueta htmlFor="correo" opcional>
          Correo
        </Etiqueta>
        <input
          id="correo"
          name="correo"
          type="email"
          autoComplete="off"
          maxLength={160}
          defaultValue={v.correo}
          placeholder="contacto@plazanorte.com"
          className={CLASES_CAMPO}
        />
      </div>

      <div className="space-y-1.5">
        <Etiqueta htmlFor="notas" opcional>
          Notas
        </Etiqueta>
        <textarea
          id="notas"
          name="notas"
          rows={3}
          maxLength={2000}
          defaultValue={v.notas}
          placeholder="Cómo facturan, con quién hay que hablar, horarios permitidos…"
          className={`${CLASES_CAMPO} resize-y`}
        />
      </div>

      <div aria-live="polite">
        {estado.error ? (
          <p className="flex items-start gap-2 rounded-xl border border-ember-300 bg-ember-50 px-3.5 py-3 text-sm text-ember-700">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>{estado.error}</span>
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <BotonGuardar />
        <Link
          href="/app/oficina/clientes"
          className="rounded-xl px-4 py-3 text-sm font-medium text-forest-950/55 transition hover:bg-sand-100 hover:text-forest-800"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
