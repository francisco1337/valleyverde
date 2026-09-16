import "server-only";

import { RegistrarCliente } from "@/contextos/clientes/aplicacion/RegistrarCliente";
import { RegistrarUbicacion } from "@/contextos/clientes/aplicacion/RegistrarUbicacion";
import type { RepositorioDeClientes } from "@/contextos/clientes/dominio/puertos/RepositorioDeClientes";
import type { RepositorioDeUbicaciones } from "@/contextos/clientes/dominio/puertos/RepositorioDeUbicaciones";
import { PrismaRepositorioDeClientes } from "@/contextos/clientes/infraestructura/persistencia/PrismaRepositorioDeClientes";
import { PrismaRepositorioDeUbicaciones } from "@/contextos/clientes/infraestructura/persistencia/PrismaRepositorioDeUbicaciones";

let repoClientes_: RepositorioDeClientes | undefined;
let repoUbicaciones_: RepositorioDeUbicaciones | undefined;

function repoClientes(): RepositorioDeClientes {
  return (repoClientes_ ??= new PrismaRepositorioDeClientes());
}

function repoUbicaciones(): RepositorioDeUbicaciones {
  return (repoUbicaciones_ ??= new PrismaRepositorioDeUbicaciones());
}

export const clientes = {
  registrarCliente: () => new RegistrarCliente(repoClientes()),
  registrarUbicacion: () => new RegistrarUbicacion(repoUbicaciones()),
};
