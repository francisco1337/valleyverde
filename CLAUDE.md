@AGENTS.md

# Valley Verde

Dos aplicaciones en un repo, con un layout raíz y una tipografía compartidos:

- **Sitio público** (`/`, `/about`, `/contact`, `/services/[slug]`) — terminado. Reemplaza un
  WordPress con Elementor que sigue vivo y del que hay una copia en `sitioanterior/`.
- **App de operaciones** (`/app/*`) — en construcción. Es el trabajo activo.

El cliente es Aurelio Olivera, dueño de Valley Verde (jardinería comercial en North Phoenix,
Arizona). Lo que pidió no es una herramienta interna: quiere un CRM de campo **para vender a
otras compañías de oficios en EE.UU.** — jardinería, limpieza de casas, plomería, electricidad.
Valley Verde es el cliente cero. Ya tienen un CRM funcionando que quieren "optimizar"; nadie ha
dicho todavía cuál es.

Catálogo completo de procesos por rol: https://claude.ai/artifact/Jhya9FuEayS7tRum6uikET

## Stack

Next.js 16.3.5 · React 19.2.8 · Tailwind 4 · TypeScript strict · Prisma 7 sobre MySQL (Aiven,
vía `@prisma/adapter-mariadb`) · `jose` para sesiones · `bcryptjs` · GSAP en el sitio público.

## Cómo levantarlo

```bash
cp .env.example .env     # DATABASE_URL, DATABASE_SSL_CA, SESSION_SECRET
npm run db:migrate       # aplica migraciones
npm run db:seed          # crea una cuenta por rol
npm run dev
```

El seed crea `ADMINISTRADOR`, `OFICINA` y `TECNICO`, cada uno con la contraseña igual al
usuario. Son credenciales de arranque, no de producción.

Otros: `db:generate`, `db:push`, `db:studio`. `postinstall` corre `prisma generate`.

## Arquitectura

**El dominio se escribe en español.** Clases, métodos, variables, rutas y columnas. El inglés
queda para las APIs de terceros. El sitio público en cambio está en inglés porque su audiencia
son property managers de Arizona.

**Arquitectura hexagonal por contexto** en `src/contextos/<contexto>/`:

```
dominio/          agregados, objetos de valor, errores, puertos/
aplicacion/       casos de uso, uno por archivo
infraestructura/  adaptadores (Prisma, bcrypt, cookies) + dependencias.ts
```

El dominio no importa nada de Next ni de Prisma. Los adaptadores de entrada — server actions,
páginas, el seed — hablan con casos de uso, nunca con Prisma directo.

**CQRS-lite.** La pureza hexagonal se paga por archivo, así que se aplica solo donde hay
invariantes que proteger:

- **Escritura** (crear asignación, generar eventos, completar, congelar precio) → hexagonal completa.
- **Lectura** (listados, tableros, finanzas) → consulta Prisma directa desde el Server Component.
  Sin puerto ni repositorio. Las lecturas no tienen invariantes que proteger.

Referencia de cuánto cuesta lo primero: el contexto `identidad` son 22 archivos y ~870 líneas
para una entidad y cuatro casos de uso.

### Acceso y roles

Tres roles: `ADMINISTRADOR`, `OFICINA`, `TECNICO`. Cada uno aterriza en su propio panel
(`src/lib/paneles.ts` mapea rol → ruta).

Dos filtros, y el orden importa:

1. `src/proxy.ts` — solo lee la cookie, sin tocar la base. Corre en cada navegación, incluidas
   las precargas de Next. Su trabajo es no pintar una pantalla que va a rebotar de todos modos.
2. `src/lib/acceso.ts` — `requerirSesion()` y `requerirRol()`. **Esta es la que manda**: vuelve
   a preguntarle a la base. Toda página bajo `/app` la llama. Memorizada con `cache()` de React.

Nunca confíes en el proxy para autorizar. Es una optimización, no una garantía.

### Convenciones de datos

- **IDs**: UUID en `varchar(191)`, generados en el dominio (`repositorio.siguienteId()`), no por
  la base. Un agregado ya tiene identidad antes de tocar MySQL.
- Tablas en plural y snake_case (`usuarios`), columnas en camelCase (`passwordHash`).
- Nada se borra: todo lleva `activo` y las llaves foráneas van en `restrict`.

## Modelo del MVP

```
clientes ─1:N─ ubicaciones ─1:N─ asignaciones ─1:N─ eventos ─1:N─ evidencias
                                      │                 │
                        servicios ────┤                 │
                        usuarios ─────┘─────────────────┘
                         (TECNICO)
```

**La regla que gobierna todo: la asignación es el acuerdo vivo, el evento es el comprobante
histórico.** Al generarse, el evento **copia** precio, servicio, ubicación y técnico. Cambiar la
asignación mañana no puede reescribir lo que ya pasó.

- `asignaciones` — servicio + periodicidad (`DIARIO|SEMANAL|QUINCENAL|MENSUAL`) + precio por
  evento + técnico, entre `fechaInicio` y `fechaFin`. **`fechaFin` es obligatoria**: sin ella la
  serie es infinita.
- `eventos` — una fila por visita. Estados `PROGRAMADO|COMPLETADO|CANCELADO`. El índice único
  `(asignacionId, fechaProgramada)` hace idempotente la generación: correrla dos veces no duplica.
- Las finanzas son `SUM(precio)` de los eventos completados. **No hay facturas, pagos ni cuentas
  por cobrar** — eso es ingreso devengado, no cobrado.

## Trampas de este entorno

Difieren de lo que uno asume por defecto. Lee `node_modules/next/dist/docs/` antes de escribir.

- **`src/proxy.ts`, no `middleware.ts`.** Next 16 lo renombró y ahora corre en runtime Node por
  defecto. La función exportada se llama `proxy`.
- **Prisma 7 no lee la URL de `schema.prisma`.** Vive en `prisma7.config.ts`, y el CLI ya no carga
  `.env` solo — de ahí el `import "dotenv/config"`.
- **Phoenix es MST y no cambia a horario de verano.** Las fechas de servicio van como `DATE` puro,
  nunca `DATETIME` en UTC, o los eventos se ven corridos un día.
- **Dinero en `decimal(10,2)`, nunca `float`.**
- **`next.config.ts` tiene un allowlist de `qualities`.** Un `quality={82}` que no esté en la lista
  se sirve silenciosamente a 75.
- El sitio público y `/app` comparten layout raíz pero no chrome: `SiteShell` decide por pathname.
  Si `/app` crece, conviene partir en route groups `(sitio)` y `(ops)`.

## Decisiones abiertas

- **Dónde se guardan las evidencias fotográficas.** La base es Aiven, pero lo que decide si sirve
  el disco es dónde corre la app. Sin disco persistente hace falta almacenamiento externo.
- **Multi-empresa.** Aurelio quiere vender esto a otras compañías. Hoy no hay `empresaId` en
  ninguna tabla. Agregarlo ahora son seis columnas y media hora; con datos reales encima es una
  migración fea.
- **Cuentas por cobrar.** Aurelio mencionó "quién te debe" tres veces. Sale con una columna
  `pagado` en `eventos`.
- **Idioma de la app de campo.** Las cuadrillas de landscaping en Phoenix son mayoritariamente
  hispanohablantes; el dominio ya está en español, pero la interfaz no se ha decidido.
