import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { CATEGORY_LABELS, byCategory, type Category } from "@/data/products";

const CATS: (Category | "todo")[] = ["todo", "mujer", "hombre", "ninos", "accesorios"];

export function generateMetadata({ searchParams }: { searchParams: { cat?: string } }): Metadata {
  const cat = searchParams.cat as Category | undefined;
  return { title: `${cat && CATEGORY_LABELS[cat] ? CATEGORY_LABELS[cat] : "Toda la colección"} · Altamar` };
}

export default function ProductsPage({ searchParams }: { searchParams: { cat?: string } }) {
  const active = searchParams.cat && searchParams.cat in CATEGORY_LABELS ? (searchParams.cat as Category) : undefined;
  const items = byCategory(active);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Colección Verano 2026</p>
          <h1 className="mt-2 text-4xl md:text-5xl">{active ? CATEGORY_LABELS[active] : "Toda la colección"}</h1>
          <p className="mt-2 text-sm text-ink/50">{items.length} productos</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wider">
          {CATS.map((c) => {
            const isActive = c === "todo" ? !active : active === c;
            return (
              <Link
                key={c}
                href={c === "todo" ? "/productos" : `/productos?cat=${c}`}
                className={
                  "border px-4 py-2 transition " +
                  (isActive ? "border-ink bg-ink text-white" : "border-ink/20 hover:border-ink")
                }
              >
                {c === "todo" ? "Todo" : CATEGORY_LABELS[c]}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
