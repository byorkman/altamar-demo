"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { login } from "@/lib/auth";

function LoginForm() {
  const router = useRouter();
  const next = useSearchParams().get("next") || "/";
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    document.title = "Iniciar sesión · Altamar";
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email, name);
    router.push(next);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <p className="eyebrow">Club Altamar</p>
      <h1 className="mt-2 text-4xl">Inicia sesión</h1>
      <p className="mt-3 text-sm text-ink/60">Para la demo basta con un email: no hay contraseña.</p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-xs uppercase tracking-widest2">Nombre</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border border-ink/20 bg-white px-3 py-2.5 focus:border-ink focus:outline-none"
            placeholder="Lucía"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-widest2">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border border-ink/20 bg-white px-3 py-2.5 focus:border-ink focus:outline-none"
            placeholder="lucia@example.com"
          />
        </label>
        <button type="submit" className="btn-primary w-full py-4">
          Entrar
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-ink/70">
        ¿Aún no tienes cuenta? <Link href="/registro" className="underline">Crea una</Link>
      </p>
      <div className="demo-note mt-8">
        <p className="font-semibold">Demo Data Cloud</p>
        <p className="mt-1">
          Al entrar se envían <code>contactPointEmail</code>, <code>identity</code> y <code>partyIdentification</code> con email y customerId. Data Cloud une la navegación anónima de este
          dispositivo con el perfil del cliente.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh]" />}>
      <LoginForm />
    </Suspense>
  );
}
