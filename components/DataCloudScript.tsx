import Script from "next/script";

/**
 * Carga el Data Cloud Web SDK (incluye el sitemap configurado en el conector).
 * Sin NEXT_PUBLIC_DATACLOUD_SITEMAP_URL la web funciona igual y no envía nada.
 */
export default function DataCloudScript() {
  const src = process.env.NEXT_PUBLIC_DATACLOUD_SITEMAP_URL;
  if (!src) return null;
  return <Script src={src} strategy="afterInteractive" id="sf-datacloud" />;
}
