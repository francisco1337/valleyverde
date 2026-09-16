"use client";

import dynamic from "next/dynamic";

const MapaPinesInner = dynamic(
  () => import("@/components/ops/MapaPines").then((m) => m.MapaPines),
  { ssr: false, loading: () => <div className="h-full animate-pulse bg-sand-100" /> },
);

type Parada = {
  eventoId: string;
  hora: string;
  cliente: string;
  direccion: string;
  latitud: number;
  longitud: number;
};

export function MapaPinesLazy({ paradas }: { paradas: Parada[] }) {
  return <MapaPinesInner paradas={paradas} />;
}
