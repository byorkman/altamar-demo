"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { USER_EVENT, getUser } from "@/lib/auth";
import { brandAssets } from "@/lib/brandAssets";

type Variant = { eyebrow: string; headline: string; subhead: string; cta: string; href: string; image: string };

const ANONYMOUS: Variant = {
  eyebrow: "Colección Verano 2026",
  headline: "Donde empieza el mar",
  subhead: "Lino, algodón y fibras naturales para vivir el verano sin prisa.",
  cta: "Descubrir la colección",
  href: "/productos",
  image: brandAssets.heroMain
};

const known = (name: string): Variant => ({
  eyebrow: "Club Altamar",
  headline: `${name}, tu acceso anticipado ya está aquí`,
  subhead: "Como miembro del club, descubre antes que nadie la colección de lino y llévate envío gratis en todos tus pedidos.",
  cta: "Ver colección de lino",
  href: "/productos?cat=mujer",
  image: brandAssets.heroKnown
});

/**
 * Hero personalizado: cambia cuando el visitante inicia sesión.
 * En una demo real esta decisión vendría de Data Cloud / Personalization.
 */
export default function HeroBanner() {
  const [v, setV] = useState<Variant>(ANONYMOUS);

  useEffect(() => {
    const refresh = () => {
      const u = getUser();
      setV(u ? known(u.firstName) : ANONYMOUS);
    };
    refresh();
    window.addEventListener(USER_EVENT, refresh);
    return () => window.removeEventListener(USER_EVENT, refresh);
  }, []);

  return (
    <section className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
      <img src={v.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/25 to-transparent" />
      <div className="relative mx-auto flex h-full max-w-7xl items-end px-4 pb-16 md:items-center md:px-8 md:pb-0">
        <div className="max-w-xl text-white">
          <p className="text-[11px] uppercase tracking-widest2 text-white/85">{v.eyebrow}</p>
          <h1 className="mt-4 text-5xl font-light leading-[1.02] md:text-7xl">{v.headline}</h1>
          <p className="mt-5 max-w-md text-base text-white/90">{v.subhead}</p>
          <Link href={v.href} className="btn-outline-light mt-8">
            {v.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
