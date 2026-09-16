/** Fecha de hoy en la zona horaria de Phoenix (MST, UTC−7, sin horario de verano). */
export function hoyEnPhoenix(): Date {
  const ahoraUTC = new Date();
  const mst = new Date(ahoraUTC.getTime() - 7 * 60 * 60 * 1000);
  return new Date(mst.getFullYear(), mst.getMonth(), mst.getDate());
}
