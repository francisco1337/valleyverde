"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, LoaderCircle, LogIn, TriangleAlert } from "lucide-react";

import { iniciarSesion } from "@/app/app/login/actions";
import { ESTADO_LOGIN_INICIAL } from "@/app/app/login/estado";
import { cuentasIniciales } from "@/lib/ops";

export function LoginForm() {
  const [estado, enviar, pendiente] = useActionState(
    iniciarSesion,
    ESTADO_LOGIN_INICIAL,
  );

  const [verContrasena, setVerContrasena] = useState(false);

  // Sólo controlados para que los botones de abajo puedan llenarlos.
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");

  return (
    <div className="space-y-8">
      <form action={enviar} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <label
            htmlFor="usuario"
            className="block text-xs font-semibold tracking-wide text-forest-900/70 uppercase"
          >
            Usuario
          </label>
          <input
            id="usuario"
            name="usuario"
            type="text"
            autoComplete="username"
            autoCapitalize="characters"
            required
            value={usuario}
            onChange={(evento) => setUsuario(evento.target.value)}
            placeholder="ADMINISTRADOR"
            disabled={pendiente}
            className="w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-sm text-forest-950 uppercase outline-none transition placeholder:text-forest-950/35 placeholder:normal-case focus:border-forest-400 focus:ring-4 focus:ring-forest-500/10 disabled:opacity-60"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="contrasena"
            className="block text-xs font-semibold tracking-wide text-forest-900/70 uppercase"
          >
            Contraseña
          </label>

          <div className="relative">
            <input
              id="contrasena"
              name="contrasena"
              type={verContrasena ? "text" : "password"}
              autoComplete="current-password"
              required
              value={contrasena}
              onChange={(evento) => setContrasena(evento.target.value)}
              placeholder="••••••••"
              disabled={pendiente}
              className="w-full rounded-xl border border-sand-300 bg-white py-3 pr-12 pl-4 text-sm text-forest-950 outline-none transition placeholder:text-forest-950/35 focus:border-forest-400 focus:ring-4 focus:ring-forest-500/10 disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => setVerContrasena((valor) => !valor)}
              aria-label={verContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-forest-900/45 transition hover:text-forest-700 focus-visible:ring-2 focus-visible:ring-forest-400 focus-visible:outline-none"
            >
              {verContrasena ? (
                <EyeOff className="h-4.5 w-4.5" aria-hidden />
              ) : (
                <Eye className="h-4.5 w-4.5" aria-hidden />
              )}
            </button>
          </div>
        </div>

        <div aria-live="polite" className="min-h-0">
          {estado.error ? (
            <p className="flex items-start gap-2 rounded-xl border border-ember-300 bg-ember-50 px-3.5 py-3 text-sm text-ember-700">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>{estado.error}</span>
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={pendiente}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest-700 px-4 py-3.5 text-sm font-semibold text-sand-50 shadow-sm transition hover:bg-forest-600 focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:ring-offset-2 focus-visible:ring-offset-sand-50 focus-visible:outline-none active:bg-forest-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pendiente ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
              Entrando…
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" aria-hidden />
              Entrar
            </>
          )}
        </button>
      </form>

      {/* Atajos para las cuentas que siembra el seed. Se borran junto con
          `cuentasIniciales` el día que haya usuarios de verdad. */}
      <div className="rounded-xl border border-dashed border-sand-300 bg-sand-100/60 p-4">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-forest-900/50 uppercase">
          Cuentas de prueba
        </p>

        <div className="mt-3 grid gap-2">
          {cuentasIniciales.map((cuenta) => (
            <button
              key={cuenta.rol}
              type="button"
              disabled={pendiente}
              onClick={() => {
                setUsuario(cuenta.usuario);
                setContrasena(cuenta.contrasena);
              }}
              className="flex items-baseline justify-between gap-3 rounded-lg bg-white px-3 py-2.5 text-left ring-1 ring-sand-200 transition hover:ring-forest-400 focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:outline-none disabled:opacity-60"
            >
              <span className="text-xs font-bold tracking-wide text-forest-800">
                {cuenta.rol}
              </span>
              <span className="text-[11px] text-forest-950/45">
                {cuenta.descripcion}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
