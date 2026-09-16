const es = {
  ADMINISTRADOR: {
    etiqueta: "ADMINISTRADOR",
    descripcion: "Acceso completo: usuarios, operación y facturación.",
    secciones: {
      servicios: { titulo: "Catálogo de servicios", resumen: "Qué servicios ofrece la empresa." },
      reportes: { titulo: "Reportes", resumen: "Cómo va el negocio." },
      clientes: { titulo: "Clientes", resumen: "Contactos y propiedades a su nombre." },
      asignaciones: { titulo: "Asignaciones", resumen: "Contratos recurrentes por propiedad." },
      programar: { titulo: "Programar", resumen: "Agenda visitas asignando técnico, fecha y hora." },
      cobranza: { titulo: "Cobranza", resumen: "Quién pagó y quién debe." },
      trabajos: { titulo: "Catálogo de trabajos", resumen: "Trabajos completados, con fotos de evidencia." },
    },
  },
  OFICINA: {
    etiqueta: "OFICINA",
    descripcion: "Clientes, contratos, agenda y cobranza.",
    secciones: {
      clientes: { titulo: "Clientes", resumen: "Contactos y propiedades a su nombre." },
      asignaciones: { titulo: "Asignaciones", resumen: "Contratos recurrentes por propiedad." },
      programar: { titulo: "Programar", resumen: "Agenda visitas asignando técnico, fecha y hora." },
      cobranza: { titulo: "Cobranza", resumen: "Quién pagó y quién debe." },
      trabajos: { titulo: "Catálogo de trabajos", resumen: "Trabajos completados, con fotos de evidencia." },
    },
  },
  TECNICO: {
    etiqueta: "TECNICO",
    descripcion: "Ruta del día y cierre de trabajos en campo.",
    secciones: {
      ruta: { titulo: "Mi ruta de hoy", resumen: "Las paradas en orden de manejo." },
      historial: { titulo: "Trabajos anteriores", resumen: "Historial de visitas completadas." },
    },
  },
};

type SliceDePaneles = typeof es;

const en: SliceDePaneles = {
  ADMINISTRADOR: {
    etiqueta: "ADMIN",
    descripcion: "Full access: users, operations and billing.",
    secciones: {
      servicios: { titulo: "Service catalog", resumen: "What services the company offers." },
      reportes: { titulo: "Reports", resumen: "How the business is doing." },
      clientes: { titulo: "Clients", resumen: "Contacts and properties under their name." },
      asignaciones: { titulo: "Assignments", resumen: "Recurring contracts per property." },
      programar: { titulo: "Schedule", resumen: "Book visits by assigning a technician, date and time." },
      cobranza: { titulo: "Billing", resumen: "Who paid and who owes." },
      trabajos: { titulo: "Job catalog", resumen: "Completed jobs, with evidence photos." },
    },
  },
  OFICINA: {
    etiqueta: "OFFICE",
    descripcion: "Clients, contracts, scheduling and billing.",
    secciones: {
      clientes: { titulo: "Clients", resumen: "Contacts and properties under their name." },
      asignaciones: { titulo: "Assignments", resumen: "Recurring contracts per property." },
      programar: { titulo: "Schedule", resumen: "Book visits by assigning a technician, date and time." },
      cobranza: { titulo: "Billing", resumen: "Who paid and who owes." },
      trabajos: { titulo: "Job catalog", resumen: "Completed jobs, with evidence photos." },
    },
  },
  TECNICO: {
    etiqueta: "TECHNICIAN",
    descripcion: "Today's route and closing out jobs in the field.",
    secciones: {
      ruta: { titulo: "Today's route", resumen: "Stops in driving order." },
      historial: { titulo: "Past jobs", resumen: "History of completed visits." },
    },
  },
};

export const paneles = { es, en };
