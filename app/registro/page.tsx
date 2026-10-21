"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { login } from "@/lib/auth";

type Errors = Partial<Record<"firstName" | "lastName" | "email" | "privacyAccepted", string>>;

const input = "mt-1 w-full border border-ink/20 bg-white px-3 py-2.5 focus:border-ink focus:outline-none";

export default function RegistroPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", website: "" });
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ email: string; marketingConsent: boolean } | null>(null);

  useEffect(() => {
    document.title = "Crear cuenta · Altamar";
  }, []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setErrors({});
    setError("");
    try {
      const res = await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, marketingConsent, privacyAccepted })
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        if (json.errors) setErrors(json.errors);
        setError(json.error || "Revisa los campos marcados.");
        return;
      }
      // La cuenta existe: se identifica al visitante para que Data 360 una su navegación anónima con el perfil.
      login(form.email, form.firstName);
      setDone({ email: form.email.trim().toLowerCase(), marketingConsent });
    } catch {
      setError("No hemos podido conectar. Inténtalo de nuevo.");
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <p className="eyebrow">Club Altamar</p>
        <h1 className="mt-2 text-4xl">Cuenta creada</h1>
        <p className="mt-4 text-sm text-ink/70">
          Te hemos enviado un email a <strong>{done.email}</strong>. Pulsa el enlace para confirmar tu cuenta.
        </p>
        {done.marketingConsent && (
          <p className="mt-2 text-sm text-ink/70">Al confirmarla quedarás suscrito a nuestras novedades y recibirás tu 10 % de bienvenida.</p>
        )}
        <Link href="/" className="btn-primary mt-8">
          Seguir comprando
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <p className="eyebrow">Club Altamar</p>
      <h1 className="mt-2 text-4xl">Crea tu cuenta</h1>
      <form onSubmit={submit} noValidate className="mt-8 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs uppercase tracking-widest2">Nombre</span>
            <input value={form.firstName} onChange={set("firstName")} autoComplete="given-name" className={input} />
            {errors.firstName && <span className="mt-1 block text-xs text-terra">{errors.firstName}</span>}
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest2">Apellidos</span>
            <input value={form.lastName} onChange={set("lastName")} autoComplete="family-name" className={input} />
            {errors.lastName && <span className="mt-1 block text-xs text-terra">{errors.lastName}</span>}
          </label>
        </div>
        <label className="block">
          <span className="text-xs uppercase tracking-widest2">Email</span>
          <input type="email" value={form.email} onChange={set("email")} autoComplete="email" className={input} />
          {errors.email && <span className="mt-1 block text-xs text-terra">{errors.email}</span>}
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-widest2">Teléfono (opcional)</span>
          <input type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" className={input} />
        </label>
        {/* Honeypot anti-bots: oculto para personas */}
        <input
          type="text"
          name="website"
          value={form.website}
          onChange={set("website")}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" checked={marketingConsent} onChange={(e) => setMarketingConsent(e.target.checked)} className="mt-1" />
          <span>Quiero recibir novedades y ofertas de Altamar por email.</span>
        </label>
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" checked={privacyAccepted} onChange={(e) => setPrivacyAccepted(e.target.checked)} className="mt-1" />
          <span>
            He leído y acepto la <Link href="/nosotros" className="underline">política de privacidad</Link>.
          </span>
        </label>
        {errors.privacyAccepted && <p className="text-xs text-terra">{errors.privacyAccepted}</p>}
        {error && <p className="text-sm text-terra">{error}</p>}
        <button type="submit" disabled={sending} className="btn-primary w-full py-4 disabled:opacity-60">
          {sending ? "Enviando…" : "Crear cuenta"}
        </button>
      </form>
      <div className="demo-note mt-8">
        <p className="font-semibold">Demo Marketing Cloud Next</p>
        <p className="mt-1">
          El formulario llama a <code>/api/registro</code>, que envía los datos al Form Handler de Marketing Cloud Next. Su Flow
          crea el Lead y, si se marcó la casilla, manda el email de doble opt-in. El consentimiento solo pasa a Opt In al pulsar el
          enlace.
        </p>
      </div>
    </div>
  );
}
