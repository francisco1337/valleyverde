import { randomUUID } from "node:crypto";

import { Cliente } from "@/contextos/clientes/dominio/Cliente";
import { IdCliente } from "@/contextos/clientes/dominio/IdCliente";
import type { NombreDeCliente } from "@/contextos/clientes/dominio/NombreDeCliente";
import type { RepositorioDeClientes } from "@/contextos/clientes/dominio/puertos/RepositorioDeClientes";
import { clientePrisma } from "@/contextos/compartido/infraestructura/persistencia/ClientePrisma";
import type { PrismaClient } from "@/generated/prisma/client";

/** La forma en que MySQL guarda un cliente. No sale de este archivo. */
type FilaCliente = {
  id: string;
  nombre: string;
  contacto: string | null;
  telefono: string | null;
  correo: string | null;
  notas: string | null;
  activo: boolean;
};

/**
 * Adaptador de salida: implementa el puerto contra MySQL, vía Prisma.
 *
 * Recibe cómo conseguir el cliente de Prisma, no el cliente: construirlo abre
 * la conexión, y este repositorio se instancia en sitios donde todavía no hay
 * ninguna consulta que hacer.
 */
export class PrismaRepositorioDeClientes implements RepositorioDeClientes {
  constructor(private readonly prisma: () => PrismaClient = clientePrisma) {}

  siguienteId(): IdCliente {
    return IdCliente.de(randomUUID());
  }

  async buscarPorId(id: IdCliente): Promise<Cliente | null> {
    const fila = await this.prisma().cliente.findUnique({ where: { id: id.valor } });

    return fila ? this.aDominio(fila) : null;
  }

  /**
   * La comparación no distingue mayúsculas porque la tabla está en
   * utf8mb4_unicode_ci: es la collation la que lo resuelve, no un LOWER() que
   * además tiraría el índice a la basura.
   */
  async existeConNombre(nombre: NombreDeCliente): Promise<boolean> {
    const fila = await this.prisma().cliente.findFirst({
      where: { nombre: nombre.valor },
      select: { id: true },
    });

    return fila !== null;
  }

  async guardar(cliente: Cliente): Promise<void> {
    const datos = {
      nombre: cliente.nombre.valor,
      contacto: cliente.contacto,
      telefono: cliente.telefono,
      correo: cliente.correo?.valor ?? null,
      notas: cliente.notas,
      activo: cliente.activo,
    };

    await this.prisma().cliente.upsert({
      where: { id: cliente.id.valor },
      create: { id: cliente.id.valor, ...datos },
      update: datos,
    });
  }

  private aDominio(fila: FilaCliente): Cliente {
    return Cliente.rehidratar({
      id: fila.id,
      nombre: fila.nombre,
      contacto: fila.contacto,
      telefono: fila.telefono,
      correo: fila.correo,
      notas: fila.notas,
      activo: fila.activo,
    });
  }
}
