import "server-only";
import { clientePrisma } from "@/contextos/compartido/infraestructura/persistencia/ClientePrisma";

export type ServicioCatalogo = {
  id: string;
  nombre: string;
  descripcion: string | null;
  precioSugerido: string | null;
  activo: boolean;
};

export async function catalogoDeServicios(): Promise<ServicioCatalogo[]> {
  const filas = await clientePrisma().servicio.findMany({
    orderBy: [{ activo: "desc" }, { nombre: "asc" }],
    select: {
      id: true,
      nombre: true,
      descripcion: true,
      precioSugerido: true,
      activo: true,
    },
  });

  return filas.map((f) => ({
    id: f.id,
    nombre: f.nombre,
    descripcion: f.descripcion,
    precioSugerido: f.precioSugerido?.toString() ?? null,
    activo: f.activo,
  }));
}
