import "server-only";

import { CerrarSesion } from "@/contextos/identidad/aplicacion/CerrarSesion";
import { IniciarSesion } from "@/contextos/identidad/aplicacion/IniciarSesion";
import { ObtenerUsuarioAutenticado } from "@/contextos/identidad/aplicacion/ObtenerUsuarioAutenticado";
import type { CifradorDeContrasenas } from "@/contextos/identidad/dominio/puertos/CifradorDeContrasenas";
import type { GestorDeSesiones } from "@/contextos/identidad/dominio/puertos/GestorDeSesiones";
import type { RepositorioDeUsuarios } from "@/contextos/identidad/dominio/puertos/RepositorioDeUsuarios";
import { PrismaRepositorioDeUsuarios } from "@/contextos/identidad/infraestructura/persistencia/PrismaRepositorioDeUsuarios";
import { BcryptCifradorDeContrasenas } from "@/contextos/identidad/infraestructura/seguridad/BcryptCifradorDeContrasenas";
import { SesionEnCookie } from "@/contextos/identidad/infraestructura/seguridad/SesionEnCookie";

/**
 * Raíz de composición del contexto de identidad.
 *
 * El único lugar de la app web donde se dice qué implementación entra en cada
 * puerto. Todo lo de arriba (dominio, casos de uso) recibe interfaces; todo lo
 * de abajo (Prisma, bcrypt, cookies) se elige aquí.
 *
 * Los adaptadores se crean cuando se piden, no al importar: construir el de
 * Prisma abre la conexión, y `next build` corre en máquinas sin DATABASE_URL.
 */

let repositorio_: RepositorioDeUsuarios | undefined;
let cifrador_: CifradorDeContrasenas | undefined;
let sesiones_: GestorDeSesiones | undefined;

function repositorio(): RepositorioDeUsuarios {
  return (repositorio_ ??= new PrismaRepositorioDeUsuarios());
}

function cifrador(): CifradorDeContrasenas {
  return (cifrador_ ??= new BcryptCifradorDeContrasenas());
}

function sesiones(): GestorDeSesiones {
  return (sesiones_ ??= new SesionEnCookie());
}

export const identidad = {
  iniciarSesion: () => new IniciarSesion(repositorio(), cifrador(), sesiones()),
  cerrarSesion: () => new CerrarSesion(sesiones()),
  obtenerUsuarioAutenticado: () =>
    new ObtenerUsuarioAutenticado(repositorio(), sesiones()),
};
