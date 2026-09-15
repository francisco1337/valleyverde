import { ErrorDeDominio } from "@/contextos/compartido/dominio/ErrorDeDominio";

/**
 * Un único error para "no existe", "está dado de baja" y "la contraseña no es
 * esa". Distinguirlos ayudaría a quien intenta adivinar cuentas ajenas, así que
 * el dominio se niega a distinguirlos.
 */
export class CredencialesInvalidas extends ErrorDeDominio {
  constructor() {
    super("Usuario o contraseña incorrectos.");
  }
}
