# Altamar · demo de ecommerce para Salesforce Data Cloud

Tienda online de una marca de moda **ficticia** (Altamar, moda mediterránea) para presentar Salesforce Data Cloud a clientes del sector retail/moda.

- Next.js 14 + Tailwind, sin backend: la cesta y el usuario se guardan en el navegador.
- 36 productos (mujer, hombre, niños y accesorios), precios en euros, textos para España.
- Seguimiento completo para Data Cloud: navegación, producto, cesta, login, newsletter y pedidos con líneas. Ver [`datacloud/README.md`](./datacloud/README.md).
- Personalización visible en la propia web:
  - El banner principal cambia al iniciar sesión ("{Nombre}, tu acceso anticipado…").
  - La home muestra "Seleccionado para ti" según la categoría que más ha mirado el visitante.

## Arrancar en local

```bash
npm install
cp .env.local.example .env.local   # opcional: URL del script de Data Cloud
npm run dev
```

Sin `NEXT_PUBLIC_DATACLOUD_SITEMAP_URL` la web funciona igual y no envía eventos. En desarrollo, cada evento del data layer se muestra en la consola del navegador.

## Publicar en Vercel

1. Importa el repositorio en Vercel (preset Next.js, sin cambiar nada).
2. Variables de entorno:
   - `NEXT_PUBLIC_DATACLOUD_SITEMAP_URL`: URL del script del conector web de Data Cloud.
   - `NEXT_PUBLIC_SITE_URL`: URL pública, por ejemplo `https://altamar-demo.vercel.app`.
3. Deploy.

## Guion de demo sugerido (5 minutos)

1. **Visitante anónimo**: entra desde una campaña (`/?utm_source=instagram&utm_medium=paid&utm_campaign=verano26`), navega por Mujer y abre 2 o 3 vestidos.
2. Vuelve a la home: aparece **"Seleccionado para ti · Porque te interesa Mujer"**.
3. Añade un producto a la cesta y ve a "Tramitar pedido": la web pide iniciar sesión.
4. **Login** con nombre y email: el banner principal se personaliza y Data Cloud une la navegación anónima con el perfil.
5. **Confirma el pedido**: llegan `Order Completed` y una `Order Line` por producto.
6. En Data Cloud, muestra el perfil unificado en Profile Explorer con su navegación, su origen de campaña y su compra, y crea un segmento, por ejemplo "vio Mujer, añadió a la cesta y no compró en 7 días".

## Estructura

```
app/                 páginas: home, productos, producto/[id], carrito, checkout, login, nosotros
components/          Header, Footer, HeroBanner, ProductCard, ProductRow, ForYou, PageViewTracker…
data/products.ts     catálogo de 36 productos
lib/tracking.ts      data layer (window.altamarDataLayer)
lib/cart.ts          cesta en localStorage
lib/auth.ts          login de demo (sin contraseña), customerId estable por email
datacloud/           schema y sitemap del conector web de Data Cloud
```

## Créditos

Altamar es una marca inventada. Las fotografías son de [Unsplash](https://unsplash.com) (licencia Unsplash, uso comercial permitido) y se cargan desde su CDN.
