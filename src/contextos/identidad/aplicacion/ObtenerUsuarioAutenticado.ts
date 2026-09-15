import { IdUsuario } from "@/contextos/identidad/dominio/IdUsuario";
import type { GestorDeSesiones } from "@/contextos/identidad/dominio/puertos/GestorDeSesiones";
import type { RepositorioDeUsuarios } from "@/contextos/identidad/dominio/puertos/RepositorioDeUsuarios";
import {
  aUsuarioAutenticado,
  type UsuarioAutenticado,
} from "@/contextos/identidad/aplicacion/UsuarioAutenticado";

/**
 * Caso de uso: quién está haciendo esta petición.
 *
 * La cookie sola no basta. Un token sigue siendo válido durante días, y en esos
 * días a alguien lo pueden dar de baja o cambiarle el rol. Por eso se vuelve a
 * leer el usuario: la cookie dice a quién preguntar, la base dice qué contestar.
 */
export class ObtenerUsuarioAutenticado {
  constructor(
    private readonly usuarios: RepositorioDeUsuarios,
    private readonly sesiones: GestorDeSesiones,
  ) {}

  async ejecutar(): Promise<UsuarioAutenticado | null> {
    const sesion = await this.sesiones.actual();
    if (!sesion) return null;

    const usuario = await this.usuarios.buscarPorId(IdUsuario.de(sesion.idUsuario));

    if (!usuario || !usuario.activo) return null;

    return aUsuarioAutenticado(usuario);
  }
}
