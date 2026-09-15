import type { Rol } from "@/contextos/identidad/dominio/Rol";
import type { Usuario } from "@/contextos/identidad/dominio/Usuario";

/**
 * Lo que la aplicación deja salir hacia la interfaz.
 *
 * Un objeto plano, no el agregado: la UI no debe poder llamar `autenticar()` ni
 * tropezarse con el hash de la contraseña. Todo lo que cruza esta frontera
 * cruza en esta forma.
 */
export type UsuarioAutenticado = {
  id: string;
  usuario: string;
  nombre: string;
  rol: Rol;
};

export function aUsuarioAutenticado(usuario: Usuario): UsuarioAutenticado {
  return {
    id: usuario.id.valor,
    usuario: usuario.nombreUsuario.valor,
    nombre: usuario.nombre,
    rol: usuario.rol,
  };
}
