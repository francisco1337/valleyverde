import "server-only";

import { cookies } from "next/headers";

import type { GestorDeSesiones } from "@/contextos/identidad/dominio/puertos/GestorDeSesiones";
import type { SesionDeUsuario } from "@/contextos/identidad/dominio/SesionDeUsuario";
import {
  COOKIE_SESION,
  DURACION_SESION_MS,
  firmarToken,
  verificarToken,
} from "@/contextos/identidad/infraestructura/seguridad/TokenDeSesion";

/**
 * Adaptador de salida: la sesión vive en una cookie httpOnly firmada con JWT.
 *
 * No hay tabla de sesiones. A cambio de esa simplicidad, cerrar sesión sólo
 * borra la cookie del navegador: un token robado sigue siendo válido hasta que
 * expira. Si algún día hace falta revocar en el acto, se cambia este archivo y
 * nada más — el puerto seguiría igual.
 */
export class SesionEnCookie implements GestorDeSesiones {
  async abrir(sesion: SesionDeUsuario): Promise<void> {
    const almacen = await cookies();

    almacen.set(COOKIE_SESION, await firmarToken(sesion), {
      httpOnly: true,
      // En desarrollo se sirve por http, donde `secure` haría que el navegador
      // tirara la cookie.
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(Date.now() + DURACION_SESION_MS),
      path: "/",
    });
  }

  async actual(): Promise<SesionDeUsuario | null> {
    const almacen = await cookies();
    return verificarToken(almacen.get(COOKIE_SESION)?.value);
  }

  async cerrar(): Promise<void> {
    const almacen = await cookies();
    almacen.delete(COOKIE_SESION);
  }
}
