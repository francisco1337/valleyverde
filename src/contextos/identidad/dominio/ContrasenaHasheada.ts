import { ErrorDeDominio } from "@/contextos/compartido/dominio/ErrorDeDominio";

export class ContrasenaHasheadaInvalida extends ErrorDeDominio {
  constructor() {
    super("El hash de la contraseña no puede ir vacío.");
  }
}

/**
 * El hash de una contraseña, nunca la contraseña.
 *
 * Tenerlo como tipo propio hace que un `string` suelto no pueda colarse donde
 * se espera un hash, y deja obvio en cualquier firma qué está viajando.
 */
export class ContrasenaHasheada {
  private constructor(readonly valor: string) {}

  static de(valor: string): ContrasenaHasheada {
    if (!valor.trim()) throw new ContrasenaHasheadaInvalida();
    return new ContrasenaHasheada(valor);
  }

  /** Que nunca se filtre a un log o a una respuesta por accidente. */
  toJSON(): string {
    return "[contraseña]";
  }
}
