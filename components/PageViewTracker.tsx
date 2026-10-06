"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { track } from "@/lib/tracking";
import { getProduct } from "@/data/products";

function describe(pathname: string, cat: string | null) {
  if (pathname === "/") return { pageType: "home" };
  if (pathname === "/productos") return { pageType: "category", pageCategory: cat || "todo" };
  if (pathname.startsWith("/producto/")) {
    const p = getProduct(pathname.split("/")[2]);
    return { pageType: "product", pageCategory: p?.category };
  }
  if (pathname === "/carrito") return { pageType: "cart" };
  if (pathname === "/checkout") return { pageType: "checkout" };
  if (pathname === "/login") return { pageType: "login" };
  if (pathname === "/nosotros") return { pageType: "content" };
  return { pageType: "other" };
}

/** Publica un page_view en el data layer en cada navegación (también las de cliente). */
export default function PageViewTracker() {
  const pathname = usePathname();
  const params = useSearchParams();
  const query = params.toString();

  useEffect(() => {
    // Esperar a que Next.js actualice el <title> de la nueva página
    const t = setTimeout(() => {
      track({
        event: "page_view",
        ...describe(pathname, params.get("cat")),
        pageTitle: document.title,
        url: window.location.href
      });
    }, 50);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, query]);

  return null;
}
