"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle, Save, TriangleAlert } from "lucide-react";

import { registrarUbicacion } from "@/app/app/(panel)/oficina/clientes/[clienteId]/ubicaciones/nueva/actions";
import {
  ESTADO_ALTA_INICIAL,
  type ValoresDeUbicacion,
} from "@/app/app/(panel)/oficina/clientes/[clienteId]/ubicaciones/nueva/estado";
import type { DiccionarioCliente } from "@/lib/i18n/paraCliente";

const CLASES_CAMPO =
  "w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-sm text-forest-950 outline-none transition placeholder:text-forest-950/35 focus:border-forest-400 focus:ring-4 focus:ring-forest-500/10 disabled:opacity-60";

function Etiqueta({
  htmlFor,
  children,
  opcional,
  t,
}: {
  htmlFor: string;
  children: React.ReactNode;
  opcional?: boolean;
  t: DiccionarioCliente;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="flex items-baseline gap-2 text-xs font-semibold tracking-wide text-forest-900/70 uppercase"
    >
      {children}
      {opcional ? (
        <span className="text-[10px] font-medium tracking-normal text-forest-950/35 normal-case">
          {t.comun.opcional}
        </span>
      ) : null}
    </label>
  );
}

function BotonGuardar({ t }: { t: DiccionarioCliente }) {
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
          {t.comun.guardando}
        </>
      ) : (
        <>
          <Save className="h-4 w-4" aria-hidden />
          {t.clientes.formUbicacion.guardarUbicacion}
        </>
      )}
    </button>
  );
}

export function FormularioDeUbicacion({ clienteId, t }: { clienteId: string; t: DiccionarioCliente }) {
  const [estado, accion] = useActionState(registrarUbicacion, ESTADO_ALTA_INICIAL);
  const v: ValoresDeUbicacion = estado.valores;

  return (
    <form action={accion} className="space-y-5" noValidate>
      <input type="hidden" name="clienteId" value={clienteId} />

      <div className="space-y-1.5">
        <Etiqueta htmlFor="nombre" t={t}>{t.clientes.formUbicacion.nombreDeLaUbicacion}</Etiqueta>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          autoFocus
          maxLength={191}
          defaultValue={v.nombre}
          placeholder={t.clientes.formUbicacion.nombrePlaceholder}
          className={CLASES_CAMPO}
        />
      </div>

      <div className="space-y-1.5">
        <Etiqueta htmlFor="direccion" t={t}>{t.clientes.formUbicacion.direccion}</Etiqueta>
        <input
          id="direccion"
          name="direccion"
          type="text"
          required
          maxLength={500}
          defaultValue={v.direccion}
          placeholder="19820 N 7th St, Phoenix AZ 85024"
          className={CLASES_CAMPO}
        />
      </div>

      <div className="space-y-1.5">
        <Etiqueta htmlFor="notasDeAcceso" opcional t={t}>
          {t.clientes.formUbicacion.notasDeAcceso}
        </Etiqueta>
        <textarea
          id="notasDeAcceso"
          name="notasDeAcceso"
          rows={3}
          maxLength={2000}
          defaultValue={v.notasDeAcceso}
          placeholder={t.clientes.formUbicacion.notasDeAccesoPlaceholder}
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
        <BotonGuardar t={t} />
        <Link
          href={`/app/oficina/clientes/${clienteId}`}
          className="rounded-xl px-4 py-3 text-sm font-medium text-forest-950/55 transition hover:bg-sand-100 hover:text-forest-800"
        >
          {t.comun.cancelar}
        </Link>
      </div>
    </form>
  );
}
