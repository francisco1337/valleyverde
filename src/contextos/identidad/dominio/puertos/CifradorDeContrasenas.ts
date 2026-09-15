import type { ContrasenaHasheada } from "@/contextos/identidad/dominio/ContrasenaHasheada";

/**
 * Puerto de salida: cómo se protegen y se verifican las contraseñas.
 *
 * El dominio dice qué necesita; qué algoritmo se usa (hoy bcrypt) es asunto de
 * la infraestructura.
 */
export interface CifradorDeContrasenas {
  hashear(enClaro: string): Promise<ContrasenaHasheada>;

  coincide(enClaro: string, hash: ContrasenaHasheada): Promise<boolean>;

  /**
   * Gasta el mismo tiempo que una comparación real, contra un hash que no es de
   * nadie. Se usa cuando el usuario no existe: sin esto, la respuesta llegaría
   * notablemente más rápido y el tiempo delataría qué cuentas son reales.
   */
  simularComparacion(enClaro: string): Promise<void>;
}
