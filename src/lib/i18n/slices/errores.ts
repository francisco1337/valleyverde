const es = {
  PrecioInvalido: "El precio debe ser mayor que cero.",
  FechasInvalidas: "La fecha de fin debe ser posterior a la fecha de inicio.",
  usuario_vacio: "Escribe tu usuario.",
  usuario_muy_largo: "El usuario no puede pasar de 60 caracteres.",
  IdUsuarioInvalido: "El identificador de usuario no puede ir vacío.",
  ContrasenaHasheadaInvalida: "El hash de la contraseña no puede ir vacío.",
  CredencialesInvalidas: "Usuario o contraseña incorrectos.",
  HoraInvalida: "La hora debe tener el formato HH:MM (ej. 08:30).",
  FechaProgramadaInvalida: "La fecha programada no es válida.",
  ImagenInvalida: "La foto debe ser una imagen válida.",
  DemasiadasEvidencias: "Un trabajo admite máximo 5 fotos de evidencia.",
  CorreoElectronicoInvalido: "Ese correo no tiene una forma válida.",
  IdClienteInvalido: "El identificador de cliente no puede ir vacío.",
  nombre_cliente_vacio: "Escribe el nombre del cliente.",
  nombre_cliente_muy_largo: "El nombre no puede pasar de 160 caracteres.",
  DireccionInvalida: "La dirección no puede estar vacía.",
  NombreDeUbicacionInvalido: "El nombre de la ubicación no puede estar vacío.",
  NombreDeClienteRepetido: (nombre: string) => `Ya existe un cliente llamado "${nombre}".`,
  generico: "No se pudo completar la operación. Intenta de nuevo.",
};

type SliceDeErrores = typeof es;

const en: SliceDeErrores = {
  PrecioInvalido: "The price must be greater than zero.",
  FechasInvalidas: "The end date must be after the start date.",
  usuario_vacio: "Enter your username.",
  usuario_muy_largo: "The username can't be longer than 60 characters.",
  IdUsuarioInvalido: "The user identifier can't be empty.",
  ContrasenaHasheadaInvalida: "The password hash can't be empty.",
  CredencialesInvalidas: "Incorrect username or password.",
  HoraInvalida: "The time must be in HH:MM format (e.g. 08:30).",
  FechaProgramadaInvalida: "The scheduled date isn't valid.",
  ImagenInvalida: "The photo must be a valid image.",
  DemasiadasEvidencias: "A job allows a maximum of 5 evidence photos.",
  CorreoElectronicoInvalido: "That email doesn't look valid.",
  IdClienteInvalido: "The client identifier can't be empty.",
  nombre_cliente_vacio: "Enter the client's name.",
  nombre_cliente_muy_largo: "The name can't be longer than 160 characters.",
  DireccionInvalida: "The address can't be empty.",
  NombreDeUbicacionInvalido: "The location name can't be empty.",
  NombreDeClienteRepetido: (nombre) => `A client named "${nombre}" already exists.`,
  generico: "Couldn't complete the operation. Please try again.",
};

export const errores = { es, en };
