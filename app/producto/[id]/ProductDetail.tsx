"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/data/products";
import { CATEGORY_LABELS, FREE_SHIPPING_FROM, formatEUR } from "@/data/products";
import { addToCart } from "@/lib/cart";
import { rememberCategory } from "@/lib/interests";
import { toTracked, track } from "@/lib/tracking";

export default function ProductDetail({ product }: { product: Product }) {
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [added, setAdded] = useState(false);
  const [needSize, setNeedSize] = useState(false);
  const sale = product.originalPrice && product.originalPrice > product.price;

  useEffect(() => {
    track({ event: "product_view", product: toTracked(product) });
    rememberCategory(product.category);
  }, [product]);

  const handleAdd = () => {
    if (!size) {
      setNeedSize(true);
      return;
    }
    addToCart(product, size, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-10 md:grid-cols-2 md:gap-16 md:px-8">
      <div className="aspect-[4/5] overflow-hidden bg-sand-dark">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
      </div>
      <div className="md:py-6">
        <nav className="text-xs text-ink/50">
          <Link href={`/productos?cat=${product.category}`} className="hover:text-terra">
            {CATEGORY_LABELS[product.category]}
          </Link>{" "}
          / <span className="capitalize">{product.subcategory}</span>
        </nav>
        <h1 className="mt-3 text-3xl md:text-4xl">{product.name}</h1>
        <div className="mt-4 flex items-baseline gap-3">
          <p className={`text-2xl ${sale ? "text-terra" : ""}`}>{formatEUR(product.price)}</p>
          {sale && <p className="text-base text-ink/40 line-through">{formatEUR(product.originalPrice!)}</p>}
        </div>
        <p className="mt-6 leading-relaxed text-ink/75">{product.description}</p>

        <p className="mt-8 text-xs uppercase tracking-widest2">
          Color: <span className="normal-case tracking-normal text-ink/70">{product.color}</span>
        </p>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-widest2">
            <span>Talla</span>
            <span className="normal-case tracking-normal text-ink/50 underline">Guía de tallas</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSize(s);
                  setNeedSize(false);
                }}
                className={
                  "min-w-[3.25rem] border px-3 py-2.5 text-sm transition " +
                  (size === s ? "border-ink bg-ink text-white" : "border-ink/20 bg-white hover:border-ink")
                }
              >
                {s}
              </button>
            ))}
          </div>
          {needSize && <p className="mt-2 text-xs text-terra">Selecciona una talla</p>}
        </div>

        <button onClick={handleAdd} className="btn-primary mt-8 w-full py-4">
          {added ? "Añadido a la cesta ✓" : "Añadir a la cesta"}
        </button>

        <ul className="mt-6 space-y-1.5 text-xs text-ink/60">
          <li>✓ Envío gratis desde {formatEUR(FREE_SHIPPING_FROM)}</li>
          <li>✓ Entrega en 24-48 h en península</li>
          <li>✓ Devoluciones gratuitas durante 30 días</li>
        </ul>

        <div className="demo-note mt-8">
          <p className="font-semibold">Demo Data Cloud</p>
          <p className="mt-1">
            Al abrir esta ficha se envía <code>View Product</code> con SKU {product.sku}. Al añadir a la cesta,{" "}
            <code>Add to Cart</code> con talla y cantidad.
          </p>
        </div>
      </div>
    </section>
  );
}
