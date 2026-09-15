import { Cliente } from "@/contextos/clientes/dominio/Cliente";
import { NombreDeClienteRepetido } from "@/contextos/clientes/dominio/errores/NombreDeClienteRepetido";
import { NombreDeCliente } from "@/contextos/clientes/dominio/NombreDeCliente";
import type { RepositorioDeClientes } from "@/contextos/clientes/dominio/puertos/RepositorioDeClientes";

export type DatosDeAltaDeCliente = {
  nombre: string;
  contacto?: string | null;
  telefono?: string | null;
  correo?: string | null;
  notas?: string | null;
};

/** Caso de uso: la oficina da de alta un cliente nuevo. */
export class RegistrarCliente {
  constructor(private readonly repositorio: RepositorioDeClientes) {}

  async ejecutar(datos: DatosDeAltaDeCliente): Promise<{ id: string }> {
    // Se valida el nombre antes de preguntarle a la base: si viene vacío, el
    // error que la persona debe leer es "escribe el nombre", no "ya existe".
    const nombre = NombreDeCliente.de(datos.nombre);

    if (await this.repositorio.existeConNombre(nombre)) {
      throw new NombreDeClienteRepetido(nombre.valor);
    }

    const cliente = Cliente.registrar({
      id: this.repositorio.siguienteId().valor,
      nombre: nombre.valor,
      contacto: datos.contacto,
      telefono: datos.telefono,
      correo: datos.correo,
      notas: datos.notas,
    });

    await this.repositorio.guardar(cliente);

    return { id: cliente.id.valor };
  }
}
