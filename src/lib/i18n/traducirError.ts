import { ErrorDeDominio } from "@/contextos/compartido/dominio/ErrorDeDominio";
import { NombreDeClienteRepetido } from "@/contextos/clientes/dominio/errores/NombreDeClienteRepetido";
import type { Diccionario } from "@/lib/i18n";

/**
 * Traduce un error de dominio al idioma activo, por `codigo` (no por el texto
 * de `.message`, que siempre es español — ver ErrorDeDominio). El único error
 * parametrizado hoy es NombreDeClienteRepetido; si se agrega otro con datos
 * propios, se especializa aquí igual.
 */
export function traducirError(error: unknown, t: Diccionario): string {
  if (error instanceof NombreDeClienteRepetido) {
    return t.errores.NombreDeClienteRepetido(error.nombre);
  }

  if (error instanceof ErrorDeDominio) {
    const entrada = (t.errores as Record<string, unknown>)[error.codigo];
    return typeof entrada === "string" ? entrada : t.errores.generico;
  }

  return t.errores.generico;
}
