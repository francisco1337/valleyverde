import { CredencialesInvalidas } from "@/contextos/identidad/dominio/errores/CredencialesInvalidas";
import { NombreUsuario } from "@/contextos/identidad/dominio/NombreUsuario";
import type { CifradorDeContrasenas } from "@/contextos/identidad/dominio/puertos/CifradorDeContrasenas";
import type { GestorDeSesiones } from "@/contextos/identidad/dominio/puertos/GestorDeSesiones";
import type { RepositorioDeUsuarios } from "@/contextos/identidad/dominio/puertos/RepositorioDeUsuarios";
import {
  aUsuarioAutenticado,
  type UsuarioAutenticado,
} from "@/contextos/identidad/aplicacion/UsuarioAutenticado";

export type PeticionDeInicioDeSesion = {
  usuario: string;
  contrasena: string;
};

/**
 * Caso de uso: alguien entra al sistema.
 *
 * Orquesta, no decide. Quién puede entrar lo decide el agregado Usuario; de
 * dónde salen los datos y dónde queda la sesión lo resuelven los puertos.
 */
export class IniciarSesion {
  constructor(
    private readonly usuarios: RepositorioDeUsuarios,
    private readonly cifrador: CifradorDeContrasenas,
    private readonly sesiones: GestorDeSesiones,
  ) {}

  async ejecutar(peticion: PeticionDeInicioDeSesion): Promise<UsuarioAutenticado> {
    const nombreUsuario = NombreUsuario.de(peticion.usuario);

    if (!peticion.contrasena) {
      throw new CredencialesInvalidas();
    }

    const usuario = await this.usuarios.buscarPorNombreUsuario(nombreUsuario);

    if (!usuario) {
      // Nadie con ese nombre. Se gasta el mismo tiempo que en una comparación
      // real para no delatar qué cuentas existen.
      await this.cifrador.simularComparacion(peticion.contrasena);
      throw new CredencialesInvalidas();
    }

    await usuario.autenticar(peticion.contrasena, this.cifrador);

    await this.sesiones.abrir(usuario.aSesion());

    return aUsuarioAutenticado(usuario);
  }
}
