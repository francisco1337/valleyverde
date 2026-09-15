import type { Rol } from "@/contextos/identidad/dominio/Rol";

/**
 * Lo que se recuerda entre una petición y otra.
 *
 * Deliberadamente mínimo: viaja en una cookie firmada (no cifrada), así que
 * cualquiera con el token puede leer su contenido. Nada que no se pueda mostrar.
 */
export type SesionDeUsuario = {
  idUsuario: string;
  nombreUsuario: string;
  nombre: string;
  rol: Rol;
};
