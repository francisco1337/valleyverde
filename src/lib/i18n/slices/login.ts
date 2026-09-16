const es = {
  metaTitulo: "Entrar",
  nombre: "Valley Verde Operaciones",
  nombreCorto: "Verde Ops",
  lema: "Propiedades, cuadrillas y cobranza en un solo lugar",
  licenciaYSeguro: (ciudad: string) => `Con licencia y seguro en el estado de Arizona · ${ciudad}`,
  entrar: "Entrar",
  cuadrillasYCobranza: (nombreEmpresa: string) => `Cuadrillas, cotizaciones y cobranza de ${nombreEmpresa}.`,
  volverAlSitio: "Volver a valleyverde.com",
  usuario: "Usuario",
  contrasena: "Contraseña",
  ocultarContrasena: "Ocultar contraseña",
  mostrarContrasena: "Mostrar contraseña",
  entrando: "Entrando…",
  cuentasDePrueba: "Cuentas de prueba",
  puntosFuertes: [
    {
      icono: "ruta" as const,
      titulo: "La ruta del día, ya armada",
      cuerpo: "Cada parada programada en orden de manejo y asignada a una cuadrilla.",
    },
    {
      icono: "archivo" as const,
      titulo: "Cotizaciones en menos de un minuto",
      cuerpo: "Eliges propiedad, eliges servicios, mandas el PDF.",
    },
    {
      icono: "cartera" as const,
      titulo: "Quién pagó y quién debe",
      cuerpo: "Cuentas por cobrar por cliente, con antigüedad y sin cuadrar nada a mano.",
    },
  ],
  errorConexion: "No se pudo conectar con la base de datos. Revisa DATABASE_URL en el archivo .env.",
};

type SliceDeLogin = typeof es;

const en: SliceDeLogin = {
  metaTitulo: "Log in",
  nombre: "Valley Verde Operations",
  nombreCorto: "Verde Ops",
  lema: "Properties, crews and billing in one place",
  licenciaYSeguro: (ciudad) => `Licensed and insured in the state of Arizona · ${ciudad}`,
  entrar: "Log in",
  cuadrillasYCobranza: (nombreEmpresa) => `Crews, quotes and billing for ${nombreEmpresa}.`,
  volverAlSitio: "Back to valleyverde.com",
  usuario: "Username",
  contrasena: "Password",
  ocultarContrasena: "Hide password",
  mostrarContrasena: "Show password",
  entrando: "Logging in…",
  cuentasDePrueba: "Test accounts",
  puntosFuertes: [
    {
      icono: "ruta",
      titulo: "Today's route, already built",
      cuerpo: "Every stop scheduled in driving order and assigned to a crew.",
    },
    {
      icono: "archivo",
      titulo: "Quotes in under a minute",
      cuerpo: "Pick a property, pick the services, send the PDF.",
    },
    {
      icono: "cartera",
      titulo: "Who paid and who owes",
      cuerpo: "Accounts receivable per client, with aging — nothing to reconcile by hand.",
    },
  ],
  errorConexion: "Couldn't connect to the database. Check DATABASE_URL in your .env file.",
};

export const login = { es, en };
