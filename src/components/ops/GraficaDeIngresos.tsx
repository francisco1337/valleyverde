"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { PuntoDeIngresoDiario } from "@/contextos/eventos/infraestructura/consultas/ReporteDeNegocio";
import type { Idioma } from "@/lib/idioma";

type Props = {
  serie: PuntoDeIngresoDiario[];
  idioma: Idioma;
  etiquetas: { cobrado: string; porCobrar: string };
};

/** dd/mm en español, mm/dd en inglés — cada quien lee fechas en el orden al que está acostumbrado. */
function fmtEje(fechaISO: string, idioma: Idioma) {
  const [, mes, dia] = fechaISO.split("-");
  return idioma === "en" ? `${mes}/${dia}` : `${dia}/${mes}`;
}

function usd(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function GraficaDeIngresos({ serie, idioma, etiquetas }: Props) {
  const datos = serie.map((p) => ({
    fecha: p.fecha.toISOString().slice(0, 10),
    cobrado: Math.round(p.cobrado * 100) / 100,
    porCobrar: Math.round(p.porCobrar * 100) / 100,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={datos} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="var(--color-sand-200)" vertical={false} />
          <XAxis
            dataKey="fecha"
            tickFormatter={(f: string) => fmtEje(f, idioma)}
            tick={{ fontSize: 11, fill: "var(--color-forest-950)", opacity: 0.5 }}
            axisLine={{ stroke: "var(--color-sand-300)" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v: number) => usd(v)}
            tick={{ fontSize: 11, fill: "var(--color-forest-950)", opacity: 0.5 }}
            axisLine={false}
            tickLine={false}
            width={72}
          />
          <Tooltip
            formatter={(valor) => usd(Number(valor))}
            labelFormatter={(fecha) => fmtEje(String(fecha), idioma)}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid var(--color-sand-200)",
              fontSize: 12,
            }}
          />
          <Bar dataKey="cobrado" name={etiquetas.cobrado} stackId="ingresos" fill="var(--color-sprout-400)" radius={[0, 0, 0, 0]} />
          <Bar
            dataKey="porCobrar"
            name={etiquetas.porCobrar}
            stackId="ingresos"
            fill="var(--color-ember-500)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
