import "dotenv/config";

import { AsegurarUsuario } from "../src/contextos/identidad/aplicacion/AsegurarUsuario";
import type { Rol } from "../src/contextos/identidad/dominio/Rol";
import { clientePrisma } from "../src/contextos/identidad/infraestructura/persistencia/ClientePrisma";
import { PrismaRepositorioDeUsuarios } from "../src/contextos/identidad/infraestructura/persistencia/PrismaRepositorioDeUsuarios";
import { BcryptCifradorDeContrasenas } from "../src/contextos/identidad/infraestructura/seguridad/BcryptCifradorDeContrasenas";

/**
 * Seed: otro adaptador de entrada.
 *
 * No habla con Prisma, habla con un caso de uso — igual que el formulario de
 * login. Por eso arma sus propias dependencias (no necesita cookies) y no
 * conoce ni una columna de la tabla.
 */

/**
 * Cuentas iniciales, una por rol. La contraseña es igual al usuario a propósito,
 * para poder entrar el primer día: son credenciales de arranque, no de
 * producción. Cámbialas antes de que esto salga a la calle.
 */
const CUENTAS: { usuario: string; nombre: string; rol: Rol }[] = [
  { usuario: "ADMINISTRADOR", nombre: "Administrador", rol: "ADMINISTRADOR" },
  { usuario: "OFICINA", nombre: "Oficina", rol: "OFICINA" },
  { usuario: "TECNICO", nombre: "Técnico", rol: "TECNICO" },
];

async function main() {
  const asegurarUsuario = new AsegurarUsuario(
    new PrismaRepositorioDeUsuarios(),
    new BcryptCifradorDeContrasenas(),
  );

  for (const cuenta of CUENTAS) {
    const { creado } = await asegurarUsuario.ejecutar({
      ...cuenta,
      contrasenaInicial: cuenta.usuario,
    });

    console.log(`  ${creado ? "creado    " : "ya existía"}  ${cuenta.usuario}`);
  }
}

main()
  .then(() => {
    console.log("\nListo. Entra en /app/login con ADMINISTRADOR / ADMINISTRADOR.");
  })
  .catch((error) => {
    console.error("\nFalló el seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await clientePrisma().$disconnect();
  });
