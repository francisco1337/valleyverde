import { randomUUID } from "node:crypto";

import { IdUsuario } from "@/contextos/identidad/dominio/IdUsuario";
import type { NombreUsuario } from "@/contextos/identidad/dominio/NombreUsuario";
import type { RepositorioDeUsuarios } from "@/contextos/identidad/dominio/puertos/RepositorioDeUsuarios";
import { esRol, type Rol } from "@/contextos/identidad/dominio/Rol";
import { Usuario } from "@/contextos/identidad/dominio/Usuario";
import { clientePrisma } from "@/contextos/identidad/infraestructura/persistencia/ClientePrisma";
import type { PrismaClient } from "@/generated/prisma/client";

/** La forma en que MySQL guarda un usuario. No sale de este archivo. */
type FilaUsuario = {
  id: string;
  usuario: string;
  nombre: string;
  passwordHash: string;
  rol: string;
  activo: boolean;
};

/**
 * Adaptador de salida: implementa el puerto contra MySQL, vía Prisma.
 *
 * Aquí y sólo aquí se traduce entre la fila de la tabla y el agregado. El
 * dominio no sabe que existe una columna `passwordHash` ni un enum de Prisma.
 */
export class PrismaRepositorioDeUsuarios implements RepositorioDeUsuarios {
  /**
   * Recibe cómo conseguir el cliente, no el cliente: construirlo abre la
   * conexión, y este repositorio se instancia en sitios donde todavía no hay
   * ninguna consulta que hacer (por ejemplo al prerenderizar /app durante el
   * build, en una máquina sin DATABASE_URL).
   */
  constructor(private readonly prisma: () => PrismaClient = clientePrisma) {}

  siguienteId(): IdUsuario {
    return IdUsuario.de(randomUUID());
  }

  async buscarPorNombreUsuario(nombreUsuario: NombreUsuario): Promise<Usuario | null> {
    const fila = await this.prisma().usuario.findUnique({
      where: { usuario: nombreUsuario.valor },
    });

    return fila ? this.aDominio(fila) : null;
  }

  async buscarPorId(id: IdUsuario): Promise<Usuario | null> {
    const fila = await this.prisma().usuario.findUnique({ where: { id: id.valor } });

    return fila ? this.aDominio(fila) : null;
  }

  async guardar(usuario: Usuario): Promise<void> {
    const datos = {
      usuario: usuario.nombreUsuario.valor,
      nombre: usuario.nombre,
      passwordHash: usuario.contrasena.valor,
      rol: usuario.rol,
      activo: usuario.activo,
    };

    await this.prisma().usuario.upsert({
      where: { id: usuario.id.valor },
      create: { id: usuario.id.valor, ...datos },
      update: datos,
    });
  }

  private aDominio(fila: FilaUsuario): Usuario {
    return Usuario.rehidratar({
      id: fila.id,
      nombreUsuario: fila.usuario,
      nombre: fila.nombre,
      hashDeContrasena: fila.passwordHash,
      rol: this.aRol(fila.rol),
      activo: fila.activo,
    });
  }

  /**
   * El enum de Prisma y el del dominio hoy tienen los mismos valores, pero son
   * dos listas distintas. Se comprueba en la frontera en vez de asumirlo: si
   * alguien agrega un rol en el schema y olvida el dominio, truena aquí, con
   * nombre y apellido, y no tres capas más adentro.
   */
  private aRol(valor: string): Rol {
    if (!esRol(valor)) {
      throw new Error(
        `La base tiene el rol "${valor}", que el dominio no conoce. ` +
          "Agrégalo en src/contextos/identidad/dominio/Rol.ts.",
      );
    }
    return valor;
  }
}
