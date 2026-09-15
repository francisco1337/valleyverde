import type { Cliente } from "@/contextos/clientes/dominio/Cliente";
import type { IdCliente } from "@/contextos/clientes/dominio/IdCliente";
import type { NombreDeCliente } from "@/contextos/clientes/dominio/NombreDeCliente";

/** Puerto de salida: de dónde salen y a dónde van los clientes. */
export interface RepositorioDeClientes {
  /** Una identidad nueva, sin tocar la base. */
  siguienteId(): IdCliente;

  buscarPorId(id: IdCliente): Promise<Cliente | null>;

  /** Para impedir altas duplicadas. Ignora mayúsculas. */
  existeConNombre(nombre: NombreDeCliente): Promise<boolean>;

  guardar(cliente: Cliente): Promise<void>;
}
