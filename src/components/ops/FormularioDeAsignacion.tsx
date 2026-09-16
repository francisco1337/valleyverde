"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle, Save, TriangleAlert } from "lucide-react";

import { crearAsignacion } from "@/app/app/(panel)/oficina/asignaciones/nueva/actions";
import {
  ESTADO_CREACION_INICIAL,
  type ValoresDeAsignacion,
} from "@/app/app/(panel)/oficina/asignaciones/nueva/estado";
import type {
  UbicacionOpcion,
  ServicioOpcion,
} from "@/contextos/asignaciones/infraestructura/consultas/OpcionesDeFormulario";

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
          Crear asignación
        </>
      )}
    </button>
  );
}

export function FormularioDeAsignacion({
  ubicaciones,
  servicios,
}: {
  ubicaciones: UbicacionOpcion[];
  servicios: ServicioOpcion[];
}) {
  const [estado, accion] = useActionState(crearAsignacion, ESTADO_CREACION_INICIAL);
  const v: ValoresDeAsignacion = estado.valores;

  return (
    <form action={accion} className="space-y-5" noValidate>
      <div className="space-y-1.5">
        <Etiqueta htmlFor="ubicacionId">Propiedad</Etiqueta>
        <select
          id="ubicacionId"
          name="ubicacionId"
          required
          defaultValue={v.ubicacionId}
          className={CLASES_SELECT}
        >
          <option value="">— Elige una ubicación —</option>
          {ubicaciones.map((u) => (
            <option key={u.id} value={u.id}>
              {u.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Etiqueta htmlFor="servicioId">Servicio</Etiqueta>
        <select
          id="servicioId"
          name="servicioId"
          required
          defaultValue={v.servicioId}
          className={CLASES_SELECT}
        >
          <option value="">— Elige un servicio —</option>
          {servicios.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombre}
              {s.precioSugerido ? ` (sugerido $${s.precioSugerido})` : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Etiqueta htmlFor="periodicidad">Frecuencia</Etiqueta>
          <select
            id="periodicidad"
            name="periodicidad"
            required
            defaultValue={v.periodicidad}
            className={CLASES_SELECT}
          >
            <option value="DIARIO">Diario</option>
            <option value="SEMANAL">Semanal</option>
            <option value="QUINCENAL">Quincenal</option>
            <option value="MENSUAL">Mensual</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <Etiqueta htmlFor="precioPorEvento">Precio por visita (USD)</Etiqueta>
          <input
            id="precioPorEvento"
            name="precioPorEvento"
            type="number"
            min="0.01"
            step="0.01"
            required
            defaultValue={v.precioPorEvento}
            placeholder="120.00"
            className={CLASES_CAMPO}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Etiqueta htmlFor="fechaInicio">Inicio del contrato</Etiqueta>
          <input
            id="fechaInicio"
            name="fechaInicio"
            type="date"
            required
            defaultValue={v.fechaInicio}
            className={CLASES_CAMPO}
          />
        </div>

        <div className="space-y-1.5">
          <Etiqueta htmlFor="fechaFin">Fin del contrato</Etiqueta>
          <input
            id="fechaFin"
            name="fechaFin"
            type="date"
            required
            defaultValue={v.fechaFin}
            className={CLASES_CAMPO}
          />
        </div>
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
          href="/app/oficina/asignaciones"
          className="rounded-xl px-4 py-3 text-sm font-medium text-forest-950/55 transition hover:bg-sand-100 hover:text-forest-800"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
