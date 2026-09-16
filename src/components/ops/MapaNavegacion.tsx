"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2, MapPin, Navigation } from "lucide-react";

import { geocodificar } from "@/lib/geocodificar";
import type { DiccionarioCliente } from "@/lib/i18n/paraCliente";

type Props = {
  latitud: number | null;
  longitud: number | null;
  direccion: string;
  cliente: string;
  t: DiccionarioCliente;
};

function icono(color: "verde" | "azul") {
  const svg =
    color === "verde"
      ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36"><path fill="#1a6b3a" d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z"/><circle cx="12" cy="12" r="5" fill="white"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36"><path fill="#2563eb" d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z"/><circle cx="12" cy="12" r="5" fill="white"/></svg>`;

  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36],
  });
}

export function MapaNavegacion({ latitud, longitud, direccion, cliente, t }: Props) {
  const contenedor = useRef<HTMLDivElement>(null);
  const mapa = useRef<L.Map | null>(null);
  const markerOrigen = useRef<L.Marker | null>(null);
  const lineaRef = useRef<L.Polyline | null>(null);
  const coordsDestino = useRef<[number, number] | null>(null);
  const [ubicacionActual, setUbicacionActual] = useState<[number, number] | null>(null);
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    if (!contenedor.current || mapa.current) return;

    const m = L.map(contenedor.current, { zoomControl: true }).setView([33.65, -112.0], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(m);

    mapa.current = m;

    // El geocoding es async; si el efecto se limpia (navegación, o el doble
    // montaje de Strict Mode en dev) antes de que resuelva, `m` ya está
    // destruido y pintar sobre él revienta con "appendChild of undefined".
    let cancelado = false;

    async function inicializar() {
      let destino: [number, number] | null =
        latitud !== null && longitud !== null ? [latitud, longitud] : null;

      if (!destino) destino = await geocodificar(direccion);
      if (!destino || cancelado) return;

      coordsDestino.current = destino;
      m.setView(destino, 15);

      L.marker(destino, { icon: icono("verde") })
        .addTo(m)
        .bindPopup(`<strong>${cliente}</strong><br/><small>${direccion}</small>`)
        .openPopup();
    }

    inicializar();

    return () => {
      cancelado = true;
      m.remove();
      mapa.current = null;
      coordsDestino.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const m = mapa.current;
    if (!m || !ubicacionActual) return;

    const [lat, lng] = ubicacionActual;

    if (markerOrigen.current) {
      markerOrigen.current.setLatLng([lat, lng]);
    } else {
      markerOrigen.current = L.marker([lat, lng], { icon: icono("azul") })
        .addTo(m)
        .bindPopup(t.tecnico.mapa.tuUbicacion);
    }

    if (lineaRef.current) {
      lineaRef.current.remove();
    }

    const destino = coordsDestino.current;
    if (destino) {
      lineaRef.current = L.polyline([[lat, lng], destino], {
        color: "#1a6b3a",
        weight: 3,
        dashArray: "8 6",
        opacity: 0.8,
      }).addTo(m);

      m.fitBounds([[lat, lng], destino], { padding: [40, 40] });
    }
  }, [ubicacionActual]);

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

  const destino = coordsDestino.current;
  const urlNavegacion =
    ubicacionActual && destino
      ? `https://www.google.com/maps/dir/${ubicacionActual[0]},${ubicacionActual[1]}/${destino[0]},${destino[1]}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`;

  return (
    <div className="flex h-full flex-col">
      <div className="relative flex-1">
        <div ref={contenedor} className="h-full w-full" />

        <div className="absolute bottom-3 right-3 z-[1000]">
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
            {t.tecnico.mapa.miUbicacion}
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
          {t.tecnico.mapa.navegarConGoogleMaps}
        </a>
      </div>
    </div>
  );
}
