import { compare, hash } from "bcryptjs";

import { ContrasenaHasheada } from "@/contextos/identidad/dominio/ContrasenaHasheada";
import type { CifradorDeContrasenas } from "@/contextos/identidad/dominio/puertos/CifradorDeContrasenas";

/**
 * Hash de una contraseña que no es de nadie. Sirve para gastar el mismo tiempo
 * de CPU cuando el usuario no existe.
 */
const HASH_SENUELO = "$2b$10$CwTycUXWue0Thq9StjUM0uJ8.Bz4QeDxDIMGkGH8HGD3Ot1FNXaFq";

/** Adaptador de salida: bcrypt. */
export class BcryptCifradorDeContrasenas implements CifradorDeContrasenas {
  /**
   * Cuántas veces se repite el cálculo. Subirlo hace el login más lento para
   * todos y la fuerza bruta más lenta para quien la intenta; 10 es el punto
   * habitual hoy.
   */
  constructor(private readonly rondas = 10) {}

  async hashear(enClaro: string): Promise<ContrasenaHasheada> {
    return ContrasenaHasheada.de(await hash(enClaro, this.rondas));
  }

  async coincide(enClaro: string, hasheada: ContrasenaHasheada): Promise<boolean> {
    return compare(enClaro, hasheada.valor);
  }

  async simularComparacion(enClaro: string): Promise<void> {
    await compare(enClaro, HASH_SENUELO);
  }
}
