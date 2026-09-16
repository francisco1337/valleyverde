"use client";

import dynamic from "next/dynamic";
import type { DiccionarioCliente } from "@/lib/i18n/paraCliente";

const MapaNavegacionInner = dynamic(
  () => import("@/components/ops/MapaNavegacion").then((m) => m.MapaNavegacion),
  { ssr: false, loading: () => <div className="h-full animate-pulse bg-sand-100" /> },
);

type Props = {
  latitud: number | null;
  longitud: number | null;
  direccion: string;
  cliente: string;
  t: DiccionarioCliente;
};

export function MapaNavegacionLazy(props: Props) {
  return <MapaNavegacionInner {...props} />;
}
