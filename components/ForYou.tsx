"use client";

import { useEffect, useState } from "react";
import { CATEGORY_LABELS, byCategory, type Product } from "@/data/products";
import { topCategory } from "@/lib/interests";
import ProductRow from "./ProductRow";

/** "Inspirado en lo que has visto": aparece cuando el visitante ya ha mirado productos. */
export default function ForYou() {
  const [state, setState] = useState<{ label: string; items: Product[]; href: string } | null>(null);

  useEffect(() => {
    const cat = topCategory();
    if (!cat) return;
    setState({
      label: CATEGORY_LABELS[cat],
      items: byCategory(cat).slice(-4).reverse(),
      href: `/productos?cat=${cat}`
    });
  }, []);

  if (!state) return null;
  return <ProductRow eyebrow={`Porque te interesa ${state.label}`} title="Seleccionado para ti" products={state.items} href={state.href} />;
}
