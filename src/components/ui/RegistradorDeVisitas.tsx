"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { registrarVisita } from "@/lib/visitas";

/**
 * Bitácora de vistas de página — sitio público y panel interno, montado una
 * sola vez en el layout raíz (ver src/app/layout.tsx). No pinta nada; sólo
 * dispara el registro en cada cambio de ruta, sin bloquear la navegación si
 * falla (por ejemplo si la base está caída).
 */
export function RegistradorDeVisitas() {
  const pathname = usePathname();

  useEffect(() => {
    registrarVisita(pathname).catch(() => {});
  }, [pathname]);

  return null;
}
