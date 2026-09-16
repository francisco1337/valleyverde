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
npm run db:seed          # crea una cuenta por rol + servicios de landscaping
npm run dev
```

El seed crea `ADMINISTRADOR`, `OFICINA` y `TECNICO` (contraseña = usuario) y los 6 servicios
de landscaping: Poda de césped, Riego, Poda de arbustos, Limpieza general, Fertilización,
Control de plagas.

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

- **Escritura** (crear asignación, programar evento, completar visita) → hexagonal completa.
- **Lectura** (listados, tableros, finanzas) → consulta Prisma directa desde el Server Component.
  Sin puerto ni repositorio. Las lecturas no tienen invariantes que proteger.

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

- **IDs**: UUID en `varchar(191)`, generados en el dominio (`randomUUID()`), no por la base.
- Tablas en plural y snake_case (`usuarios`), columnas en camelCase (`passwordHash`).
- Nada se borra: todo lleva `activo` y las llaves foráneas van en `restrict`.
- `decimal(10,2)` para dinero. Nunca `float`.
- `DATE` puro para fechas de servicio. Phoenix es MST, no cambia a horario de verano.
- `hora VARCHAR(5)` en eventos para la hora ("08:30"). Más simple en forms que TIME.
- Duplicados por nombre: detección case-insensitive vía utf8mb4_unicode_ci, sin LOWER()
  (LOWER() mata el índice).

## Modelo del MVP

```
clientes ─1:N─ ubicaciones ─1:N─ asignaciones ─1:N─ eventos ─1:N─ evidencias
                                      │                 │
                        servicios ────┘                 │
                        usuarios (TECNICO) ─────────────┘
```

**Regla fundamental: la asignación es el acuerdo vivo, el evento es el comprobante
histórico.** El técnico se asigna al **evento**, no a la asignación — el contrato dice
"servicio X en ubicación Y, cada semana, a $Z"; el evento dice "quién lo hizo, cuándo y
a qué hora".

- `asignaciones` — servicio + periodicidad (`DIARIO|SEMANAL|QUINCENAL|MENSUAL`) + precio por
  evento, entre `fechaInicio` y `fechaFin`. **Sin `tecnicoId`** — el técnico se asigna al programar.
- `eventos` — una fila por visita. `hora VARCHAR(5)` (p.ej. "08:30"). `tecnicoId` nullable
  (puede quedar sin asignar). El índice único `(asignacionId, fechaProgramada, hora)` hace
  idempotente la generación.
- Las finanzas son `SUM(precio)` de los eventos completados.

## Estado de módulos

| Módulo | Ruta | Estado |
|--------|------|--------|
| Login | `/app/login` | ✅ Terminado |
| Panel OFICINA | `/app/oficina` | ✅ Terminado |
| **Clientes** | `/app/oficina/clientes` | ✅ Terminado |
| **Detalle de cliente + ubicaciones** | `/app/oficina/clientes/[clienteId]` | ✅ Terminado |
| **Nueva ubicación** | `/app/oficina/clientes/[clienteId]/ubicaciones/nueva` | ✅ Terminado |
| **Asignaciones** | `/app/oficina/asignaciones` | ✅ Terminado |
| **Nueva asignación** | `/app/oficina/asignaciones/nueva` | ✅ Terminado |
| **Programar** | `/app/oficina/programar` | ✅ Terminado |
| Ruta del técnico | `/app/tecnico/ruta` | ⬜ Pendiente |
| Marcar completado | — | ⬜ Pendiente |
| Cobranza / finanzas | — | ⬜ Pendiente |
| Catálogo de servicios (admin) | `/app/administrador/servicios` | ⬜ Pendiente (seed cubre el demo) |

## Contextos implementados

```
src/contextos/
  compartido/
    dominio/
      ErrorDeDominio.ts       ← base para todos los errores de dominio
    infraestructura/
      persistencia/
        ClientePrisma.ts      ← singleton Prisma, compartido por todos los contextos
  identidad/                  ← usuarios, login, sesiones
  clientes/                   ← clientes + ubicaciones (mismo contexto: ubicación pertenece a cliente)
  asignaciones/               ← contratos recurrentes
  eventos/                    ← visitas programadas
```

### Patrón de un contexto (ejemplo: clientes)

```
src/contextos/clientes/
  dominio/
    Cliente.ts                ← agregado; static registrar() / rehidratar()
    Ubicacion.ts              ← agregado; static registrar()
    NombreDeCliente.ts        ← value object con normalización y clave de comparación
    CorreoElectronico.ts      ← value object con validación y normalización a lowercase
    puertos/
      RepositorioDeClientes.ts
      RepositorioDeUbicaciones.ts
    errores/
      NombreDeClienteRepetido.ts
  aplicacion/
    RegistrarCliente.ts
    RegistrarUbicacion.ts
  infraestructura/
    persistencia/
      PrismaRepositorioDeClientes.ts
      PrismaRepositorioDeUbicaciones.ts
    consultas/
      ClientesDeLaCartera.ts  ← lectura directa Prisma, server-only
      UbicacionesDelCliente.ts
    dependencias.ts           ← composition root, lazy instantiation
```

### Server actions

Patrón: `useActionState` en el cliente + `useFormStatus` en `<BotonGuardar>` separado.

```ts
// estado.ts — separado porque "use server" sólo puede exportar async functions
export type ValoresDeX = { campo: string };
export type EstadoDeAltaDeX = { error: string | null; valores: ValoresDeX };
export const ESTADO_ALTA_INICIAL: EstadoDeAltaDeX = { error: null, valores: { campo: "" } };

// actions.ts
"use server"
export async function hacerAlgo(_estado: EstadoDeAltaDeX, datos: FormData): Promise<EstadoDeAltaDeX> {
  await requerirRol("OFICINA");  // re-check en cada acción
  // ...
  revalidatePath("/ruta");
  redirect("/ruta");  // fuera del try/catch
}
```

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
- **`server-only`** en lecturas y raíces de composición impide importar desde el cliente.
- Las tablas ya existen en Aiven. La migración
  `20260915070000_ubicaciones_servicios_asignaciones_eventos` fue marcada como aplicada con
  `prisma migrate resolve --applied` porque las tablas las creó un `db push` previo.

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
- **Ruta del técnico.** `/app/tecnico/ruta` — pendiente. Debe mostrar los eventos PROGRAMADOS
  del día de hoy ordenados por hora, con dirección y enlace a Google Maps.
