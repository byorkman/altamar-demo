import Link from "next/link";
import type { Product } from "@/data/products";
import ProductCard from "./ProductCard";

export default function ProductRow({
  eyebrow,
  title,
  products,
  href
}: {
  eyebrow?: string;
  title: string;
  products: Product[];
  href?: string;
}) {
  if (products.length === 0) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 className="mt-2 text-3xl md:text-4xl">{title}</h2>
        </div>
        {href && (
          <Link href={href} className="shrink-0 border-b border-ink pb-0.5 text-xs uppercase tracking-widest2 hover:border-terra hover:text-terra">
            Ver todo
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
