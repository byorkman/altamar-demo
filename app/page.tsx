import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";
import ProductRow from "@/components/ProductRow";
import ForYou from "@/components/ForYou";
import { byTag } from "@/data/products";
import { brandAssets } from "@/lib/brandAssets";

const tiles = [
  { label: "Mujer", href: "/productos?cat=mujer", img: brandAssets.tileMujer },
  { label: "Hombre", href: "/productos?cat=hombre", img: brandAssets.tileHombre },
  { label: "Niños", href: "/productos?cat=ninos", img: brandAssets.tileNinos },
  { label: "Accesorios", href: "/productos?cat=accesorios", img: brandAssets.tileAccesorios }
];

export default function HomePage() {
  return (
    <>
      <HeroBanner />

      <ForYou />

      <ProductRow eyebrow="Recién llegados" title="Nueva colección" products={byTag("nueva-coleccion", 4)} href="/productos" />

      <section className="mx-auto max-w-7xl px-4 pb-6 md:px-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {tiles.map((t) => (
            <Link key={t.label} href={t.href} className="group relative block aspect-[3/4] overflow-hidden bg-sand-dark">
              <img src={t.img} alt={t.label} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              <p className="absolute inset-x-0 bottom-0 p-5 text-center font-display text-2xl text-white md:text-3xl">{t.label}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative mt-14 h-[520px] w-full overflow-hidden">
        <img src={brandAssets.linen} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-ink/70 via-ink/25 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-7xl items-center justify-end px-4 md:px-8">
          <div className="max-w-md text-right text-white">
            <p className="text-[11px] uppercase tracking-widest2 text-white/80">Edición limitada</p>
            <h2 className="mt-3 text-4xl font-light md:text-6xl">La cápsula de lino</h2>
            <p className="mt-4 text-white/85">Lino europeo lavado a la piedra. Fresco, transpirable y cada vez más suave.</p>
            <Link href="/productos?cat=hombre" className="btn-outline-light mt-8">
              Comprar lino
            </Link>
          </div>
        </div>
      </section>

      <ProductRow eyebrow="Para toda la temporada" title="Essentials" products={byTag("essentials", 4)} href="/productos" />

      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-10 md:grid-cols-2 md:px-8">
        <div className="aspect-[4/3] overflow-hidden">
          <img src={brandAssets.espadrilles} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="md:pl-6">
          <p className="eyebrow">Hecho en España</p>
          <h2 className="mt-3 text-4xl md:text-5xl">Alpargatas cosidas a mano</h2>
          <p className="mt-4 max-w-md text-ink/70">
            Trabajamos con talleres familiares que llevan tres generaciones cosiendo yute. Cada par lleva unas
            dos horas de trabajo artesanal.
          </p>
          <Link href="/producto/a-alpargatas" className="btn-primary mt-8">
            Ver alpargatas
          </Link>
        </div>
      </section>

      <section className="relative mt-10 h-[440px] w-full overflow-hidden">
        <img src={brandAssets.kids} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-ink/20 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 md:px-8">
          <div className="max-w-md text-white">
            <p className="text-[11px] uppercase tracking-widest2 text-white/80">Niños</p>
            <h2 className="mt-3 text-4xl font-light md:text-5xl">Veranos para recordar</h2>
            <Link href="/productos?cat=ninos" className="btn-outline-light mt-8">
              Ver niños
            </Link>
          </div>
        </div>
      </section>

      <ProductRow eyebrow="Hasta −25 %" title="Últimas unidades" products={byTag("sale", 4)} href="/productos" />
    </>
  );
}
