"use client";

import { useState } from "react";
import { track } from "@/lib/tracking";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    track({ event: "newsletter_signup", email: email.trim().toLowerCase() });
    setDone(true);
  };

  return (
    <section className="bg-sea text-white">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-16 text-center">
        <p className="text-[11px] uppercase tracking-widest2 text-white/70">Club Altamar</p>
        <h3 className="mt-3 text-3xl md:text-4xl">10 % en tu primera compra</h3>
        <p className="mt-3 text-sm text-white/80">Novedades, colecciones cápsula y acceso anticipado a rebajas.</p>
        {done ? (
          <p className="mt-6 text-sm">¡Gracias! Revisa tu correo para confirmar la suscripción.</p>
        ) : (
          <form onSubmit={submit} className="mt-6 flex w-full max-w-md flex-col gap-2 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu email"
              className="flex-1 border border-white/40 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/60 focus:border-white focus:outline-none"
            />
            <button type="submit" className="bg-white px-6 py-3 text-[11px] font-semibold uppercase tracking-widest2 text-ink hover:bg-terra hover:text-white">
              Suscribirme
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
