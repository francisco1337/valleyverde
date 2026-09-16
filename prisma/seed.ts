import "dotenv/config";

import { AsegurarUsuario } from "../src/contextos/identidad/aplicacion/AsegurarUsuario";
import type { Rol } from "../src/contextos/identidad/dominio/Rol";
import { clientePrisma } from "../src/contextos/compartido/infraestructura/persistencia/ClientePrisma";
import { PrismaRepositorioDeUsuarios } from "../src/contextos/identidad/infraestructura/persistencia/PrismaRepositorioDeUsuarios";
import { BcryptCifradorDeContrasenas } from "../src/contextos/identidad/infraestructura/seguridad/BcryptCifradorDeContrasenas";
import { randomUUID } from "crypto";

const CUENTAS: { usuario: string; nombre: string; rol: Rol }[] = [
  { usuario: "ADMINISTRADOR", nombre: "Administrador", rol: "ADMINISTRADOR" },
  { usuario: "OFICINA", nombre: "Oficina", rol: "OFICINA" },
  { usuario: "TECNICO", nombre: "Técnico Demo", rol: "TECNICO" },
];

const SERVICIOS = [
  { nombre: "Poda de césped", descripcion: "Corte y emparejado de área verde.", precioSugerido: 120.0 },
  { nombre: "Riego", descripcion: "Revisión y operación del sistema de riego.", precioSugerido: 80.0 },
  { nombre: "Poda de arbustos", descripcion: "Recorte y formado de arbustos.", precioSugerido: 150.0 },
  { nombre: "Limpieza general", descripcion: "Retiro de hojas, ramas caídas y basura del área verde.", precioSugerido: 90.0 },
  { nombre: "Fertilización", descripcion: "Aplicación de fertilizante al césped o árboles.", precioSugerido: 110.0 },
  { nombre: "Control de plagas", descripcion: "Aplicación de insecticida/herbicida preventivo.", precioSugerido: 140.0 },
];

async function main() {
  const prisma = clientePrisma();

  // --- Usuarios ---
  const asegurarUsuario = new AsegurarUsuario(
    new PrismaRepositorioDeUsuarios(),
    new BcryptCifradorDeContrasenas(),
  );

  console.log("\nUsuarios:");
  for (const cuenta of CUENTAS) {
    const { creado } = await asegurarUsuario.ejecutar({
      ...cuenta,
      contrasenaInicial: cuenta.usuario,
    });
    console.log(`  ${creado ? "creado    " : "ya existía"}  ${cuenta.usuario}`);
  }

  // --- Servicios ---
  console.log("\nServicios:");
  for (const svc of SERVICIOS) {
    const existe = await prisma.servicio.findUnique({ where: { nombre: svc.nombre } });
    if (existe) {
      console.log(`  ya existía  ${svc.nombre}`);
      continue;
    }
    await prisma.servicio.create({
      data: {
        id: randomUUID(),
        nombre: svc.nombre,
        descripcion: svc.descripcion,
        precioSugerido: svc.precioSugerido,
      },
    });
    console.log(`  creado      ${svc.nombre}`);
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
