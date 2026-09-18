import type { Rol } from "@/contextos/identidad/dominio/Rol";

/**
 * Sólo rutas — el texto (etiqueta, descripción, título/resumen de cada
 * sección) vive en el diccionario bilingüe (`src/lib/i18n/slices/paneles.ts`)
 * porque depende del idioma activo. `clave` conecta ambos lados.
 */
export type ClaveDeSeccion =
  | "servicios"
  | "reportes"
  | "clientes"
  | "asignaciones"
  | "programar"
  | "cobranza"
  | "trabajos"
  | "ruta"
  | "historial";

type SeccionRuta = { clave: ClaveDeSeccion; ruta?: string };

type PanelRutas = { ruta: string; secciones: SeccionRuta[] };

export const paneles: Record<Rol, PanelRutas> = {
  ADMINISTRADOR: {
    ruta: "/app/administrador",
    secciones: [
      { clave: "servicios", ruta: "/app/administrador/servicios" },
      { clave: "reportes", ruta: "/app/administrador/reportes" },
      { clave: "clientes", ruta: "/app/oficina/clientes" },
      { clave: "asignaciones", ruta: "/app/oficina/asignaciones" },
      { clave: "programar", ruta: "/app/oficina/programar" },
      { clave: "cobranza", ruta: "/app/oficina/cobranza" },
      { clave: "trabajos", ruta: "/app/oficina/trabajos" },
    ],
  },
  OFICINA: {
    ruta: "/app/oficina",
    secciones: [
      { clave: "clientes", ruta: "/app/oficina/clientes" },
      { clave: "asignaciones", ruta: "/app/oficina/asignaciones" },
      { clave: "programar", ruta: "/app/oficina/programar" },
      { clave: "cobranza", ruta: "/app/oficina/cobranza" },
      { clave: "trabajos", ruta: "/app/oficina/trabajos" },
    ],
  },
  TECNICO: {
    ruta: "/app/tecnico",
    secciones: [
      { clave: "ruta", ruta: "/app/tecnico/ruta" },
      { clave: "historial", ruta: "/app/tecnico/historial" },
    ],
  },
};

export function rutaDelPanel(rol: Rol): string {
  return paneles[rol].ruta;
}
