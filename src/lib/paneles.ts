import type { Rol } from "@/contextos/identidad/dominio/Rol";

export type Seccion = {
  titulo: string;
  resumen: string;
  ruta?: string;
};

export type Panel = {
  etiqueta: string;
  descripcion: string;
  ruta: string;
  secciones: Seccion[];
};

export const paneles: Record<Rol, Panel> = {
  ADMINISTRADOR: {
    etiqueta: "ADMINISTRADOR",
    descripcion: "Acceso completo: usuarios, operación y facturación.",
    ruta: "/app/administrador",
    secciones: [
      { titulo: "Usuarios y permisos", resumen: "Altas, bajas y cambios de rol." },
      { titulo: "Catálogo de servicios", resumen: "Qué servicios ofrece la empresa." },
      { titulo: "Reportes", resumen: "Cómo va el negocio." },
    ],
  },
  OFICINA: {
    etiqueta: "OFICINA",
    descripcion: "Clientes, contratos, agenda y cobranza.",
    ruta: "/app/oficina",
    secciones: [
      {
        titulo: "Clientes",
        resumen: "Contactos y propiedades a su nombre.",
        ruta: "/app/oficina/clientes",
      },
      {
        titulo: "Asignaciones",
        resumen: "Contratos recurrentes por propiedad.",
        ruta: "/app/oficina/asignaciones",
      },
      {
        titulo: "Programar",
        resumen: "Agenda visitas asignando técnico, fecha y hora.",
        ruta: "/app/oficina/programar",
      },
      { titulo: "Cobranza", resumen: "Quién pagó y quién debe." },
    ],
  },
  TECNICO: {
    etiqueta: "TECNICO",
    descripcion: "Ruta del día y cierre de trabajos en campo.",
    ruta: "/app/tecnico",
    secciones: [
      { titulo: "Mi ruta de hoy", resumen: "Las paradas en orden de manejo." },
      { titulo: "Trabajos", resumen: "Marcar terminado y subir fotos." },
    ],
  },
};

export function rutaDelPanel(rol: Rol): string {
  return paneles[rol].ruta;
}
