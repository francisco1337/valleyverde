import { NextResponse, type NextRequest } from "next/server";

import {
  COOKIE_SESION,
  verificarToken,
} from "@/contextos/identidad/infraestructura/seguridad/TokenDeSesion";
import { rutaDelPanel } from "@/lib/paneles";

/**
 * Primer filtro de acceso a /app.
 *
 * Aquí sólo se lee la cookie — nada de consultas a la base. Esto corre en cada
 * navegación, incluidas las que Next precarga al pasar el mouse por un enlace,
 * y su trabajo es evitar pintar una pantalla que de todos modos va a rebotar.
 *
 * La revisión que de verdad manda está en el caso de uso
 * ObtenerUsuarioAutenticado, que sí vuelve a preguntarle a la base.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const esLogin = pathname === "/app/login";

  const sesion = await verificarToken(request.cookies.get(COOKIE_SESION)?.value);

  if (!sesion && !esLogin) {
    return NextResponse.redirect(new URL("/app/login", request.nextUrl));
  }

  if (sesion && esLogin) {
    return NextResponse.redirect(new URL(rutaDelPanel(sesion.rol), request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  // Sólo la app de operaciones. El sitio público no pasa por aquí.
  matcher: ["/app/:path*"],
};
