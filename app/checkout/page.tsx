"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cartSubtotal, clearCart, getCart, type CartLine } from "@/lib/cart";
import { USER_EVENT, getUser, type DemoUser } from "@/lib/auth";
import { FREE_SHIPPING_FROM, SHIPPING_COST, formatEUR } from "@/data/products";
import { toTracked, track } from "@/lib/tracking";

function newOrderId() {
  return "ALT-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function CheckoutPage() {
  const [lines, setLines] = useState<CartLine[] | null>(null);
  const [user, setUser] = useState<DemoUser | null>(null);
  const [placed, setPlaced] = useState<{ id: string; total: number; count: number } | null>(null);

  useEffect(() => {
    document.title = "Finalizar compra · Altamar";
    setLines(getCart());
    const refresh = () => setUser(getUser());
    refresh();
    window.addEventListener(USER_EVENT, refresh);
    return () => window.removeEventListener(USER_EVENT, refresh);
  }, []);

  if (lines === null) return <div className="min-h-[50vh]" />;

  const subtotal = cartSubtotal(lines);
  const shipping = subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST;
  const total = Math.round((subtotal + shipping) * 100) / 100;

  const placeOrder = () => {
    const id = newOrderId();
    track({
      event: "order_completed",
      order: {
        orderId: id,
        total,
        shipping,
        currency: "EUR",
        items: lines.map((l) => ({ ...toTracked(l), quantity: l.quantity, size: l.size }))
      }
    });
    clearCart();
    setPlaced({ id, total, count: lines.reduce((s, l) => s + l.quantity, 0) });
  };

  if (placed) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="eyebrow">Pedido confirmado</p>
        <h1 className="mt-3 text-4xl md:text-5xl">¡Gracias, {user?.firstName}!</h1>
        <p className="mt-4 text-ink/70">
          Tu pedido <strong>{placed.id}</strong> está en camino. Te hemos enviado la confirmación a {user?.email}.
        </p>
        <div className="demo-note mt-8 text-left">
          <p className="font-semibold">Demo Data Cloud</p>
          <p className="mt-1">
            Se ha enviado <code>Order Completed</code> ({placed.count} {placed.count === 1 ? "unidad" : "unidades"} · {formatEUR(placed.total)}) y un evento{" "}
            <code>Order Line</code> por cada producto.
          </p>
        </div>
        <Link href="/productos" className="btn-primary mt-10">
          Seguir comprando
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-3xl">No hay productos en tu cesta</h1>
        <Link href="/productos" className="btn-primary mt-8">
          Ver colección
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-8">
      <h1 className="text-4xl">Finalizar compra</h1>

      {user ? (
        <div className="mt-8 bg-white p-6 text-sm">
          <p className="text-xs uppercase tracking-widest2 text-ink/50">Cliente</p>
          <p className="mt-2">
            {user.firstName} · {user.email}
          </p>
          <p className="mt-1 text-xs text-ink/50">
            Club Altamar · nivel {user.loyaltyTier} · {user.customerId}
          </p>
        </div>
      ) : (
        <div className="mt-8 border border-terra/40 bg-terra/5 p-5 text-sm">
          <p className="font-semibold">Inicia sesión para completar tu pedido</p>
          <p className="mt-1 text-ink/70">
            Así unimos tu navegación anónima con tu perfil de cliente.{" "}
            <Link href="/login?next=/checkout" className="underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      )}

      <div className="mt-6 bg-white p-6">
        <h2 className="text-xl">Tu pedido</h2>
        <ul className="mt-4 divide-y divide-ink/10 text-sm">
          {lines.map((l) => (
            <li key={`${l.productId}-${l.size}`} className="flex justify-between gap-4 py-2.5">
              <span>
                {l.name} × {l.quantity} <span className="text-ink/40">({l.size ?? "Única"})</span>
              </span>
              <span>{formatEUR(l.price * l.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-1.5 border-t border-ink/10 pt-4 text-sm">
          <div className="flex justify-between">
            <dt>Envío</dt>
            <dd>{shipping === 0 ? "Gratis" : formatEUR(shipping)}</dd>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <dt>Total (IVA incl.)</dt>
            <dd>{formatEUR(total)}</dd>
          </div>
        </dl>
      </div>

      <button onClick={placeOrder} disabled={!user} className="btn-primary mt-6 w-full py-4 disabled:cursor-not-allowed disabled:opacity-40">
        Confirmar pedido
      </button>
      <p className="mt-3 text-center text-[11px] text-ink/50">Demo: no se realiza ningún cobro.</p>
    </div>
  );
}
