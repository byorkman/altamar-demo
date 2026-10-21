import type { Metadata } from "next";
import Confirmar from "./Confirmar";

export const metadata: Metadata = { title: "Confirmar suscripción · Altamar", robots: { index: false } };

/**
 * Página de destino del enlace del email de doble opt-in.
 * El enlace lleva el email y el Id del Lead como merge fields: /registro/confirmado?e=...&l=...
 */
export default function ConfirmadoPage({ searchParams }: { searchParams: { e?: string; l?: string } }) {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <p className="eyebrow">Club Altamar</p>
      {/* El merge field no codifica el email: un "+" (alias de Gmail) llega como espacio. */}
      <Confirmar email={(searchParams.e ?? "").replace(/ /g, "+")} leadId={searchParams.l ?? ""} />
    </div>
  );
}
