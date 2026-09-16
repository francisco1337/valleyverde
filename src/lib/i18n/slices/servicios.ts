const es = {
  metaTituloLista: "Catálogo de servicios",
  administrador: "Administrador",
  catalogoDeServicios: "Catálogo de servicios",
  todaviaNoHayNinguno: "Todavía no hay ninguno.",
  serviciosRegistrados: (n: number) => `${n} ${n === 1 ? "servicio registrado" : "servicios registrados"}.`,
  nuevoServicio: "Nuevo servicio",
  catalogoVacio: "El catálogo está vacío",
  catalogoVacioCuerpo:
    "Da de alta los servicios que ofrece la empresa. Después podrás asignarlos a las ubicaciones de los clientes.",
  inactivo: "Inactivo",

  metaTituloNuevo: "Nuevo servicio",
  nuevoServicioAyuda:
    "El nombre es obligatorio y debe ser único. El precio sugerido es referencia al crear asignaciones; cada contrato puede tener el suyo.",

  form: {
    nombreDelServicio: "Nombre del servicio",
    nombrePlaceholder: "Poda de césped",
    descripcion: "Descripción",
    descripcionPlaceholder: "Corte y nivelación de pasto, bordes y recolección de recortes.",
    precioSugerido: "Precio sugerido por visita ($)",
    precioSugeridoAyuda: "Referencia al crear asignaciones. Se puede cambiar por contrato.",
    guardarServicio: "Guardar servicio",
  },

  errores: {
    nombreObligatorio: "El nombre del servicio es obligatorio.",
    precioInvalido: "El precio sugerido debe ser un número positivo.",
    nombreDuplicado: (nombre: string) => `Ya existe un servicio llamado "${nombre}".`,
    errorGuardar: "No se pudo guardar el servicio. Revisa la conexión con la base de datos.",
  },
};

type SliceDeServicios = typeof es;

const en: SliceDeServicios = {
  metaTituloLista: "Service catalog",
  administrador: "Admin",
  catalogoDeServicios: "Service catalog",
  todaviaNoHayNinguno: "There aren't any yet.",
  serviciosRegistrados: (n) => `${n} ${n === 1 ? "service" : "services"} registered.`,
  nuevoServicio: "New service",
  catalogoVacio: "The catalog is empty",
  catalogoVacioCuerpo:
    "Add the services the company offers. You'll be able to assign them to clients' locations afterward.",
  inactivo: "Inactive",

  metaTituloNuevo: "New service",
  nuevoServicioAyuda:
    "The name is required and must be unique. The suggested price is a reference when creating assignments; each contract can have its own.",

  form: {
    nombreDelServicio: "Service name",
    nombrePlaceholder: "Lawn mowing",
    descripcion: "Description",
    descripcionPlaceholder: "Mowing and edging the lawn, plus clipping cleanup.",
    precioSugerido: "Suggested price per visit ($)",
    precioSugeridoAyuda: "A reference when creating assignments. Can be changed per contract.",
    guardarServicio: "Save service",
  },

  errores: {
    nombreObligatorio: "The service name is required.",
    precioInvalido: "The suggested price must be a positive number.",
    nombreDuplicado: (nombre) => `A service named "${nombre}" already exists.`,
    errorGuardar: "Couldn't save the service. Check the database connection.",
  },
};

export const servicios = { es, en };
