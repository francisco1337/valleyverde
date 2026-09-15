# Contextos

Arquitectura hexagonal (puertos y adaptadores) con DDD. Hoy vive aquí un solo
contexto — `identidad`, el login — y el resto (clientes, rutas, facturación) se
agrega al lado con la misma forma.

## La regla

Las dependencias apuntan siempre hacia adentro:

```
adaptadores de entrada  →  aplicación  →  dominio  ←  adaptadores de salida
(Next, seed)               (casos de uso)  (reglas)     (Prisma, bcrypt, cookies)
```

`dominio/` no importa Next, ni Prisma, ni bcrypt, ni jose. Si algún día hace
falta comprobarlo de un vistazo:

```bash
grep -rE "next|@prisma|bcryptjs|jose" src/contextos/*/dominio/
```

Eso debe salir vacío.

## Qué va en cada capa

| Capa | Qué hay | Ejemplo |
|---|---|---|
| `dominio/` | Entidades, objetos de valor y las reglas. Los **puertos** son las interfaces que el dominio necesita que alguien cumpla. | `Usuario.autenticar()` decide quién puede entrar |
| `aplicacion/` | Casos de uso. Orquestan, no deciden. Reciben puertos, devuelven objetos planos. | `IniciarSesion` |
| `infraestructura/` | Los **adaptadores**: cada implementación concreta de un puerto, más la raíz de composición. | `PrismaRepositorioDeUsuarios`, `SesionEnCookie` |

Los **adaptadores de entrada** no viven aquí: son las server actions de
`src/app/`, las guardas de `src/lib/acceso.ts`, `src/proxy.ts` y `prisma/seed.ts`.
Todos hablan con casos de uso, nunca con Prisma.

## Por qué así

- El login se puede probar con un repositorio en memoria, sin levantar MySQL.
- Cambiar de ORM, de algoritmo de hash o de dónde vive la sesión toca **un**
  archivo de `infraestructura/` y nada más.
- Las reglas de negocio están en un solo lugar y se leen sin ruido de framework.

## Una capa de defensa no es dos

`src/proxy.ts` sólo mira la cookie: es rápido y corre en cada navegación, pero
un token sigue siendo válido durante días. La comprobación que manda es
`ObtenerUsuarioAutenticado`, que vuelve a preguntarle a la base — por eso una
cuenta desactivada deja de entrar en el acto, aunque su token no haya expirado.
