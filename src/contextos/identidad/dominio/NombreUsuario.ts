import { ErrorDeDominio } from "@/contextos/compartido/dominio/ErrorDeDominio";

export class NombreUsuarioInvalido extends ErrorDeDominio {
  constructor(motivo: string, codigo: string) {
    super(motivo, codigo);
  }
}

/**
 * Con lo que alguien se identifica al entrar.
 *
 * La regla vive aquí y en ningún otro lado: se guarda y se compara siempre en
 * MAYÚSCULAS y sin espacios sobrantes, para que " tecnico " y "TECNICO" sean la
 * misma cuenta. Como el login y el repositorio pasan los dos por este tipo, es
 * imposible que uno normalice y el otro no.
 */
export class NombreUsuario {
  static readonly LARGO_MAXIMO = 60;

  private constructor(readonly valor: string) {}

  static de(valor: string): NombreUsuario {
    const normalizado = valor.trim().toUpperCase();

    if (!normalizado) {
      throw new NombreUsuarioInvalido("Escribe tu usuario.", "usuario_vacio");
    }

    if (normalizado.length > NombreUsuario.LARGO_MAXIMO) {
      throw new NombreUsuarioInvalido(
        `El usuario no puede pasar de ${NombreUsuario.LARGO_MAXIMO} caracteres.`,
        "usuario_muy_largo",
      );
    }

    return new NombreUsuario(normalizado);
  }

  esIgualA(otro: NombreUsuario): boolean {
    return this.valor === otro.valor;
  }

  toString(): string {
    return this.valor;
  }
}
