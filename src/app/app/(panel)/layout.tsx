import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";

import { cerrarSesion } from "@/app/app/login/actions";
import { requerirSesion } from "@/lib/acceso";
import { ops } from "@/lib/ops";
import { paneles } from "@/lib/paneles";

/**
 * Marco de todo lo que hay detrás del login.
 *
 * Pide sesión una sola vez aquí arriba: `usuarioActual` está memorizado por
 * render, así que las páginas de adentro pueden volver a pedirla sin costo.
 */
export default async function LayoutDelPanel({
  children,
}: LayoutProps<"/app">) {
  const usuario = await requerirSesion();
  const panel = paneles[usuario.rol];

  return (
    <div className="flex min-h-svh flex-1 flex-col bg-sand-50">
      <header className="sticky top-0 z-10 border-b border-sand-200 bg-sand-50/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-4 px-5 py-3.5 sm:px-8">
          <Link href={panel.ruta} className="shrink-0">
            <Image
              src="/logo-color.webp"
              alt={ops.nombre}
              width={520}
              height={221}
              priority
              className="h-7 w-auto"
            />
          </Link>

          <span
            className="rounded-md bg-forest-700 px-2 py-1 text-[11px] font-bold tracking-[0.12em] text-sand-50 uppercase"
            title={panel.descripcion}
          >
            {panel.etiqueta}
          </span>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm text-forest-950/60 sm:inline">
              {usuario.nombre}
            </span>

            <form action={cerrarSesion}>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-forest-950/55 transition hover:bg-sand-100 hover:text-forest-800 focus-visible:ring-2 focus-visible:ring-forest-400 focus-visible:outline-none"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden />
                Salir
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
