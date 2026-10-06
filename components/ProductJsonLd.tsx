import type { Product } from "@/data/products";

/** schema.org/Product en cada ficha: lo leen Google y los crawlers de catálogo. */
export default function ProductJsonLd({ product, baseUrl }: { product: Product; baseUrl: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    productID: product.id,
    sku: product.sku,
    name: product.name,
    description: product.description,
    image: [product.image],
    brand: { "@type": "Brand", name: "Altamar" },
    category: `${product.category}/${product.subcategory}`,
    color: product.color,
    keywords: product.tags.join(", "),
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/producto/${product.id}`,
      priceCurrency: product.currency,
      price: product.price,
      availability: "https://schema.org/InStock"
    }
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
