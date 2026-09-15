/**
 * Los roles del sistema.
 *
 * Esta lista es la versión del dominio, no la de la base de datos. Prisma tiene
 * su propio enum y el repositorio traduce entre los dos: si mañana se cambia de
 * motor o de ORM, esto no se mueve.
 */
export const ROLES = ["ADMINISTRADOR", "OFICINA", "TECNICO"] as const;

export type Rol = (typeof ROLES)[number];

export function esRol(valor: unknown): valor is Rol {
  return typeof valor === "string" && (ROLES as readonly string[]).includes(valor);
}
