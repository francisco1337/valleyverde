import { CorreoElectronico } from "@/contextos/clientes/dominio/CorreoElectronico";
import { IdCliente } from "@/contextos/clientes/dominio/IdCliente";
import { NombreDeCliente } from "@/contextos/clientes/dominio/NombreDeCliente";

type PropiedadesCliente = {
  id: IdCliente;
  nombre: NombreDeCliente;
  contacto: string | null;
  telefono: string | null;
  correo: CorreoElectronico | null;
  notas: string | null;
  activo: boolean;
};

/** Texto libre opcional: vacío es ausencia, no cadena vacía. */
function textoOpcional(valor: string | null | undefined, largoMaximo: number): string | null {
  const limpio = (valor ?? "").trim();
  if (!limpio) return null;
  return limpio.length > largoMaximo ? limpio.slice(0, largoMaximo) : limpio;
}

/**
 * El agregado de la cartera.
 *
 * A quién se le presta servicio. Las ubicaciones NO cuelgan de aquí: un cliente
 * grande puede tener decenas y cargarlas todas para mostrar un nombre en una
 * lista sería absurdo. Se relacionan por IdCliente, cada una con su propio
 * repositorio.
 */
export class Cliente {
  static readonly LARGO_CONTACTO = 160;
  static readonly LARGO_TELEFONO = 40;
  static readonly LARGO_NOTAS = 2000;

  private constructor(private readonly props: PropiedadesCliente) {}

  /** Alta de un cliente nuevo. Nace activo. */
  static registrar(props: {
    id: string;
    nombre: string;
    contacto?: string | null;
    telefono?: string | null;
    correo?: string | null;
    notas?: string | null;
  }): Cliente {
    return new Cliente({
      id: IdCliente.de(props.id),
      nombre: NombreDeCliente.de(props.nombre),
      contacto: textoOpcional(props.contacto, Cliente.LARGO_CONTACTO),
      telefono: textoOpcional(props.telefono, Cliente.LARGO_TELEFONO),
      correo: CorreoElectronico.opcional(props.correo),
      notas: textoOpcional(props.notas, Cliente.LARGO_NOTAS),
      activo: true,
    });
  }

  /** Reconstruye el agregado desde almacenamiento. Sólo lo usa el repositorio. */
  static rehidratar(props: {
    id: string;
    nombre: string;
    contacto: string | null;
    telefono: string | null;
    correo: string | null;
    notas: string | null;
    activo: boolean;
  }): Cliente {
    return new Cliente({
      id: IdCliente.de(props.id),
      nombre: NombreDeCliente.de(props.nombre),
      contacto: props.contacto,
      telefono: props.telefono,
      correo: props.correo ? CorreoElectronico.de(props.correo) : null,
      notas: props.notas,
      activo: props.activo,
    });
  }

  get id(): IdCliente {
    return this.props.id;
  }

  get nombre(): NombreDeCliente {
    return this.props.nombre;
  }

  get contacto(): string | null {
    return this.props.contacto;
  }

  get telefono(): string | null {
    return this.props.telefono;
  }

  get correo(): CorreoElectronico | null {
    return this.props.correo;
  }

  get notas(): string | null {
    return this.props.notas;
  }

  get activo(): boolean {
    return this.props.activo;
  }
}
