import "server-only";

import { clientePrisma } from "@/contextos/compartido/infraestructura/persistencia/ClientePrisma";

/**
 * Lado de lectura.
 *
 * Sin puerto, sin repositorio y sin agregado: una consulta no tiene invariantes
 * que proteger, así que hacerla pasar por tres capas sólo agrega archivos. Lo
 * que sí hace falta es un tipo propio — la página consume esto, no una fila de
 * Prisma, para que agregar una columna a la tabla no se filtre a la interfaz.
 */

export type ClienteEnLista = {
  id: string;
  nombre: string;
  contacto: string | null;
  telefono: string | null;
  correo: string | null;
};

/** Los clientes activos, en orden alfabético. Cubierto por @@index([activo, nombre]). */
export async function clientesDeLaCartera(): Promise<ClienteEnLista[]> {
  return clientePrisma().cliente.findMany({
    where: { activo: true },
    orderBy: { nombre: "asc" },
    select: {
      id: true,
      nombre: true,
      contacto: true,
      telefono: true,
      correo: true,
    },
  });
}
