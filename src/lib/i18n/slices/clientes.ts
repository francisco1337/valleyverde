const es = {
  metaTituloLista: "Clientes",
  cartera: "Cartera",
  clientes: "Clientes",
  todaviaNoHayNinguno: "Todavía no hay ninguno.",
  clientesActivos: (n: number) => `${n} ${n === 1 ? "cliente activo" : "clientes activos"}.`,
  nuevoCliente: "Nuevo cliente",
  carteraVacia: "La cartera está vacía",
  carteraVaciaCuerpo:
    "Da de alta el primer cliente. Después le cuelgas sus ubicaciones y a cada ubicación los servicios que tiene contratados.",

  metaTituloNuevo: "Nuevo cliente",
  nuevoClienteAyuda:
    "Sólo el nombre es obligatorio. Lo demás se puede completar después — es común dar de alta la empresa antes de saber con quién se va a tratar.",

  metaTituloDetalle: "Cliente",
  cliente: "Cliente",
  propiedades: "Propiedades",
  ubicaciones: "Ubicaciones",
  todaviaNoHayNinguna: "Todavía no hay ninguna.",
  ubicacionesActivas: (n: number) => `${n} ${n === 1 ? "ubicación activa" : "ubicaciones activas"}.`,
  nuevaUbicacion: "Nueva ubicación",
  sinUbicaciones: "Sin ubicaciones",
  sinUbicacionesCuerpo: "Agrega las propiedades de este cliente para poder asignarles servicios.",

  metaTituloNuevaUbicacion: "Nueva ubicación",
  nuevaUbicacionAyuda: "Una propiedad donde se presta el servicio. Puede ser una plaza, un edificio, un fraccionamiento.",

  form: {
    nombreORazonSocial: "Nombre o razón social",
    nombrePlaceholder: "Administradora Plaza Norte S.A. de C.V.",
    personaDeContacto: "Persona de contacto",
    contactoPlaceholder: "Dana Whitfield",
    telefono: "Teléfono",
    correo: "Correo",
    notas: "Notas",
    notasPlaceholder: "Cómo facturan, con quién hay que hablar, horarios permitidos…",
    guardarCliente: "Guardar cliente",
  },

  formUbicacion: {
    nombreDeLaUbicacion: "Nombre de la ubicación",
    nombrePlaceholder: "Plaza Norte — estacionamiento",
    direccion: "Dirección",
    notasDeAcceso: "Notas de acceso",
    notasDeAccesoPlaceholder: "Código del portón, horario permitido, a quién buscar…",
    guardarUbicacion: "Guardar ubicación",
  },

  errorGuardarCliente: "No se pudo guardar el cliente. Revisa la conexión con la base de datos.",
};

type SliceDeClientes = typeof es;

const en: SliceDeClientes = {
  metaTituloLista: "Clients",
  cartera: "Portfolio",
  clientes: "Clients",
  todaviaNoHayNinguno: "There aren't any yet.",
  clientesActivos: (n) => `${n} active ${n === 1 ? "client" : "clients"}.`,
  nuevoCliente: "New client",
  carteraVacia: "The portfolio is empty",
  carteraVaciaCuerpo:
    "Add the first client. Afterward you can add their locations, and for each location the services they've contracted.",

  metaTituloNuevo: "New client",
  nuevoClienteAyuda:
    "Only the name is required. Everything else can be filled in later — it's common to add the company before knowing exactly who you'll be dealing with.",

  metaTituloDetalle: "Client",
  cliente: "Client",
  propiedades: "Properties",
  ubicaciones: "Locations",
  todaviaNoHayNinguna: "There aren't any yet.",
  ubicacionesActivas: (n) => `${n} active ${n === 1 ? "location" : "locations"}.`,
  nuevaUbicacion: "New location",
  sinUbicaciones: "No locations",
  sinUbicacionesCuerpo: "Add this client's properties so you can assign services to them.",

  metaTituloNuevaUbicacion: "New location",
  nuevaUbicacionAyuda: "A property where the service is performed. Could be a plaza, a building, a subdivision.",

  form: {
    nombreORazonSocial: "Name or business name",
    nombrePlaceholder: "Plaza Norte Management LLC",
    personaDeContacto: "Contact person",
    contactoPlaceholder: "Dana Whitfield",
    telefono: "Phone",
    correo: "Email",
    notas: "Notes",
    notasPlaceholder: "How they bill, who to talk to, allowed hours…",
    guardarCliente: "Save client",
  },

  formUbicacion: {
    nombreDeLaUbicacion: "Location name",
    nombrePlaceholder: "Plaza Norte — parking lot",
    direccion: "Address",
    notasDeAcceso: "Access notes",
    notasDeAccesoPlaceholder: "Gate code, allowed hours, who to ask for…",
    guardarUbicacion: "Save location",
  },

  errorGuardarCliente: "Couldn't save the client. Check the database connection.",
};

export const clientes = { es, en };
