"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CART_EVENT, cartSubtotal, changeQuantity, getCart, removeLine, type CartLine } from "@/lib/cart";
import { FREE_SHIPPING_FROM, SHIPPING_COST, formatEUR } from "@/data/products";

export default function CartPage() {
  const [lines, setLines] = useState<CartLine[] | null>(null);

  useEffect(() => {
    document.title = "Cesta · Altamar";
    const refresh = () => setLines(getCart());
    refresh();
    window.addEventListener(CART_EVENT, refresh);
    return () => window.removeEventListener(CART_EVENT, refresh);
  }, []);

  if (lines === null) return <div className="min-h-[50vh]" />;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-4xl">Tu cesta está vacía</h1>
        <p className="mt-3 text-ink/60">Descubre la nueva colección de verano.</p>
        <Link href="/productos" className="btn-primary mt-8">
          Ver colección
        </Link>
      </div>
    );
  }

  const subtotal = cartSubtotal(lines);
  const shipping = subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST;
  const missing = FREE_SHIPPING_FROM - subtotal;

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-12 md:grid-cols-3 md:px-8">
      <div className="md:col-span-2">
        <h1 className="text-4xl">Tu cesta</h1>
        <div className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
          {lines.map((l) => (
            <div key={`${l.productId}-${l.size}`} className="flex gap-4 py-5">
              <Link href={`/producto/${l.productId}`} className="h-32 w-24 shrink-0 overflow-hidden bg-sand-dark">
                <img src={l.image} alt={l.name} className="h-full w-full object-cover" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-4">
                  <p className="text-sm">{l.name}</p>
                  <p className="text-sm font-semibold">{formatEUR(l.price * l.quantity)}</p>
                </div>
                <p className="mt-1 text-xs text-ink/50">
                  {l.color} · Talla {l.size ?? "Única"}
                </p>
                <div className="mt-auto flex items-center gap-3 pt-3">
                  <div className="flex items-center border border-ink/20">
                    <button onClick={() => changeQuantity(l.productId, l.size, -1)} className="h-8 w-8" aria-label="Quitar uno">
                      −
                    </button>
                    <span className="w-6 text-center text-sm">{l.quantity}</span>
                    <button onClick={() => changeQuantity(l.productId, l.size, 1)} className="h-8 w-8" aria-label="Añadir uno">
                      +
                    </button>
                  </div>
                  <button onClick={() => removeLine(l.productId, l.size)} className="text-xs text-ink/50 underline hover:text-terra">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="h-fit bg-white p-6">
        <h2 className="text-xl">Resumen</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatEUR(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Envío</dt>
            <dd>{shipping === 0 ? "Gratis" : formatEUR(shipping)}</dd>
          </div>
          <div className="flex justify-between border-t border-ink/10 pt-3 text-base font-semibold">
            <dt>Total</dt>
            <dd>{formatEUR(subtotal + shipping)}</dd>
          </div>
        </dl>
        {missing > 0 && (
          <p className="mt-4 bg-sand p-3 text-xs">Te faltan {formatEUR(missing)} para el envío gratis.</p>
        )}
        <Link href="/checkout" className="btn-primary mt-6 w-full py-4 text-center">
          Tramitar pedido
        </Link>
        <p className="mt-3 text-center text-[11px] text-ink/50">IVA incluido</p>
      </aside>
    </div>
  );
}
