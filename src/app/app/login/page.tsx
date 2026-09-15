import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, FileText, Route, ShieldCheck, Wallet } from "lucide-react";

import { LoginForm } from "@/components/ops/LoginForm";
import { ops, puntosFuertesOps } from "@/lib/ops";
import { company } from "@/lib/site";

export const metadata: Metadata = {
  title: "Entrar",
  description: `${ops.nombre} — ${ops.lema}.`,
  robots: { index: false, follow: false },
};

const iconos = {
  ruta: Route,
  archivo: FileText,
  cartera: Wallet,
} as const;

export default function PaginaDeEntrada() {
  return (
    <div className="flex min-h-svh flex-1 bg-sand-50">
      {/* Panel de marca — lo primero que ve cualquiera, así que vende. */}
      <aside className="relative hidden lg:flex lg:w-[46%] xl:w-[42%]">
        <Image
          src="/images/gallery/g5.webp"
          alt=""
          fill
          priority
          sizes="46vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-forest-950/65 via-forest-950/85 to-forest-950/95"
          aria-hidden
        />

        <div className="relative flex w-full flex-col justify-between p-10 xl:p-14">
          <Link href="/" className="w-fit">
            <Image
              src="/logo-white.webp"
              alt={company.name}
              width={520}
              height={221}
              priority
              className="h-10 w-auto"
            />
          </Link>

          <div className="max-w-sm">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-sprout-400 uppercase">
              {ops.nombre}
            </p>
            <h2 className="mt-4 text-3xl leading-[1.15] font-bold text-sand-50 xl:text-4xl">
              {ops.lema}.
            </h2>

            <ul className="mt-10 space-y-6">
              {puntosFuertesOps.map((punto) => {
                const Icono = iconos[punto.icono];
                return (
                  <li key={punto.titulo} className="flex gap-4">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sand-50/10 ring-1 ring-sand-50/15">
                      <Icono className="h-4.5 w-4.5 text-sprout-300" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-sand-50">
                        {punto.titulo}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-sand-50/60">
                        {punto.cuerpo}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <p className="flex items-center gap-2 text-xs text-sand-50/45">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
            Con licencia y seguro en el estado de Arizona · {company.city}
          </p>
        </div>
      </aside>

      {/* Columna de entrada */}
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
          <div className="w-full max-w-sm">
            <Link href="/" className="mb-10 block w-fit lg:hidden">
              <Image
                src="/logo-color.webp"
                alt={company.name}
                width={520}
                height={221}
                priority
                className="h-9 w-auto"
              />
            </Link>

            <p className="text-[11px] font-semibold tracking-[0.18em] text-forest-600 uppercase">
              {ops.nombreCorto}
            </p>
            <h1 className="mt-2.5 text-3xl font-bold tracking-tight text-forest-950">
              Entrar
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-forest-950/60">
              Cuadrillas, cotizaciones y cobranza de {company.name}.
            </p>

            <div className="mt-8">
              <LoginForm />
            </div>

            <Link
              href="/"
              className="mt-10 inline-flex items-center gap-1.5 text-xs font-medium text-forest-950/50 transition hover:text-forest-700"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
              Volver a valleyverde.com
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
