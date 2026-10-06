"use client";

/**
 * Data layer de Altamar.
 *
 * La web NO llama directamente al SDK de Salesforce. Solo publica eventos de negocio
 * en `window.altamarDataLayer`. El sitemap de Data Cloud (datacloud/altamar_sitemap.js)
 * lee esa cola y la traduce a eventos del Interactions SDK.
 *
 * Ventaja: si el script de Data Cloud carga tarde, los eventos esperan en la cola
 * y no se pierde ninguno.
 */

export type DataLayerEvent =
  | { event: "page_view"; pageType: string; pageCategory?: string; pageTitle: string; url: string }
  | { event: "product_view"; product: TrackedProduct }
  | { event: "add_to_cart"; product: TrackedProduct; quantity: number; size?: string }
  | { event: "remove_from_cart"; product: TrackedProduct; quantity: number; size?: string }
  | { event: "login"; user: { email: string; customerId: string; firstName: string; lastName?: string; loyaltyTier?: string } }
  | { event: "newsletter_signup"; email: string }
  | {
      event: "order_completed";
      order: { orderId: string; total: number; shipping: number; currency: string; items: (TrackedProduct & { quantity: number; size?: string })[] };
    };

export type TrackedProduct = {
  sku: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  currency: string;
  color?: string;
};

declare global {
  interface Window {
    altamarDataLayer?: DataLayerEvent[];
  }
}

export function track(e: DataLayerEvent) {
  if (typeof window === "undefined") return;
  window.altamarDataLayer = window.altamarDataLayer || [];
  window.altamarDataLayer.push(e);
  if (process.env.NODE_ENV !== "production") console.info("[altamar] dataLayer", e);
}

export function toTracked(p: {
  sku: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  currency: string;
  color?: string;
}): TrackedProduct {
  return {
    sku: p.sku,
    name: p.name,
    category: p.category,
    subcategory: p.subcategory,
    price: p.price,
    currency: p.currency,
    color: p.color
  };
}
