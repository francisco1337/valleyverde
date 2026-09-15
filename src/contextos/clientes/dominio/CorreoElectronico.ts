import { ErrorDeDominio } from "@/contextos/compartido/dominio/ErrorDeDominio";

export class CorreoElectronicoInvalido extends ErrorDeDominio {
  constructor() {
    super("Ese correo no tiene una forma válida.");
  }
}

/**
 * Un correo de contacto.
 *
 * La validación es a propósito laxa: algo, arroba, algo con punto. Las
 * expresiones regulares que persiguen el RFC 5322 rechazan direcciones
 * perfectamente reales y no atrapan las que están mal escritas por dentro.
 * Lo único que de verdad comprueba si un correo existe es mandarle un mensaje.
 */
export class CorreoElectronico {
  static readonly LARGO_MAXIMO = 160;

  private static readonly FORMA = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(readonly valor: string) {}

  static de(valor: string): CorreoElectronico {
    const normalizado = valor.trim().toLowerCase();

    if (
      !CorreoElectronico.FORMA.test(normalizado) ||
      normalizado.length > CorreoElectronico.LARGO_MAXIMO
    ) {
      throw new CorreoElectronicoInvalido();
    }

    return new CorreoElectronico(normalizado);
  }

  /** Para campos opcionales: vacío es ausencia, no error. */
  static opcional(valor: string | null | undefined): CorreoElectronico | null {
    const limpio = (valor ?? "").trim();
    return limpio ? CorreoElectronico.de(limpio) : null;
  }

  toString(): string {
    return this.valor;
  }
}
