import { ErrorDeDominio } from "@/contextos/compartido/dominio/ErrorDeDominio";

export class IdUsuarioInvalido extends ErrorDeDominio {
  constructor() {
    super("El identificador de usuario no puede ir vacío.");
  }
}

/** La identidad del agregado Usuario. */
export class IdUsuario {
  private constructor(readonly valor: string) {}

  static de(valor: string): IdUsuario {
    const limpio = valor.trim();
    if (!limpio) throw new IdUsuarioInvalido();
    return new IdUsuario(limpio);
  }

  esIgualA(otro: IdUsuario): boolean {
    return this.valor === otro.valor;
  }

  toString(): string {
    return this.valor;
  }
}
