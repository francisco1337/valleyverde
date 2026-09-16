const es = {
  ADMINISTRADOR: {
    etiqueta: "ADMINISTRADOR",
    descripcion: "Acceso total: catálogo de servicios, reportes y toda la operación de oficina.",
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
    descripcion: "Clientes, asignaciones, agenda, cobranza y trabajos completados.",
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
    descripcion: "Ruta del día, cierre de visitas con fotos y su historial de trabajos.",
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
    descripcion: "Full access: service catalog, reports and the entire office operation.",
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
    descripcion: "Clients, assignments, scheduling, billing and completed jobs.",
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
    descripcion: "Today's route, closing out visits with photos and their job history.",
    secciones: {
      ruta: { titulo: "Today's route", resumen: "Stops in driving order." },
      historial: { titulo: "Past jobs", resumen: "History of completed visits." },
    },
  },
};

export const paneles = { es, en };
