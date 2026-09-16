import "server-only";
import { clientePrisma } from "@/contextos/compartido/infraestructura/persistencia/ClientePrisma";

export type UbicacionOpcion = {
  id: string;
  label: string; // "Cliente / Ubicación"
  clienteNombre: string;
  ubicacionNombre: string;
  direccion: string;
};

export type ServicioOpcion = {
  id: string;
  nombre: string;
  precioSugerido: string | null;
};

export async function ubicacionesParaAsignar(): Promise<UbicacionOpcion[]> {
  const filas = await clientePrisma().ubicacion.findMany({
    where: { activo: true },
    orderBy: [{ cliente: { nombre: "asc" } }, { nombre: "asc" }],
    select: {
      id: true,
      nombre: true,
      direccion: true,
      cliente: { select: { nombre: true } },
    },
  });

  return filas.map((f) => ({
    id: f.id,
    label: `${f.cliente.nombre} / ${f.nombre}`,
    clienteNombre: f.cliente.nombre,
    ubicacionNombre: f.nombre,
    direccion: f.direccion,
  }));
}

export async function serviciosParaAsignar(): Promise<ServicioOpcion[]> {
  const filas = await clientePrisma().servicio.findMany({
    where: { activo: true },
    orderBy: { nombre: "asc" },
    select: { id: true, nombre: true, precioSugerido: true },
  });

  return filas.map((f) => ({
    id: f.id,
    nombre: f.nombre,
    precioSugerido: f.precioSugerido?.toString() ?? null,
  }));
}
