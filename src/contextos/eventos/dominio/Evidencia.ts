import { randomUUID } from "crypto";
import { ErrorDeDominio } from "@/contextos/compartido/dominio/ErrorDeDominio";

export class ImagenInvalida extends ErrorDeDominio {
  constructor() {
    super("La foto debe ser una imagen válida.");
  }
}

export class DemasiadasEvidencias extends ErrorDeDominio {
  constructor() {
    super("Un trabajo admite máximo 5 fotos de evidencia.");
  }
}

const DATA_URL_IMAGEN_RE = /^data:image\/(jpeg|jpg|png|webp);base64,/;
const MAXIMO_POR_EVENTO = 5;

export class Evidencia {
  private constructor(
    readonly id: string,
    readonly eventoId: string,
    readonly imagen: string,
  ) {}

  static registrarVarias(eventoId: string, imagenes: string[]): Evidencia[] {
    if (imagenes.length > MAXIMO_POR_EVENTO) throw new DemasiadasEvidencias();

    return imagenes.map((imagen) => {
      if (!DATA_URL_IMAGEN_RE.test(imagen)) throw new ImagenInvalida();
      return new Evidencia(randomUUID(), eventoId, imagen);
    });
  }
}
