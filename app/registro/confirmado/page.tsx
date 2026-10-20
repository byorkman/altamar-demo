import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Suscripción confirmada · Altamar" };

/** Página de destino del enlace del email de doble opt-in. */
export default function ConfirmadoPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <p className="eyebrow">Club Altamar</p>
      <h1 className="mt-2 text-4xl">¡Suscripción confirmada!</h1>
      <p className="mt-4 text-sm text-ink/70">
        Gracias por confirmar tu email. Recibirás nuestras novedades y tu código del 10 % para la primera compra.
      </p>
      <Link href="/productos" className="btn-primary mt-8">
        Ver la colección
      </Link>
    </div>
  );
}
