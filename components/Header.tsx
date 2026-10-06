"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CART_EVENT, cartCount, getCart } from "@/lib/cart";
import { USER_EVENT, getUser, logout, type DemoUser } from "@/lib/auth";
import Logo from "./Logo";

const nav = [
  { href: "/productos?cat=mujer", label: "Mujer" },
  { href: "/productos?cat=hombre", label: "Hombre" },
  { href: "/productos?cat=ninos", label: "Niños" },
  { href: "/productos?cat=accesorios", label: "Accesorios" },
  { href: "/nosotros", label: "Nosotros" }
];

const strip = [
  "Envío gratis en pedidos desde 50 €",
  "Devoluciones gratuitas durante 30 días",
  "Paga en 3 plazos sin intereses"
];

export default function Header() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState<DemoUser | null>(null);
  const [stripIdx, setStripIdx] = useState(0);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const refresh = () => {
      setCount(cartCount(getCart()));
      setUser(getUser());
    };
    refresh();
    window.addEventListener(CART_EVENT, refresh);
    window.addEventListener(USER_EVENT, refresh);
    const t = setInterval(() => setStripIdx((i) => (i + 1) % strip.length), 4000);
    return () => {
      window.removeEventListener(CART_EVENT, refresh);
      window.removeEventListener(USER_EVENT, refresh);
      clearInterval(t);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-sand/95 backdrop-blur">
      <div className="bg-ink text-white">
        <p className="mx-auto max-w-7xl px-4 py-2 text-center text-[11px] uppercase tracking-widest2">{strip[stripIdx]}</p>
      </div>
      <div className="border-b border-ink/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <button
            className="-ml-1 p-1 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Abrir menú"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <Link href="/" aria-label="Altamar, inicio">
            <Logo />
          </Link>
          <nav className="hidden gap-8 text-[13px] uppercase tracking-wider md:flex">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="hover:text-terra">
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4 text-sm">
            {user ? (
              <div className="hidden items-center gap-3 md:flex">
                <span className="text-ink/70">Hola, {user.firstName}</span>
                <button onClick={logout} className="text-xs uppercase tracking-wider text-ink/50 hover:text-terra">
                  Salir
                </button>
              </div>
            ) : (
              <Link href="/login" className="hidden text-xs uppercase tracking-wider hover:text-terra md:inline">
                Iniciar sesión
              </Link>
            )}
            <Link href="/carrito" className="relative flex items-center gap-2 text-xs uppercase tracking-wider hover:text-terra">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M5 8h14l-1.2 12H6.2L5 8Z" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
              <span className="hidden sm:inline">Cesta</span>
              {count > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-terra px-1.5 text-[10px] font-semibold text-white">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
        {open && (
          <nav className="border-t border-ink/10 px-4 pb-4 md:hidden">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="block py-3 text-sm uppercase tracking-wider">
                {n.label}
              </Link>
            ))}
            {user ? (
              <button onClick={logout} className="py-3 text-sm uppercase tracking-wider text-ink/60">
                Salir ({user.firstName})
              </button>
            ) : (
              <Link href="/login" className="block py-3 text-sm uppercase tracking-wider">
                Iniciar sesión
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
