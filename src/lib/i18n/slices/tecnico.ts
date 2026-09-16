const es = {
  ruta: {
    metaTitulo: "Mi ruta de hoy",
    miRutaDeHoy: "Mi ruta de hoy",
    pendiente: (n: number) => `${n} pendiente${n !== 1 ? "s" : ""}`,
    completado: (n: number) => ` · ${n} completado${n !== 1 ? "s" : ""}`,
    sinTrabajosHoy: "No tienes trabajos programados para hoy.",
  },
  detalle: {
    metaTitulo: "Trabajo",
    miRutaDeHoy: "Mi ruta de hoy",
    acceso: "Acceso: ",
    llamarA: (nombre: string) => `Llamar a ${nombre}`,
    cerrarTrabajo: "Cerrar trabajo",
    notasDelCierre: "Notas del cierre",
    errorNoEncontrado: "Evento no encontrado o no autorizado.",
    errorYaCerrado: "Este trabajo ya está cerrado.",
  },
  historial: {
    metaTitulo: "Trabajos anteriores",
    trabajosAnteriores: "Trabajos anteriores",
    trabajosCompletados: (n: number) => `${n} trabajo${n !== 1 ? "s" : ""} completado${n !== 1 ? "s" : ""}`,
    aunNoTieneTrabajos: "Aún no tienes trabajos completados.",
  },
  subirEvidencia: {
    evidenciaFotografica: "Evidencia fotográfica",
    foto: "Foto",
    notasDelTrabajo: "Notas del trabajo",
    notasPlaceholder: "Describe lo que se hizo o cualquier observación...",
    errorProcesarFoto: "No se pudo procesar una de las fotos. Intenta de nuevo.",
    marcarCompletado: "Marcar como completado",
  },
  mapa: {
    tuUbicacion: "Tu ubicación",
    miUbicacion: "Mi ubicación",
    navegarConGoogleMaps: "Navegar con Google Maps",
  },
};

type SliceDeTecnico = typeof es;

const en: SliceDeTecnico = {
  ruta: {
    metaTitulo: "Today's route",
    miRutaDeHoy: "Today's route",
    pendiente: (n) => `${n} pending`,
    completado: (n) => ` · ${n} completed`,
    sinTrabajosHoy: "You have no jobs scheduled for today.",
  },
  detalle: {
    metaTitulo: "Job",
    miRutaDeHoy: "Today's route",
    acceso: "Access: ",
    llamarA: (nombre) => `Call ${nombre}`,
    cerrarTrabajo: "Close out job",
    notasDelCierre: "Closing notes",
    errorNoEncontrado: "Job not found or not authorized.",
    errorYaCerrado: "This job is already closed.",
  },
  historial: {
    metaTitulo: "Past jobs",
    trabajosAnteriores: "Past jobs",
    trabajosCompletados: (n) => `${n} completed ${n !== 1 ? "jobs" : "job"}`,
    aunNoTieneTrabajos: "You don't have any completed jobs yet.",
  },
  subirEvidencia: {
    evidenciaFotografica: "Photo evidence",
    foto: "Photo",
    notasDelTrabajo: "Job notes",
    notasPlaceholder: "Describe what was done or any observations...",
    errorProcesarFoto: "Couldn't process one of the photos. Please try again.",
    marcarCompletado: "Mark as completed",
  },
  mapa: {
    tuUbicacion: "Your location",
    miUbicacion: "My location",
    navegarConGoogleMaps: "Navigate with Google Maps",
  },
};

export const tecnico = { es, en };
