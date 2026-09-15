import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Configuración del CLI de Prisma 7.
 *
 * Dos cosas cambiaron respecto a versiones anteriores y conviene tenerlas
 * presentes:
 *  - La URL de la base ya no vive en schema.prisma, vive aquí.
 *  - El CLI ya no lee .env solo; por eso el `import "dotenv/config"` de arriba.
 *    (La app de Next sí carga .env por su cuenta, esto es sólo para el CLI.)
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
