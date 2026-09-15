import { SignJWT, jwtVerify } from "jose";

import { esRol } from "@/contextos/identidad/dominio/Rol";
import type { SesionDeUsuario } from "@/contextos/identidad/dominio/SesionDeUsuario";

/**
 * Firmado y verificación del token de sesión.
 *
 * Está separado del adaptador de cookie a propósito: proxy.ts necesita leer la
 * sesión de una petición que todavía no llega a React, sin `next/headers`.
 */

/** Nombre de la cookie donde viaja la sesión. */
export const COOKIE_SESION = "vv_sesion";

/** Cuánto dura una sesión antes de volver a pedir contraseña. */
export const DURACION_SESION_MS = 7 * 24 * 60 * 60 * 1000;

function llave(): Uint8Array {
  const secreto = process.env.SESSION_SECRET;

  if (!secreto) {
    throw new Error(
      "Falta SESSION_SECRET en .env. Genera uno con: openssl rand -base64 32",
    );
  }

  return new TextEncoder().encode(secreto);
}

export async function firmarToken(sesion: SesionDeUsuario): Promise<string> {
  return new SignJWT({ ...sesion })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(new Date(Date.now() + DURACION_SESION_MS))
    .sign(llave());
}

/** La sesión si el token es válido y no expiró; si no, null. */
export async function verificarToken(
  token: string | undefined,
): Promise<SesionDeUsuario | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, llave(), { algorithms: ["HS256"] });

    if (
      typeof payload.idUsuario !== "string" ||
      typeof payload.nombreUsuario !== "string" ||
      typeof payload.nombre !== "string" ||
      !esRol(payload.rol)
    ) {
      return null;
    }

    return {
      idUsuario: payload.idUsuario,
      nombreUsuario: payload.nombreUsuario,
      nombre: payload.nombre,
      rol: payload.rol,
    };
  } catch {
    // Vencido, alterado o firmado con otro secreto: para el resto del sistema
    // es exactamente lo mismo que no traer sesión.
    return null;
  }
}
