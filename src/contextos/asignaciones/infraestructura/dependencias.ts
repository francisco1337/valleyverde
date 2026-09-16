import "server-only";

import { CrearAsignacion } from "@/contextos/asignaciones/aplicacion/CrearAsignacion";
import { PrismaRepositorioDeAsignaciones } from "@/contextos/asignaciones/infraestructura/persistencia/PrismaRepositorioDeAsignaciones";
import type { RepositorioDeAsignaciones } from "@/contextos/asignaciones/dominio/puertos/RepositorioDeAsignaciones";

let repo_: RepositorioDeAsignaciones | undefined;

function repo(): RepositorioDeAsignaciones {
  return (repo_ ??= new PrismaRepositorioDeAsignaciones());
}

export const asignaciones = {
  crearAsignacion: () => new CrearAsignacion(repo()),
};
