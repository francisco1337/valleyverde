const es = {
  metaTitulo: "Programar",
  agenda: "Agenda",
  programar: "Programar",
  ayuda: "Agenda visitas a partir de las asignaciones activas. Elige técnico, fecha y hora.",
  visitasProgramadas: "Visitas programadas",
  sinVisitasProgramadas: "Sin visitas programadas",
  usaElFormulario: "Usa el formulario para agendar la primera.",
  nuevaVisita: "Nueva visita",
  noHayAsignacionesActivas: "No hay asignaciones activas. Crea una primero.",
  periodicidad: {
    DIARIO: "Diario",
    SEMANAL: "Semanal",
    QUINCENAL: "Quincenal",
    MENSUAL: "Mensual",
  },

  form: {
    asignacion: "Asignación",
    elegirAsignacion: "— Elige una asignación —",
    tecnico: "Técnico",
    elegirTecnico: "— Elige un técnico —",
    fecha: "Fecha",
    hora: "Hora",
    notas: "Notas",
    notasPlaceholder: "Instrucciones especiales para esta visita…",
    programarVisita: "Programar visita",
    programando: "Programando…",
    visitaProgramadaOk: "Visita programada correctamente.",
  },

  errores: {
    eligeAsignacion: "Elige una asignación.",
    eligeTecnico: "Elige un técnico.",
    eligeFecha: "Elige la fecha.",
    indicaHora: "Indica la hora.",
    asignacionNoExiste: "La asignación no existe.",
    eventoDuplicado: "Ya existe un evento programado para esa asignación, fecha y hora.",
  },
};

type SliceDeProgramar = typeof es;

const en: SliceDeProgramar = {
  metaTitulo: "Schedule",
  agenda: "Schedule",
  programar: "Schedule",
  ayuda: "Book visits from active assignments. Choose a technician, date and time.",
  visitasProgramadas: "Scheduled visits",
  sinVisitasProgramadas: "No scheduled visits",
  usaElFormulario: "Use the form to book the first one.",
  nuevaVisita: "New visit",
  noHayAsignacionesActivas: "No active assignments. Create one first.",
  periodicidad: {
    DIARIO: "Daily",
    SEMANAL: "Weekly",
    QUINCENAL: "Biweekly",
    MENSUAL: "Monthly",
  },

  form: {
    asignacion: "Assignment",
    elegirAsignacion: "— Choose an assignment —",
    tecnico: "Technician",
    elegirTecnico: "— Choose a technician —",
    fecha: "Date",
    hora: "Time",
    notas: "Notes",
    notasPlaceholder: "Special instructions for this visit…",
    programarVisita: "Schedule visit",
    programando: "Scheduling…",
    visitaProgramadaOk: "Visit scheduled successfully.",
  },

  errores: {
    eligeAsignacion: "Choose an assignment.",
    eligeTecnico: "Choose a technician.",
    eligeFecha: "Choose the date.",
    indicaHora: "Enter the time.",
    asignacionNoExiste: "The assignment doesn't exist.",
    eventoDuplicado: "There's already a scheduled event for that assignment, date and time.",
  },
};

export const programar = { es, en };
