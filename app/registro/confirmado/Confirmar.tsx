"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type State = "sending" | "ok" | "error";

/** Avisa a Salesforce de la confirmación en cuanto se abre la página desde el email. */
export default function Confirmar({ email, leadId }: { email: string; leadId: string }) {
  const [state, setState] = useState<State>(email && leadId ? "sending" : "error");

  useEffect(() => {
    if (!email || !leadId) return;
    fetch("/api/registro/confirmar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, leadId })
    })
      .then((res) => setState(res.ok ? "ok" : "error"))
      .catch(() => setState("error"));
  }, [email, leadId]);

  if (state === "sending") {
    return <p className="mt-4 text-sm text-ink/70">Confirmando tu cuenta…</p>;
  }

  if (state === "error") {
    return (
      <>
        <h1 className="mt-2 text-4xl">No hemos podido confirmar</h1>
        <p className="mt-4 text-sm text-ink/70">
          El enlace no es válido o ha habido un problema. Vuelve a pulsar el botón del email o regístrate de nuevo.
        </p>
        <Link href="/registro" className="btn-primary mt-8">
          Ir al registro
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="mt-2 text-4xl">¡Cuenta confirmada!</h1>
      <p className="mt-4 text-sm text-ink/70">
        Gracias por confirmar tu email. Ya puedes comprar con tu cuenta y, si elegiste recibir novedades, te llegarán a partir de ahora.
      </p>
      <Link href="/productos" className="btn-primary mt-8">
        Ver la colección
      </Link>
    </>
  );
}
