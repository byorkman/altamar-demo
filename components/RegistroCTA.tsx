import Link from "next/link";

const benefits = ["10 % en tu primera compra", "Acceso anticipado a las colecciones", "Envío gratis para miembros"];

/** Bloque destacado de la home que lleva al registro (alta en Marketing Cloud Next con doble opt-in). */
export default function RegistroCTA() {
  return (
    <section className="bg-ink text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-14 md:grid-cols-[1fr_auto] md:px-8 md:py-16">
        <div>
          <p className="text-[11px] uppercase tracking-widest2 text-white/70">Club Altamar</p>
          <h2 className="mt-3 text-4xl font-light md:text-5xl">Crea tu cuenta y únete al club</h2>
          <ul className="mt-6 flex flex-col gap-2 text-white/85 sm:flex-row sm:gap-8">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-terra" />
                {b}
              </li>
            ))}
          </ul>
        </div>
        <Link
          href="/registro"
          className="inline-block bg-terra px-12 py-5 text-center text-sm font-semibold uppercase tracking-widest2 text-white transition hover:bg-white hover:text-ink"
        >
          Crear mi cuenta
        </Link>
      </div>
    </section>
  );
}
