import type { Rol } from "@/contextos/identidad/dominio/Rol";

/**
 * Cómo se ve cada rol en la interfaz y dónde vive su panel.
 *
 * Esto es capa de presentación, no dominio: al dominio le da igual que
 * ADMINISTRADOR viva en /app/administrador. Por eso está en lib/ y no dentro
 * del contexto de identidad.
 */

export type Seccion = {
  titulo: string;
  resumen: string;
  /**
   * A dónde lleva la tarjeta. Mientras no exista, la sección se pinta como
   * esqueleto: se ve lo que va a haber, pero no se puede entrar.
   */
  ruta?: string;
};

export type Panel = {
  etiqueta: string;
  descripcion: string;
  ruta: string;
  /**
   * Las secciones que tendrá cada panel. Hoy son sólo los títulos: cada una se
   * pinta como una tarjeta vacía que dice a qué rol pertenece. Sirven de
   * esqueleto — el contenido llega cuando se construya cada módulo.
   */
  secciones: Seccion[];
};

export const paneles: Record<Rol, Panel> = {
  ADMINISTRADOR: {
    etiqueta: "ADMINISTRADOR",
    descripcion: "Acceso completo: usuarios, operación y facturación.",
    ruta: "/app/administrador",
    secciones: [
      { titulo: "Usuarios y permisos", resumen: "Altas, bajas y cambios de rol." },
      { titulo: "Clientes y propiedades", resumen: "El catálogo completo." },
      { titulo: "Cuadrillas y rutas", resumen: "Quién trabaja dónde y cuándo." },
      { titulo: "Facturación", resumen: "Cobranza y cuentas por cobrar." },
      { titulo: "Reportes", resumen: "Cómo va el negocio." },
    ],
  },
  OFICINA: {
    etiqueta: "OFICINA",
    descripcion: "Clientes, cotizaciones, agenda y cobranza.",
    ruta: "/app/oficina",
    secciones: [
      {
        titulo: "Clientes",
        resumen: "Contactos y propiedades a su nombre.",
        ruta: "/app/oficina/clientes",
      },
      { titulo: "Cotizaciones", resumen: "Arma, manda y da seguimiento." },
      { titulo: "Agenda", resumen: "Lo programado de la semana." },
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
      { titulo: "Incidencias", resumen: "Reportar lo que salió distinto." },
    ],
  },
};

/** A dónde aterriza alguien con este rol. */
export function rutaDelPanel(rol: Rol): string {
  return paneles[rol].ruta;
}
