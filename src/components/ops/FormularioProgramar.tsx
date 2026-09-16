"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CalendarPlus, LoaderCircle, TriangleAlert, CheckCircle2 } from "lucide-react";

import { programarEvento } from "@/app/app/(panel)/oficina/programar/actions";
import {
  ESTADO_PROGRAMACION_INICIAL,
  type ValoresDeEvento,
} from "@/app/app/(panel)/oficina/programar/estado";
import type {
  AsignacionParaProgramar,
  TecnicoOpcion,
} from "@/contextos/eventos/infraestructura/consultas/EventosProgramados";
import type { DiccionarioCliente } from "@/lib/i18n/paraCliente";

const CLASES_CAMPO =
  "w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-sm text-forest-950 outline-none transition placeholder:text-forest-950/35 focus:border-forest-400 focus:ring-4 focus:ring-forest-500/10 disabled:opacity-60";

const CLASES_SELECT =
  "w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-sm text-forest-950 outline-none transition focus:border-forest-400 focus:ring-4 focus:ring-forest-500/10 disabled:opacity-60";

function Etiqueta({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="flex items-baseline gap-2 text-xs font-semibold tracking-wide text-forest-900/70 uppercase"
    >
      {children}
    </label>
  );
}

function BotonProgramar({ t }: { t: DiccionarioCliente }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest-700 px-5 py-3 text-sm font-semibold text-sand-50 shadow-sm transition hover:bg-forest-600 focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:ring-offset-2 focus-visible:ring-offset-sand-50 focus-visible:outline-none active:bg-forest-800 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? (
        <>
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
          {t.programar.form.programando}
        </>
      ) : (
        <>
          <CalendarPlus className="h-4 w-4" aria-hidden />
          {t.programar.form.programarVisita}
        </>
      )}
    </button>
  );
}

export function FormularioProgramar({
  asignaciones,
  tecnicos,
  t,
}: {
  asignaciones: AsignacionParaProgramar[];
  tecnicos: TecnicoOpcion[];
  t: DiccionarioCliente;
}) {
  const [estado, accion] = useActionState(programarEvento, ESTADO_PROGRAMACION_INICIAL);
  const v: ValoresDeEvento = estado.valores;

  // Mostrar éxito cuando el estado volvió limpio (sin error y con valores en blanco)
  const fueExitoso =
    !estado.error &&
    !v.asignacionId &&
    !v.tecnicoId &&
    !v.fechaProgramada;

  return (
    <div className="rounded-2xl border border-sand-200 bg-white p-5">
      {fueExitoso && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-sprout-300 bg-sprout-50 px-3.5 py-3 text-sm text-sprout-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
          {t.programar.form.visitaProgramadaOk}
        </div>
      )}

      <form action={accion} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Etiqueta htmlFor="asignacionId">{t.programar.form.asignacion}</Etiqueta>
          <select
            id="asignacionId"
            name="asignacionId"
            required
            defaultValue={v.asignacionId}
            className={CLASES_SELECT}
          >
            <option value="">{t.programar.form.elegirAsignacion}</option>
            {asignaciones.map((a) => (
              <option key={a.id} value={a.id}>
                {a.ubicacion.cliente.nombre} / {a.ubicacion.nombre} · {a.servicio.nombre} (
                {t.programar.periodicidad[a.periodicidad as keyof typeof t.programar.periodicidad]})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Etiqueta htmlFor="tecnicoId">{t.programar.form.tecnico}</Etiqueta>
          <select
            id="tecnicoId"
            name="tecnicoId"
            required
            defaultValue={v.tecnicoId}
            className={CLASES_SELECT}
          >
            <option value="">{t.programar.form.elegirTecnico}</option>
            {tecnicos.map((tecnico) => (
              <option key={tecnico.id} value={tecnico.id}>
                {tecnico.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Etiqueta htmlFor="fechaProgramada">{t.programar.form.fecha}</Etiqueta>
            <input
              id="fechaProgramada"
              name="fechaProgramada"
              type="date"
              required
              defaultValue={v.fechaProgramada}
              className={CLASES_CAMPO}
            />
          </div>

          <div className="space-y-1.5">
            <Etiqueta htmlFor="hora">{t.programar.form.hora}</Etiqueta>
            <input
              id="hora"
              name="hora"
              type="time"
              required
              defaultValue={v.hora}
              className={CLASES_CAMPO}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Etiqueta htmlFor="notas">{t.programar.form.notas}</Etiqueta>
          <textarea
            id="notas"
            name="notas"
            rows={2}
            maxLength={500}
            defaultValue={v.notas}
            placeholder={t.programar.form.notasPlaceholder}
            className={`${CLASES_CAMPO} resize-none`}
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

        <BotonProgramar t={t} />
      </form>
    </div>
  );
}
