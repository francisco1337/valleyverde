import type { CifradorDeContrasenas } from "@/contextos/identidad/dominio/puertos/CifradorDeContrasenas";
import type { RepositorioDeUsuarios } from "@/contextos/identidad/dominio/puertos/RepositorioDeUsuarios";
import { NombreUsuario } from "@/contextos/identidad/dominio/NombreUsuario";
import type { Rol } from "@/contextos/identidad/dominio/Rol";
import { Usuario } from "@/contextos/identidad/dominio/Usuario";

export type PeticionDeAlta = {
  usuario: string;
  nombre: string;
  rol: Rol;
  contrasenaInicial: string;
};

/**
 * Caso de uso: que exista una cuenta, sin pisar la que ya está.
 *
 * Es lo que necesita el seed y lo que necesitará el alta desde el panel de
 * administrador. Si la cuenta ya existe no se le toca la contraseña: puede que
 * alguien ya la haya cambiado, y volver a sembrar no debería deshacer eso.
 */
export class AsegurarUsuario {
  constructor(
    private readonly usuarios: RepositorioDeUsuarios,
    private readonly cifrador: CifradorDeContrasenas,
  ) {}

  async ejecutar(peticion: PeticionDeAlta): Promise<{ creado: boolean }> {
    const nombreUsuario = NombreUsuario.de(peticion.usuario);

    if (await this.usuarios.buscarPorNombreUsuario(nombreUsuario)) {
      return { creado: false };
    }

    const usuario = Usuario.registrar({
      id: this.usuarios.siguienteId().valor,
      nombreUsuario: nombreUsuario.valor,
      nombre: peticion.nombre,
      contrasena: await this.cifrador.hashear(peticion.contrasenaInicial),
      rol: peticion.rol,
    });

    await this.usuarios.guardar(usuario);

    return { creado: true };
  }
}
