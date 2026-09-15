/**
 * Un error que el dominio sabe nombrar: una regla de negocio que no se cumplió,
 * no una falla técnica. La diferencia importa en los adaptadores — esto se le
 * muestra a la persona, un fallo de red no.
 */
export abstract class ErrorDeDominio extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = new.target.name;
  }
}

export function esErrorDeDominio(error: unknown): error is ErrorDeDominio {
  return error instanceof ErrorDeDominio;
}
