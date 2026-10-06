# Altamar – Data Cloud

Configuración del conector web de Data Cloud para la demo Altamar.

## Archivos

- `altamar_schema.json`: schema del conector, con `Altamar_Engagement` (Engagement) y `Altamar_Profile` (Profile).
- `altamar_sitemap.js`: sitemap que se pega en el editor del conector.

## Cómo funciona

La web no llama directamente al SDK de Salesforce. Publica eventos de negocio en `window.altamarDataLayer` (`lib/tracking.ts`) y el sitemap los traduce a eventos de Data Cloud. Si el SDK carga tarde, los eventos esperan en la cola y no se pierde ninguno.

## Eventos

| Evento | Schema | Cuándo | Campos principales |
|---|---|---|---|
| View Page | Engagement | Cada página que no sea ficha de producto | pageType, pageCategory, pageTitle, referrer, utm* |
| View Product | Engagement | Abrir una ficha | sku, productName, prodCategory, prodSubcategory, color, price |
| Add to Cart | Engagement | Añadir a la cesta o pulsar "+" | + size, quantity, lineTotal |
| Remove from Cart | Engagement | Pulsar "−" o "Eliminar" | + size, quantity, lineTotal |
| Order Completed | Engagement | Confirmar pedido | orderId, orderTotal, shippingCost, quantity |
| Order Line | Engagement | Una por producto del pedido | orderId, sku, size, quantity, lineTotal |
| Newsletter Signup | Engagement + Profile | Suscribirse en el pie de página | email, newsletterOptIn = 1 |
| Identity Login | Profile | Iniciar sesión | email, customerId, firstName, loyaltyTier |

`pageType` puede ser: `home`, `category`, `product`, `cart`, `checkout`, `login` o `content`.

Todos los eventos de Engagement llevan `customerId` cuando el visitante ha iniciado sesión, y el origen de la visita (`referrer`, `utmSource`, `utmMedium`, `utmCampaign`), que se calcula una vez por sesión. Para probar campañas abre la web con `?utm_source=instagram&utm_medium=paid&utm_campaign=verano26`.

## Puesta en marcha en Data Cloud

1. Setup → Websites & Mobile Apps → New → Website, con el nombre "Altamar".
2. Sube `altamar_schema.json`. Revísalo antes: una vez subido solo se pueden añadir campos.
3. Pega `altamar_sitemap.js` en el editor de sitemap y guarda.
4. Copia la URL del script de la *Integration Guide* en la variable `NEXT_PUBLIC_DATACLOUD_SITEMAP_URL` de Vercel y vuelve a desplegar.
5. Crea los data streams (Engagement y Profile) y mapéalos a los DMOs:
   - Profile → Individual (`deviceId` como Individual Id) + Contact Point Email.
   - Engagement → los DMOs de engagement (navegación, carrito y pedidos).
6. Configura Identity Resolution para unir el perfil anónimo (`deviceId`) con el conocido (`email` / `customerId`).

## Notas

- No uses nombres reservados del SDK como nombre de interacción (`Purchase`, `Add To Cart`, `View Catalog Object`…): el SDK descarta el evento sin dar error.
- El consentimiento está fijado en OptIn porque es una demo. En producción debe venir del banner de cookies (RGPD).
