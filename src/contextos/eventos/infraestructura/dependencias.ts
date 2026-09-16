import "server-only";

import { ProgramarEvento } from "@/contextos/eventos/aplicacion/ProgramarEvento";
import { RegistrarEvidencias } from "@/contextos/eventos/aplicacion/RegistrarEvidencias";
import { PrismaRepositorioDeEventos } from "@/contextos/eventos/infraestructura/persistencia/PrismaRepositorioDeEventos";
import { PrismaRepositorioDeEvidencias } from "@/contextos/eventos/infraestructura/persistencia/PrismaRepositorioDeEvidencias";
import type { RepositorioDeEventos } from "@/contextos/eventos/dominio/puertos/RepositorioDeEventos";
import type { RepositorioDeEvidencias } from "@/contextos/eventos/dominio/puertos/RepositorioDeEvidencias";

let repo_: RepositorioDeEventos | undefined;
let repoEvidencias_: RepositorioDeEvidencias | undefined;

function repo(): RepositorioDeEventos {
  return (repo_ ??= new PrismaRepositorioDeEventos());
}

function repoEvidencias(): RepositorioDeEvidencias {
  return (repoEvidencias_ ??= new PrismaRepositorioDeEvidencias());
}

export const eventos = {
  programarEvento: () => new ProgramarEvento(repo()),
  registrarEvidencias: () => new RegistrarEvidencias(repoEvidencias()),
};
