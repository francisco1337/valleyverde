import type { Diccionario } from "@/lib/i18n";

/**
 * Los Client Components no pueden recibir funciones en props — React las
 * rechaza al cruzar el límite servidor/cliente ("Functions cannot be passed
 * directly to Client Components"). Varias entradas del diccionario son
 * funciones (pluralización, interpolación), así que un Client Component nunca
 * recibe el `Diccionario` completo: recibe esto, que le quita las funciones a
 * nivel de tipo. Si un componente necesita un valor interpolado, ese valor se
 * calcula en el Server Component y se pasa aparte, ya resuelto a string.
 */
type SinFunciones<T> = T extends (...args: never[]) => unknown
  ? never
  : T extends readonly (infer U)[]
    ? SinFunciones<U>[]
    : T extends object
      ? { [K in keyof T as T[K] extends (...args: never[]) => unknown ? never : K]: SinFunciones<T[K]> }
      : T;

export type DiccionarioCliente = SinFunciones<Diccionario>;

export function paraCliente(t: Diccionario): DiccionarioCliente {
  return JSON.parse(
    JSON.stringify(t, (_clave, valor) => (typeof valor === "function" ? undefined : valor)),
  );
}
