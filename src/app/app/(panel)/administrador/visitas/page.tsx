import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowUp, ArrowUpDown } from "lucide-react";
import type { Metadata } from "next";

import { requerirRol } from "@/lib/acceso";
import { diccionario } from "@/lib/i18n";
import { idiomaActual } from "@/lib/idioma";
import { formatearFecha } from "@/lib/i18n/fecha";
import { ROLES } from "@/contextos/identidad/dominio/Rol";
import { clientePrisma } from "@/contextos/compartido/infraestructura/persistencia/ClientePrisma";
import type { Prisma } from "@/generated/prisma/client";

export const metadata: Metadata = {
  title: "Visitas",
  robots: { index: false, follow: false },
};

const LIMITE = 300;
const COLUMNAS = ["ruta", "fecha", "hora", "rol", "ip"] as const;
type Columna = (typeof COLUMNAS)[number];
type Direccion = "asc" | "desc";

function esColumna(valor: string | undefined): valor is Columna {
  return !!valor && (COLUMNAS as readonly string[]).includes(valor);
}

function construirOrderBy(columna: Columna, dir: Direccion) {
  switch (columna) {
    case "ruta":
      return [{ ruta: dir }];
    case "hora":
      return [{ hora: dir }];
    case "rol":
      return [{ rol: dir }];
    case "ip":
      return [{ ip: dir }];
    case "fecha":
    default:
      return [{ fecha: dir }, { hora: dir }];
  }
}

/** "YYYY-MM-DD" (tal como lo manda <input type="date">) a Date local, sin desfase de zona horaria. */
function deISO(valor: string | undefined): Date | null {
  if (!valor) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor);
  if (!match) return null;
  const [, anio, mes, dia] = match;
  return new Date(Number(anio), Number(mes) - 1, Number(dia));
}

type Filtros = {
  ruta: string;
  ip: string;
  rol: string; // "" = todos, "ANONIMO" = sin sesión, o un Rol literal
  desde: string;
  hasta: string;
};

function construirWhere(f: Filtros): Prisma.VisitaWhereInput {
  const where: Prisma.VisitaWhereInput = {};

  if (f.ruta) where.ruta = { contains: f.ruta };
  if (f.ip) where.ip = { contains: f.ip };

  if (f.rol === "ANONIMO") where.rol = null;
  else if ((ROLES as readonly string[]).includes(f.rol)) where.rol = f.rol as (typeof ROLES)[number];

  const desde = deISO(f.desde);
  const hasta = deISO(f.hasta);
  if (desde || hasta) {
    where.fecha = {};
    if (desde) where.fecha.gte = desde;
    if (hasta) where.fecha.lte = hasta;
  }

  return where;
}

/** Query string que conserva filtros + orden — para los links de encabezado y el form de filtros. */
function construirQuery(f: Filtros, ordenar: Columna, dir: Direccion): string {
  const params = new URLSearchParams();
  if (f.ruta) params.set("ruta", f.ruta);
  if (f.ip) params.set("ip", f.ip);
  if (f.rol) params.set("rol", f.rol);
  if (f.desde) params.set("desde", f.desde);
  if (f.hasta) params.set("hasta", f.hasta);
  params.set("ordenar", ordenar);
  params.set("dir", dir);
  return params.toString();
}

function hrefOrdenar(columna: Columna, f: Filtros, ordenActual: Columna, dirActual: Direccion): string {
  const nuevaDir: Direccion = ordenActual === columna && dirActual === "desc" ? "asc" : "desc";
  return `/app/administrador/visitas?${construirQuery(f, columna, nuevaDir)}`;
}

function Encabezado({
  columna,
  filtros,
  ordenActual,
  dirActual,
  children,
}: {
  columna: Columna;
  filtros: Filtros;
  ordenActual: Columna;
  dirActual: Direccion;
  children: React.ReactNode;
}) {
  const activo = ordenActual === columna;
  return (
    <Link
      href={hrefOrdenar(columna, filtros, ordenActual, dirActual)}
      className="flex items-center gap-1 text-xs font-semibold tracking-wide text-forest-950/50 uppercase transition hover:text-forest-800"
    >
      {children}
      {activo ? (
        dirActual === "desc" ? (
          <ArrowDown className="h-3 w-3" />
        ) : (
          <ArrowUp className="h-3 w-3" />
        )
      ) : (
        <ArrowUpDown className="h-3 w-3 opacity-30" />
      )}
    </Link>
  );
}

type Props = {
  searchParams: Promise<{
    ordenar?: string;
    dir?: string;
    ruta?: string;
    ip?: string;
    rol?: string;
    desde?: string;
    hasta?: string;
  }>;
};

export default async function PaginaDeVisitas({ searchParams }: Props) {
  await requerirRol("ADMINISTRADOR");
  const [t, idioma, params] = await Promise.all([diccionario(), idiomaActual(), searchParams]);

  const ordenar: Columna = esColumna(params.ordenar) ? params.ordenar : "fecha";
  const dir: Direccion = params.dir === "asc" ? "asc" : "desc";

  const filtros: Filtros = {
    ruta: params.ruta ?? "",
    ip: params.ip ?? "",
    rol: params.rol ?? "",
    desde: params.desde ?? "",
    hasta: params.hasta ?? "",
  };

  const hayFiltros = Boolean(filtros.ruta || filtros.ip || filtros.rol || filtros.desde || filtros.hasta);

  const visitas = await clientePrisma().visita.findMany({
    where: construirWhere(filtros),
    orderBy: construirOrderBy(ordenar, dir),
    take: LIMITE,
  });

  const usuarioIds = [...new Set(visitas.map((v) => v.usuarioId).filter((id): id is string => !!id))];
  const usuarios = usuarioIds.length
    ? await clientePrisma().usuario.findMany({
        where: { id: { in: usuarioIds } },
        select: { id: true, nombre: true },
      })
    : [];
  const nombrePorId = new Map(usuarios.map((u) => [u.id, u.nombre]));

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <Link
        href="/app/administrador"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-forest-950/55 transition hover:text-forest-800"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.comun.panel}
      </Link>

      <header className="mb-8">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-forest-600 uppercase">
          {t.visitas.operacion}
        </p>
        <h1 className="mt-2.5 text-3xl font-bold tracking-tight text-forest-950">{t.visitas.visitas}</h1>
        <p className="mt-2 text-sm text-forest-950/60">{t.visitas.ayuda}</p>
      </header>

      <form className="mb-8 flex flex-wrap items-end gap-4 rounded-2xl border border-sand-200 bg-white px-5 py-4">
        <input type="hidden" name="ordenar" value={ordenar} />
        <input type="hidden" name="dir" value={dir} />

        <div>
          <label htmlFor="ruta" className="block text-xs font-semibold text-forest-950/50 uppercase">
            {t.visitas.filtros.ruta}
          </label>
          <input
            id="ruta"
            name="ruta"
            type="text"
            defaultValue={filtros.ruta}
            placeholder={t.visitas.filtros.rutaPlaceholder}
            className="mt-1.5 w-48 rounded-lg border border-sand-300 px-3 py-1.5 text-sm text-forest-950 focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:outline-none"
          />
        </div>

        <div>
          <label htmlFor="ip" className="block text-xs font-semibold text-forest-950/50 uppercase">
            {t.visitas.filtros.ip}
          </label>
          <input
            id="ip"
            name="ip"
            type="text"
            defaultValue={filtros.ip}
            placeholder={t.visitas.filtros.ipPlaceholder}
            className="mt-1.5 w-36 rounded-lg border border-sand-300 px-3 py-1.5 text-sm text-forest-950 focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:outline-none"
          />
        </div>

        <div>
          <label htmlFor="rol" className="block text-xs font-semibold text-forest-950/50 uppercase">
            {t.visitas.filtros.rol}
          </label>
          <select
            id="rol"
            name="rol"
            defaultValue={filtros.rol}
            className="mt-1.5 rounded-lg border border-sand-300 bg-white px-3 py-1.5 text-sm text-forest-950 focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:outline-none"
          >
            <option value="">{t.visitas.filtros.todos}</option>
            <option value="ANONIMO">{t.visitas.anonimo}</option>
            {ROLES.map((rol) => (
              <option key={rol} value={rol}>
                {rol}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="desde" className="block text-xs font-semibold text-forest-950/50 uppercase">
            {t.visitas.filtros.desde}
          </label>
          <input
            id="desde"
            name="desde"
            type="date"
            defaultValue={filtros.desde}
            className="mt-1.5 rounded-lg border border-sand-300 px-3 py-1.5 text-sm text-forest-950 focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:outline-none"
          />
        </div>

        <div>
          <label htmlFor="hasta" className="block text-xs font-semibold text-forest-950/50 uppercase">
            {t.visitas.filtros.hasta}
          </label>
          <input
            id="hasta"
            name="hasta"
            type="date"
            defaultValue={filtros.hasta}
            className="mt-1.5 rounded-lg border border-sand-300 px-3 py-1.5 text-sm text-forest-950 focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:outline-none"
          />
        </div>

        <button
          type="submit"
          className="rounded-xl bg-forest-700 px-4 py-2 text-sm font-semibold text-sand-50 shadow-sm transition hover:bg-forest-600 focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:ring-offset-2 focus-visible:ring-offset-sand-50 focus-visible:outline-none"
        >
          {t.visitas.filtros.filtrar}
        </button>

        {hayFiltros && (
          <Link
            href={`/app/administrador/visitas?ordenar=${ordenar}&dir=${dir}`}
            className="text-sm text-forest-950/50 underline-offset-2 hover:text-forest-800 hover:underline"
          >
            {t.visitas.filtros.limpiar}
          </Link>
        )}
      </form>

      {visitas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-sand-300 bg-white px-6 py-14 text-center">
          <p className="text-sm font-semibold text-forest-950">
            {hayFiltros ? t.visitas.sinResultados : t.visitas.sinVisitas}
          </p>
        </div>
      ) : (
        <>
          <p className="mb-3 text-xs text-forest-950/45">{t.visitas.mostrandoUltimas(visitas.length)}</p>
          <div className="overflow-x-auto rounded-2xl border border-sand-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-sand-200 bg-sand-50">
                <tr>
                  <th className="px-4 py-3">
                    <Encabezado columna="ruta" filtros={filtros} ordenActual={ordenar} dirActual={dir}>
                      {t.visitas.columnaRuta}
                    </Encabezado>
                  </th>
                  <th className="px-4 py-3">
                    <Encabezado columna="fecha" filtros={filtros} ordenActual={ordenar} dirActual={dir}>
                      {t.visitas.columnaFecha}
                    </Encabezado>
                  </th>
                  <th className="px-4 py-3">
                    <Encabezado columna="hora" filtros={filtros} ordenActual={ordenar} dirActual={dir}>
                      {t.visitas.columnaHora}
                    </Encabezado>
                  </th>
                  <th className="px-4 py-3">
                    <Encabezado columna="rol" filtros={filtros} ordenActual={ordenar} dirActual={dir}>
                      {t.visitas.columnaRol}
                    </Encabezado>
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wide text-forest-950/50 uppercase">
                    {t.visitas.columnaUsuario}
                  </th>
                  <th className="px-4 py-3">
                    <Encabezado columna="ip" filtros={filtros} ordenActual={ordenar} dirActual={dir}>
                      {t.visitas.columnaIp}
                    </Encabezado>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {visitas.map((v) => (
                  <tr key={v.id}>
                    <td className="max-w-[280px] truncate px-4 py-2.5 font-mono text-xs text-forest-950">
                      {v.ruta}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-forest-950/70">
                      {formatearFecha(v.fecha, idioma, { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-2.5 text-forest-950/70">{v.hora}</td>
                    <td className="px-4 py-2.5 text-forest-950/70">{v.rol ?? "—"}</td>
                    <td className="px-4 py-2.5 text-forest-950/70">
                      {v.usuarioId ? (nombrePorId.get(v.usuarioId) ?? "—") : t.visitas.anonimo}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-forest-950/70">{v.ip ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
