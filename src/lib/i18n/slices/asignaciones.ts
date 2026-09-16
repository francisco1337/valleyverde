const es = {
  metaTituloLista: "Asignaciones",
  contratosRecurrentes: "Contratos recurrentes",
  asignaciones: "Asignaciones",
  todaviaNoHayNinguna: "Todavía no hay ninguna.",
  asignacionesActivas: (n: number) => `${n} ${n === 1 ? "asignación activa" : "asignaciones activas"}.`,
  nuevaAsignacion: "Nueva asignación",
  sinAsignaciones: "Sin asignaciones",
  sinAsignacionesCuerpo:
    "Define los contratos recurrentes de cada propiedad. Desde aquí se generan los eventos que el técnico ve en su ruta.",
  periodicidad: {
    DIARIO: "Diario",
    SEMANAL: "Semanal",
    QUINCENAL: "Quincenal",
    MENSUAL: "Mensual",
  },

  metaTituloNueva: "Nueva asignación",
  nueva: "Nueva",
  programacion: "Programación",
  nuevaAsignacionAyuda:
    "Define el servicio recurrente para una propiedad: qué se hace, con qué frecuencia y a qué precio. El técnico se asigna al programar cada visita.",
  noHayUbicaciones: "No hay ubicaciones",
  noHayUbicacionesCuerpo: "Primero da de alta un cliente y agrega sus propiedades.",
  irAClientes: "Ir a Clientes",

  form: {
    propiedad: "Propiedad",
    elegirUbicacion: "— Elige una ubicación —",
    servicio: "Servicio",
    elegirServicio: "— Elige un servicio —",
    sugerido: (precio: string) => ` (sugerido $${precio})`,
    frecuencia: "Frecuencia",
    precioPorVisita: "Precio por visita (USD)",
    inicioDelContrato: "Inicio del contrato",
    finDelContrato: "Fin del contrato",
    crearAsignacion: "Crear asignación",
  },

  errores: {
    eligeUbicacion: "Elige una ubicación.",
    eligeServicio: "Elige un servicio.",
    periodicidadInvalida: "Periodicidad inválida.",
    precioInvalido: "El precio no es un número válido.",
    fechaInicioInvalida: "Fecha de inicio inválida.",
    fechaFinInvalida: "Fecha de fin inválida.",
  },
};

type SliceDeAsignaciones = typeof es;

const en: SliceDeAsignaciones = {
  metaTituloLista: "Assignments",
  contratosRecurrentes: "Recurring contracts",
  asignaciones: "Assignments",
  todaviaNoHayNinguna: "There aren't any yet.",
  asignacionesActivas: (n) => `${n} active ${n === 1 ? "assignment" : "assignments"}.`,
  nuevaAsignacion: "New assignment",
  sinAsignaciones: "No assignments",
  sinAsignacionesCuerpo:
    "Define each property's recurring contracts. This is where the events the technician sees on their route get generated.",
  periodicidad: {
    DIARIO: "Daily",
    SEMANAL: "Weekly",
    QUINCENAL: "Biweekly",
    MENSUAL: "Monthly",
  },

  metaTituloNueva: "New assignment",
  nueva: "New",
  programacion: "Scheduling",
  nuevaAsignacionAyuda:
    "Define the recurring service for a property: what gets done, how often and at what price. The technician gets assigned when each visit is scheduled.",
  noHayUbicaciones: "No locations",
  noHayUbicacionesCuerpo: "First add a client and their properties.",
  irAClientes: "Go to Clients",

  form: {
    propiedad: "Property",
    elegirUbicacion: "— Choose a location —",
    servicio: "Service",
    elegirServicio: "— Choose a service —",
    sugerido: (precio) => ` (suggested $${precio})`,
    frecuencia: "Frequency",
    precioPorVisita: "Price per visit (USD)",
    inicioDelContrato: "Contract start",
    finDelContrato: "Contract end",
    crearAsignacion: "Create assignment",
  },

  errores: {
    eligeUbicacion: "Choose a location.",
    eligeServicio: "Choose a service.",
    periodicidadInvalida: "Invalid frequency.",
    precioInvalido: "The price isn't a valid number.",
    fechaInicioInvalida: "Invalid start date.",
    fechaFinInvalida: "Invalid end date.",
  },
};

export const asignaciones = { es, en };
