import type { MetadataRoute } from "next";
import { products } from "@/data/products";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/productos", "/productos?cat=mujer", "/productos?cat=hombre", "/productos?cat=ninos", "/productos?cat=accesorios", "/nosotros"];
  return [
    ...pages.map((p) => ({ url: `${BASE_URL}${p}`, lastModified: now })),
    ...products.map((p) => ({ url: `${BASE_URL}/producto/${p.id}`, lastModified: now }))
  ];
}
