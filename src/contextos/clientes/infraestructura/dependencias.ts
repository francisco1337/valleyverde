import "server-only";

import { RegistrarCliente } from "@/contextos/clientes/aplicacion/RegistrarCliente";
import type { RepositorioDeClientes } from "@/contextos/clientes/dominio/puertos/RepositorioDeClientes";
import { PrismaRepositorioDeClientes } from "@/contextos/clientes/infraestructura/persistencia/PrismaRepositorioDeClientes";

/**
 * Raíz de composición de la cartera.
 *
 * Igual que en identidad: los adaptadores se crean cuando se piden, no al
 * importar, porque construir el de Prisma abre la conexión y `next build`
 * corre en máquinas sin DATABASE_URL.
 */

let repositorio_: RepositorioDeClientes | undefined;

function repositorio(): RepositorioDeClientes {
  return (repositorio_ ??= new PrismaRepositorioDeClientes());
}

export const clientes = {
  registrarCliente: () => new RegistrarCliente(repositorio()),
};
