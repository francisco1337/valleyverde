import { ErrorDeDominio } from "@/contextos/compartido/dominio/ErrorDeDominio";

export class IdClienteInvalido extends ErrorDeDominio {
  constructor() {
    super("El identificador de cliente no puede ir vacío.");
  }
}

/** La identidad del agregado Cliente. */
export class IdCliente {
  private constructor(readonly valor: string) {}

  static de(valor: string): IdCliente {
    const limpio = valor.trim();
    if (!limpio) throw new IdClienteInvalido();
    return new IdCliente(limpio);
  }

  esIgualA(otro: IdCliente): boolean {
    return this.valor === otro.valor;
  }

  toString(): string {
    return this.valor;
  }
}
