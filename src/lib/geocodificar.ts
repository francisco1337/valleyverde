/**
 * Convierte una dirección o nombre de lugar en coordenadas [lat, lng].
 *
 * Intenta dos geocodificadores libres sobre datos de OpenStreetMap, ninguno
 * pide API key y corren en el cliente:
 *   1. Photon (photon.komoot.io) — busca bien por nombre de lugar/POI.
 *   2. Nominatim — respaldo; a veces resuelve direcciones que Photon no.
 *
 * `cerca` sesga los resultados hacia un punto para desambiguar, pero no
 * restringe: una dirección en México se encuentra igual que una en EE. UU.
 *
 * Límite conocido: un nombre que no está en OpenStreetMap (p. ej. el acrónimo
 * "ISSSSPEA" suelto) no se resuelve con ningún proveedor sin token. En ese caso
 * conviene guardar la dirección de calle o las coordenadas a mano.
 */
export async function geocodificar(
  consulta: string,
  cerca?: [number, number],
): Promise<[number, number] | null> {
  return (await conPhoton(consulta, cerca)) ?? (await conNominatim(consulta));
}

async function conPhoton(
  consulta: string,
  cerca?: [number, number],
): Promise<[number, number] | null> {
  try {
    const params = new URLSearchParams({ q: consulta, limit: "1" });
    if (cerca) {
      params.set("lat", String(cerca[0]));
      params.set("lon", String(cerca[1]));
    }

    const res = await fetch(`https://photon.komoot.io/api/?${params.toString()}`);
    const json = await res.json();
    const coords = json.features?.[0]?.geometry?.coordinates;
    if (Array.isArray(coords) && coords.length === 2) {
      const [lng, lat] = coords;
      return [lat, lng];
    }
  } catch {
    // sigue al respaldo
  }
  return null;
}

async function conNominatim(consulta: string): Promise<[number, number] | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(consulta)}&format=json&limit=1`,
      { headers: { "Accept-Language": "es" } },
    );
    const json = await res.json();
    if (json[0]) return [parseFloat(json[0].lat), parseFloat(json[0].lon)];
  } catch {
    // sin resultado
  }
  return null;
}
