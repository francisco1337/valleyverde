import { ErrorDeDominio } from "@/contextos/compartido/dominio/ErrorDeDominio";

/**
 * Dos clientes con el mismo nombre son un error de captura casi siempre, y
 * cuando no lo son, la oficina necesita poder distinguirlos igual. Se bloquea
 * el alta en vez de dejar una lista con dos renglones idénticos.
 */
export class NombreDeClienteRepetido extends ErrorDeDominio {
  constructor(readonly nombre: string) {
    super(`Ya existe un cliente llamado "${nombre}".`);
  }
}
