"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Navigation, MapPin, Loader2 } from "lucide-react";

const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

type Props = {
  latitud: number;
  longitud: number;
  direccion: string;
  cliente: string;
};

function AjustarVista({
  destino,
  origen,
}: {
  destino: [number, number];
  origen: [number, number] | null;
}) {
  const map = useMap();
  const ajustado = useRef(false);

  useEffect(() => {
    if (!ajustado.current) {
      if (origen) {
        map.fitBounds([destino, origen], { padding: [40, 40] });
      } else {
        map.setView(destino, 15);
      }
      ajustado.current = true;
    }
  }, [map, destino, origen]);

  return null;
}

export function MapaNavegacion({ latitud, longitud, direccion, cliente }: Props) {
  const [ubicacionActual, setUbicacionActual] = useState<[number, number] | null>(null);
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });
  }, []);

  function localizarme() {
    if (!navigator.geolocation) return;
    setBuscando(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUbicacionActual([pos.coords.latitude, pos.coords.longitude]);
        setBuscando(false);
      },
      () => setBuscando(false),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  const destino: [number, number] = [latitud, longitud];

  const urlNavegacion = ubicacionActual
    ? `https://www.google.com/maps/dir/${ubicacionActual[0]},${ubicacionActual[1]}/${latitud},${longitud}`
    : `https://www.google.com/maps/search/?api=1&query=${latitud},${longitud}`;

  const iconoVerde = L.divIcon({
    className: "",
    html: `<div style="width:14px;height:14px;border-radius:50%;background:#1a6b3a;border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

  return (
    <div className="flex h-full flex-col">
      <div className="relative flex-1">
        <MapContainer
          center={destino}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={destino}>
            <Popup>
              <strong className="block">{cliente}</strong>
              <span className="text-xs">{direccion}</span>
            </Popup>
          </Marker>

          {ubicacionActual && (
            <>
              <Marker position={ubicacionActual} icon={iconoVerde}>
                <Popup>Tu ubicación</Popup>
              </Marker>
              <Polyline
                positions={[ubicacionActual, destino]}
                pathOptions={{ color: "#1a6b3a", weight: 3, dashArray: "8 6", opacity: 0.8 }}
              />
            </>
          )}

          <AjustarVista destino={destino} origen={ubicacionActual} />
        </MapContainer>

        <div className="absolute bottom-3 right-3 z-[1000] flex flex-col gap-2">
          <button
            onClick={localizarme}
            disabled={buscando}
            className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-forest-800 shadow-md transition hover:bg-forest-50 disabled:opacity-60"
          >
            {buscando ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <MapPin className="h-3.5 w-3.5" />
            )}
            Mi ubicación
          </button>
        </div>
      </div>

      <div className="border-t border-sand-200 bg-white p-3">
        <a
          href={urlNavegacion}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-forest-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-forest-800"
        >
          <Navigation className="h-4 w-4" aria-hidden />
          Navegar con Google Maps
        </a>
      </div>
    </div>
  );
}
