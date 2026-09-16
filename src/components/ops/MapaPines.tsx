"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix the default Leaflet icon paths broken by webpack
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

type Parada = {
  eventoId: string;
  hora: string;
  cliente: string;
  direccion: string;
  latitud: number;
  longitud: number;
};

export function MapaPines({ paradas }: { paradas: Parada[] }) {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });
  }, []);

  const conCoordenadas = paradas.filter((p) => p.latitud && p.longitud);

  const centro =
    conCoordenadas.length > 0
      ? ([
          conCoordenadas.reduce((s, p) => s + p.latitud, 0) / conCoordenadas.length,
          conCoordenadas.reduce((s, p) => s + p.longitud, 0) / conCoordenadas.length,
        ] as [number, number])
      : ([33.6, -112.0] as [number, number]); // North Phoenix fallback

  if (conCoordenadas.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-sand-100 text-sm text-forest-950/50">
        Sin coordenadas registradas
      </div>
    );
  }

  return (
    <MapContainer
      center={centro}
      zoom={conCoordenadas.length === 1 ? 14 : 12}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {conCoordenadas.map((p) => (
        <Marker key={p.eventoId} position={[p.latitud, p.longitud]}>
          <Popup>
            <strong className="block">{p.hora} — {p.cliente}</strong>
            <span className="text-xs">{p.direccion}</span>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
