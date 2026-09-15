import { readFileSync } from "node:fs";

import { PrismaMariaDb } from "@prisma/adapter-mariadb";

import { PrismaClient } from "@/generated/prisma/client";

/**
 * Detalle de infraestructura: la conexión a MySQL (Aiven).
 *
 * Prisma 7 ya no trae motor de consultas propio, se conecta a través de un
 * "driver adapter". Para MySQL ese adaptador es @prisma/adapter-mariadb, que
 * por dentro usa el driver `mariadb`.
 */

/** El CA de Aiven, si está a la mano. Acepta el PEM completo o una ruta a él. */
function leerCertificadoCa(): string | undefined {
  const valor = process.env.DATABASE_SSL_CA?.trim();
  if (!valor) return undefined;

  // Un PEM pegado directo en el .env trae los saltos de línea escapados.
  if (valor.includes("BEGIN CERTIFICATE")) return valor.replace(/\\n/g, "\n");

  try {
    return readFileSync(valor, "utf8");
  } catch {
    throw new Error(
      `No se pudo leer el certificado CA en "${valor}". Revisa DATABASE_SSL_CA en tu .env.`,
    );
  }
}

let avisoTlsMostrado = false;

function crearAdaptador() {
  const cadena = process.env.DATABASE_URL?.trim();

  if (!cadena) {
    throw new Error(
      "Falta DATABASE_URL. Pega la cadena de conexión de Aiven en el archivo .env.",
    );
  }

  let url: URL;
  try {
    url = new URL(cadena);
  } catch {
    throw new Error(
      "DATABASE_URL no es una URL válida. Debe verse como " +
        "mysql://usuario:password@host:puerto/base",
    );
  }

  const esLocal = ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
  const ca = leerCertificadoCa();

  if (!esLocal && !ca && !avisoTlsMostrado) {
    avisoTlsMostrado = true;
    console.warn(
      "[db] Conectando con TLS pero SIN verificar el certificado del servidor. " +
        "Descarga el ca.pem de Aiven y ponlo en DATABASE_SSL_CA para verificarlo.",
    );
  }

  // Se arma la configuración a mano en vez de pasarle la cadena al driver:
  // Aiven agrega "?ssl-mode=REQUIRED" al final, que el driver `mariadb` no
  // entiende, y así además decidimos nosotros cómo se valida el TLS.
  return new PrismaMariaDb({
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: decodeURIComponent(url.pathname.replace(/^\//, "")),
    // Aiven da pocas conexiones en los planes chicos y Next levanta varios
    // procesos en desarrollo; mejor un pool corto.
    connectionLimit: 5,
    ssl: esLocal ? undefined : ca ? { ca } : { rejectUnauthorized: false },
  });
}

/**
 * En desarrollo Next recarga los módulos en cada cambio. Sin este caché en
 * `globalThis`, cada recarga abriría un pool nuevo hasta tumbar la base.
 */
const global_ = globalThis as typeof globalThis & { prismaVV?: PrismaClient };

let cliente: PrismaClient | undefined = global_.prismaVV;

/**
 * Se construye la primera vez que alguien consulta, no al importar el módulo:
 * así `next build` no truena en una máquina que todavía no tiene DATABASE_URL.
 */
export function clientePrisma(): PrismaClient {
  if (!cliente) {
    cliente = new PrismaClient({ adapter: crearAdaptador() });
    if (process.env.NODE_ENV !== "production") global_.prismaVV = cliente;
  }
  return cliente;
}
