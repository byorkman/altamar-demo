import Link from "next/link";
import { brandAssets } from "@/lib/brandAssets";

export const metadata = {
  title: "Nuestra historia · Altamar",
  description: "Altamar nace en el Mediterráneo: prendas sencillas, materiales naturales y talleres cercanos."
};

export default function AboutPage() {
  return (
    <>
      <section className="relative h-[520px] w-full overflow-hidden">
        <img src={brandAssets.village} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-ink/45" />
        <div className="relative mx-auto flex h-full max-w-4xl flex-col items-center justify-center px-4 text-center text-white">
          <p className="text-[11px] uppercase tracking-widest2 text-white/80">Nuestra historia</p>
          <h1 className="mt-4 text-5xl font-light md:text-7xl">Moda con alma de mar</h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-ink/85">
        <p className="font-display text-2xl leading-relaxed md:text-3xl">
          Altamar nació en un pequeño taller junto al puerto, con una idea sencilla: hacer ropa que se sienta como
          un día de verano.
        </p>
        <p className="mt-8 leading-relaxed">
          Trabajamos con lino europeo, algodón orgánico y fibras naturales. Diseñamos pocas prendas, pensadas para
          durar muchos veranos, y las producimos en talleres cercanos que conocemos por su nombre.
        </p>
        <blockquote className="my-12 border-l-4 border-terra bg-white/60 p-6 font-display text-2xl italic">
          Menos prendas, mejores materiales y más tiempo junto al mar.
        </blockquote>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {[
            ["Materiales naturales", "Más del 80 % de la colección es de lino, algodón orgánico o yute."],
            ["Producción cercana", "El 70 % de nuestras prendas se fabrica en España y Portugal."],
            ["Hechas para durar", "Reparamos gratis las costuras de cualquier prenda Altamar."]
          ].map(([t, c]) => (
            <div key={t}>
              <p className="text-xs font-semibold uppercase tracking-widest2">{t}</p>
              <p className="mt-2 text-sm text-ink/70">{c}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/productos?cat=mujer" className="btn-primary">
            Ver mujer
          </Link>
          <Link href="/productos?cat=hombre" className="btn-primary">
            Ver hombre
          </Link>
        </div>
      </section>

      <section className="h-[420px] w-full overflow-hidden">
        <img src={brandAssets.coast} alt="" className="h-full w-full object-cover" />
      </section>
    </>
  );
}
