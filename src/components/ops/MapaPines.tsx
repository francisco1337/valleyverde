"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { geocodificar } from "@/lib/geocodificar";

const NORTE_PHOENIX: [number, number] = [33.65, -112.0];

type Parada = {
  eventoId: string;
  hora: string;
  cliente: string;
  direccion: string;
  latitud: number;
  longitud: number;
};

function icono() {
  return L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
}

export function MapaPines({ paradas }: { paradas: Parada[] }) {
  const contenedor = useRef<HTMLDivElement>(null);
  const mapa = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!contenedor.current || mapa.current) return;

    const m = L.map(contenedor.current, { zoomControl: true }).setView(NORTE_PHOENIX, 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(m);

    mapa.current = m;

    async function agregarPines() {
      const bounds = L.latLngBounds([]);
      let hayPines = false;

      await Promise.all(
        paradas.map(async (p) => {
          let coords: [number, number] | null =
            p.latitud !== 0 || p.longitud !== 0 ? [p.latitud, p.longitud] : null;

          if (!coords) coords = await geocodificar(p.direccion, NORTE_PHOENIX);
          if (!coords) return;

          hayPines = true;
          bounds.extend(coords);

          L.marker(coords, { icon: icono() })
            .addTo(m)
            .bindPopup(`<strong>${p.hora} — ${p.cliente}</strong><br/><small>${p.direccion}</small>`);
        }),
      );

      if (hayPines) {
        if (paradas.length === 1) {
          m.setView(bounds.getCenter(), 14);
        } else {
          m.fitBounds(bounds, { padding: [40, 40] });
        }
      }
    }

    agregarPines();

    return () => {
      m.remove();
      mapa.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={contenedor} className="h-full w-full" />;
}
