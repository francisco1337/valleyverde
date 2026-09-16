/**
 * Un error que el dominio sabe nombrar: una regla de negocio que no se cumplió,
 * no una falla técnica. La diferencia importa en los adaptadores — esto se le
 * muestra a la persona, un fallo de red no.
 */
export abstract class ErrorDeDominio extends Error {
  /**
   * Identificador estable e independiente del idioma — el mensaje en `.message`
   * siempre es español (lo que ve un log), pero la capa de UI traduce por este
   * código, no por el texto. Por default es el nombre de la clase; las clases
   * con más de un mensaje posible (p.ej. "vacío" vs "muy largo") lo pasan
   * explícito en cada sitio donde se lanzan.
   */
  constructor(mensaje: string, readonly codigo: string = new.target.name) {
    super(mensaje);
    this.name = new.target.name;
  }
}

export function esErrorDeDominio(error: unknown): error is ErrorDeDominio {
  return error instanceof ErrorDeDominio;
}
