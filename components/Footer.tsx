import Link from "next/link";
import Logo from "./Logo";
import Newsletter from "./Newsletter";

const perks = [
  { title: "Envío gratis", copy: "En pedidos desde 50 € a península." },
  { title: "Devoluciones gratuitas", copy: "Tienes 30 días para cambiar de opinión." },
  { title: "Recogida en tienda", copy: "Gratis en cualquiera de nuestras tiendas." },
  { title: "Pago en 3 plazos", copy: "Sin intereses en compras desde 60 €." }
];

export default function Footer() {
  return (
    <>
      <section className="border-t border-ink/10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 md:grid-cols-4 md:px-8">
          {perks.map((b) => (
            <div key={b.title} className="text-center">
              <p className="text-xs font-semibold uppercase tracking-widest2">{b.title}</p>
              <p className="mt-2 text-xs text-ink/60">{b.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <Newsletter />

      <footer className="bg-ink text-white/70">
        <div className="mx-auto max-w-7xl px-4 py-14 text-sm md:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
            <div className="md:col-span-2">
              <Logo light />
              <p className="mt-4 max-w-xs font-display text-lg italic text-white">Moda con alma de mar.</p>
              <p className="mt-4 text-xs leading-relaxed text-white/50">
                Altamar es una marca ficticia creada para demostraciones de Salesforce Data Cloud.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest2 text-white">Comprar</p>
              <ul className="mt-3 space-y-2 text-xs">
                <li><Link href="/productos?cat=mujer" className="hover:text-white">Mujer</Link></li>
                <li><Link href="/productos?cat=hombre" className="hover:text-white">Hombre</Link></li>
                <li><Link href="/productos?cat=ninos" className="hover:text-white">Niños</Link></li>
                <li><Link href="/productos?cat=accesorios" className="hover:text-white">Accesorios</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest2 text-white">Ayuda</p>
              <ul className="mt-3 space-y-2 text-xs">
                <li>Envíos y entregas</li>
                <li>Cambios y devoluciones</li>
                <li>Guía de tallas</li>
                <li>Preguntas frecuentes</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest2 text-white">Altamar</p>
              <ul className="mt-3 space-y-2 text-xs">
                <li><Link href="/nosotros" className="hover:text-white">Nuestra historia</Link></li>
                <li>Sostenibilidad</li>
                <li>Tiendas</li>
                <li>Política de privacidad y cookies</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-[11px] text-white/40 md:flex-row md:justify-between">
            <p>© 2026 Altamar · Marca ficticia · Demo sin pagos reales</p>
            <p>Fotografías: Unsplash</p>
          </div>
        </div>
      </footer>
    </>
  );
}
