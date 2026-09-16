import { ErrorDeDominio } from "@/contextos/compartido/dominio/ErrorDeDominio";

export class NombreDeClienteInvalido extends ErrorDeDominio {
  constructor(motivo: string, codigo: string) {
    super(motivo, codigo);
  }
}

/**
 * Cómo se llama el cliente: razón social o nombre comercial.
 *
 * Se guarda tal cual lo escribe la oficina — mayúsculas y acentos incluidos,
 * porque es lo que va a salir impreso en una propuesta. Lo único que se
 * normaliza son los espacios: los de las orillas se quitan y los repetidos de
 * en medio se colapsan, para que "Plaza  Norte" y "Plaza Norte " no acaben
 * siendo dos clientes distintos en la lista.
 */
export class NombreDeCliente {
  static readonly LARGO_MAXIMO = 160;

  private constructor(readonly valor: string) {}

  static de(valor: string): NombreDeCliente {
    const normalizado = valor.trim().replace(/\s+/g, " ");

    if (!normalizado) {
      throw new NombreDeClienteInvalido("Escribe el nombre del cliente.", "nombre_cliente_vacio");
    }

    if (normalizado.length > NombreDeCliente.LARGO_MAXIMO) {
      throw new NombreDeClienteInvalido(
        `El nombre no puede pasar de ${NombreDeCliente.LARGO_MAXIMO} caracteres.`,
        "nombre_cliente_muy_largo",
      );
    }

    return new NombreDeCliente(normalizado);
  }

  /** Para comparar sin que las mayúsculas cuenten. */
  get clave(): string {
    return this.valor.toLocaleUpperCase("es");
  }

  toString(): string {
    return this.valor;
  }
}
