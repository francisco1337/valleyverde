"use client";

import dynamic from "next/dynamic";

const MapaNavegacionInner = dynamic(
  () => import("@/components/ops/MapaNavegacion").then((m) => m.MapaNavegacion),
  { ssr: false, loading: () => <div className="h-full animate-pulse bg-sand-100" /> },
);

type Props = {
  latitud: number;
  longitud: number;
  direccion: string;
  cliente: string;
};

export function MapaNavegacionLazy(props: Props) {
  return <MapaNavegacionInner {...props} />;
}
