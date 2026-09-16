import "server-only";

import { ProgramarEvento } from "@/contextos/eventos/aplicacion/ProgramarEvento";
import { PrismaRepositorioDeEventos } from "@/contextos/eventos/infraestructura/persistencia/PrismaRepositorioDeEventos";
import type { RepositorioDeEventos } from "@/contextos/eventos/dominio/puertos/RepositorioDeEventos";

let repo_: RepositorioDeEventos | undefined;

function repo(): RepositorioDeEventos {
  return (repo_ ??= new PrismaRepositorioDeEventos());
}

export const eventos = {
  programarEvento: () => new ProgramarEvento(repo()),
};
