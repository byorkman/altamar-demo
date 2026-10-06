import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getRelated, products } from "@/data/products";
import ProductDetail from "./ProductDetail";
import ProductJsonLd from "@/components/ProductJsonLd";
import ProductRow from "@/components/ProductRow";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const p = getProduct(params.id);
  return p ? { title: `${p.name} · Altamar`, description: p.description } : {};
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProduct(params.id);
  if (!product) notFound();

  return (
    <>
      <ProductJsonLd product={product} baseUrl={BASE_URL} />
      <ProductDetail product={product} />
      <ProductRow eyebrow="Completa el look" title="También te puede gustar" products={getRelated(product.id)} />
    </>
  );
}
