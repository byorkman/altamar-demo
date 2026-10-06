import Link from "next/link";
import type { Product } from "@/data/products";
import { formatEUR } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
  const sale = product.originalPrice && product.originalPrice > product.price;
  const isNew = product.tags.includes("nueva-coleccion");
  return (
    <Link href={`/producto/${product.id}`} className="group block">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-sand-dark">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        {sale ? (
          <span className="absolute left-3 top-3 bg-terra px-2 py-1 text-[10px] font-semibold uppercase tracking-widest2 text-white">
            −{Math.round((1 - product.price / product.originalPrice!) * 100)}%
          </span>
        ) : isNew ? (
          <span className="absolute left-3 top-3 bg-white/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest2 text-ink">
            Nuevo
          </span>
        ) : null}
      </div>
      <div className="pt-3">
        <h3 className="font-sans text-sm text-ink group-hover:text-terra">{product.name}</h3>
        <p className="mt-0.5 text-xs text-ink/50">{product.color}</p>
        <div className="mt-1.5 flex items-baseline gap-2 text-sm">
          <span className={sale ? "font-semibold text-terra" : "font-semibold"}>{formatEUR(product.price)}</span>
          {sale && <span className="text-xs text-ink/40 line-through">{formatEUR(product.originalPrice!)}</span>}
        </div>
      </div>
    </Link>
  );
}
