import type { Metadata } from "next";
import Confirmar from "./Confirmar";

export const metadata: Metadata = { title: "Confirmar cuenta · Altamar", robots: { index: false } };

/**
 * Página de destino del enlace del email de doble opt-in.
 * El enlace lleva el email y el Id del Lead como merge fields: /registro/confirmado?e=...&l=...
 */
/**
 * MC Next añade a los enlaces un `sftoken` (JWT) cuyo `individualId` es el Id del Lead.
 * Se usa si el enlace no trae `l`. No se verifica la firma: el Flow de confirmación
 * solo marca el Opt In si ese Id y el email pertenecen al mismo Lead.
 */
function leadIdFromSfToken(token?: string): string {
  try {
    const payload = JSON.parse(Buffer.from(token?.split(".")[1] ?? "", "base64url").toString("utf8"));
    return typeof payload.individualId === "string" ? payload.individualId : "";
  } catch {
    return "";
  }
}

export default function ConfirmadoPage({ searchParams }: { searchParams: { e?: string; l?: string; sftoken?: string } }) {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <p className="eyebrow">Club Altamar</p>
      {/* El merge field no codifica el email: un "+" (alias de Gmail) llega como espacio. */}
      <Confirmar email={(searchParams.e ?? "").replace(/ /g, "+")} leadId={searchParams.l || leadIdFromSfToken(searchParams.sftoken)} />
    </div>
  );
}
