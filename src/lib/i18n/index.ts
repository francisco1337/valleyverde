import "server-only";

import { idiomaActual, type Idioma } from "@/lib/idioma";
import { comun } from "./slices/comun";
import { paneles } from "./slices/paneles";
import { login } from "./slices/login";
import { clientes } from "./slices/clientes";
import { asignaciones } from "./slices/asignaciones";
import { programar } from "./slices/programar";
import { cobranza } from "./slices/cobranza";
import { servicios } from "./slices/servicios";
import { reportes } from "./slices/reportes";
import { trabajos } from "./slices/trabajos";
import { tecnico } from "./slices/tecnico";
import { asistente } from "./slices/asistente";
import { errores } from "./slices/errores";

const diccionarios = {
  es: {
    comun: comun.es,
    paneles: paneles.es,
    login: login.es,
    clientes: clientes.es,
    asignaciones: asignaciones.es,
    programar: programar.es,
    cobranza: cobranza.es,
    servicios: servicios.es,
    reportes: reportes.es,
    trabajos: trabajos.es,
    tecnico: tecnico.es,
    asistente: asistente.es,
    errores: errores.es,
  },
  en: {
    comun: comun.en,
    paneles: paneles.en,
    login: login.en,
    clientes: clientes.en,
    asignaciones: asignaciones.en,
    programar: programar.en,
    cobranza: cobranza.en,
    servicios: servicios.en,
    reportes: reportes.en,
    trabajos: trabajos.en,
    tecnico: tecnico.en,
    asistente: asistente.en,
    errores: errores.en,
  },
} as const satisfies Record<Idioma, unknown>;

export type Diccionario = (typeof diccionarios)["es"];

/** El diccionario completo para el idioma activo (leído de la cookie `vv_idioma`). */
export async function diccionario(): Promise<Diccionario> {
  const idioma = await idiomaActual();
  return diccionarios[idioma];
}

export type { Idioma };
