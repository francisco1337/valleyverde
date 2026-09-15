import type { IdUsuario } from "@/contextos/identidad/dominio/IdUsuario";
import type { NombreUsuario } from "@/contextos/identidad/dominio/NombreUsuario";
import type { Usuario } from "@/contextos/identidad/dominio/Usuario";

/** Puerto de salida: de dónde salen y a dónde van los usuarios. */
export interface RepositorioDeUsuarios {
  /**
   * Una identidad nueva, sin tocar la base. Permite construir un Usuario
   * completo y válido antes de guardarlo — y probar el alta sin MySQL.
   */
  siguienteId(): IdUsuario;

  buscarPorNombreUsuario(nombreUsuario: NombreUsuario): Promise<Usuario | null>;

  buscarPorId(id: IdUsuario): Promise<Usuario | null>;

  guardar(usuario: Usuario): Promise<void>;
}
