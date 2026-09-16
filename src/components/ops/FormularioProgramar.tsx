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

const CLASES_CAMPO =
  "w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-sm text-forest-950 outline-none transition placeholder:text-forest-950/35 focus:border-forest-400 focus:ring-4 focus:ring-forest-500/10 disabled:opacity-60";

const CLASES_SELECT =
  "w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-sm text-forest-950 outline-none transition focus:border-forest-400 focus:ring-4 focus:ring-forest-500/10 disabled:opacity-60";

const LABEL_PERIODICIDAD: Record<string, string> = {
  DIARIO: "Diario",
  SEMANAL: "Semanal",
  QUINCENAL: "Quincenal",
  MENSUAL: "Mensual",
};

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

function BotonProgramar() {
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
          Programando…
        </>
      ) : (
        <>
          <CalendarPlus className="h-4 w-4" aria-hidden />
          Programar visita
        </>
      )}
    </button>
  );
}

export function FormularioProgramar({
  asignaciones,
  tecnicos,
}: {
  asignaciones: AsignacionParaProgramar[];
  tecnicos: TecnicoOpcion[];
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
          Visita programada correctamente.
        </div>
      )}

      <form action={accion} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Etiqueta htmlFor="asignacionId">Asignación</Etiqueta>
          <select
            id="asignacionId"
            name="asignacionId"
            required
            defaultValue={v.asignacionId}
            className={CLASES_SELECT}
          >
            <option value="">— Elige una asignación —</option>
            {asignaciones.map((a) => (
              <option key={a.id} value={a.id}>
                {a.ubicacion.cliente.nombre} / {a.ubicacion.nombre} · {a.servicio.nombre} ({LABEL_PERIODICIDAD[a.periodicidad]})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Etiqueta htmlFor="tecnicoId">Técnico</Etiqueta>
          <select
            id="tecnicoId"
            name="tecnicoId"
            required
            defaultValue={v.tecnicoId}
            className={CLASES_SELECT}
          >
            <option value="">— Elige un técnico —</option>
            {tecnicos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Etiqueta htmlFor="fechaProgramada">Fecha</Etiqueta>
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
            <Etiqueta htmlFor="hora">Hora</Etiqueta>
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
          <Etiqueta htmlFor="notas">Notas</Etiqueta>
          <textarea
            id="notas"
            name="notas"
            rows={2}
            maxLength={500}
            defaultValue={v.notas}
            placeholder="Instrucciones especiales para esta visita…"
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

        <BotonProgramar />
      </form>
    </div>
  );
}
