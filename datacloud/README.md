# Altamar – Data 360

Configuración del conector web de Data 360 y del RFM para la demo Altamar.

## Archivos

- `altamar_schema.json`: esquema del conector (v2). Son los 12 eventTypes estándar del Website Connector (`catalog`, `cart`, `cartItem`, `order`, `orderItem`, `userEngagement`, `consentLog`, `identity`, `contactPointEmail`, `contactPointPhone`, `contactPointAddress`, `partyIdentification`) más los campos propios de Altamar.
- `altamar_sitemap.js`: sitemap que se pega en el editor del conector.
- `historico/generar.mjs`: genera el histórico sintético de 3.000 clientes para el RFM (ver más abajo).
- `rfm/altamar_rfm.sql`: SQL del Calculated Insight `Altamar_RFM`.

La v1 (eventTypes planos `Altamar_Engagement` / `Altamar_Profile`) queda en el historial de git.

## Cómo funciona

La web no llama directamente al SDK de Salesforce. Publica eventos de negocio en `window.altamarDataLayer` (`lib/tracking.ts`) y el sitemap los traduce a eventos de Data 360. Si el SDK carga tarde, los eventos esperan en la cola y no se pierde ninguno.

## Eventos

| Data layer | Interacción del SDK | eventTypes | Campos clave |
|---|---|---|---|
| `page_view` | View Page | userEngagement | pageType, pageCategory, pageTitle |
| `product_view` | ViewCatalogObject | catalog | id = SKU, attributeName, attributePrice, attributeCategory, attributeSubcategory, attributeColor |
| `add_to_cart` / `remove_from_cart` | AddToCart / RemoveFromCart | cart + cartItem | catalogObjectId = SKU, price, quantity |
| `order_completed` | Purchase | order + orderItem | orderId `ORD-…`, orderTotalValue **sin envío**, shippingCost, orderGrossValue (con envío) |
| `login` | Login | contactPointEmail + identity + partyIdentification | email, firstName, userId = customerId `ALT-…`, IDName `Altamar Customer Id`, IDType `Customer Id` |
| `newsletter_signup` | Newsletter Signup | contactPointEmail + userEngagement | email |

Todos los eventos de engagement llevan además `customerId` (si hay sesión iniciada) y `utmSource`, `utmMedium`, `utmCampaign`, que se calculan una vez por sesión. Para probar campañas abre la web con `?utm_source=instagram&utm_medium=paid&utm_campaign=verano26`.

## Puesta en marcha en Data 360

1. Setup → Websites & Mobile Apps → New → Website, con el nombre "Altamar Web v2".
2. Sube `altamar_schema.json`. Una vez subido solo se pueden añadir campos.
3. Pega `altamar_sitemap.js` en el editor de sitemap y guarda.
4. Copia la URL del script de la *Integration Guide* en `NEXT_PUBLIC_DATACLOUD_SITEMAP_URL` (Vercel) y vuelve a desplegar.
5. Crea los data streams (Engagement y Profile). En cada mapeo a un DMO pon un filtro por `eventType`: mapear el campo no filtra los registros.

| eventType | DMO | Mapeo |
|---|---|---|
| identity | Individual | deviceId → Individual Id, firstName → First Name, lastName → Last Name |
| contactPointEmail | Contact Point Email | deviceId → Id y Party, email → Email Address |
| partyIdentification | Party Identification | deviceId → Id y Party, userId → Identification Number, IDName → Identification Name, IDType → Party Identification Type |
| order | Product Order Engagement | eventId → Id, orderId → Sales Order, dateTime → Engagement DateTime, orderTotalValue → Net Order Amount, orderCurrency → Currency, deviceId → Individual |
| orderItem | Sales Order Product (opcional) | orderEventId → pedido, catalogObjectId → Product, quantity, totalPrice |

6. Identity Resolution con dos match rules: email exacto normalizado (Contact Point Email) y Party Identification exacta (Identification Number + Identification Name).

## Histórico sintético para el RFM

```bash
node datacloud/historico/generar.mjs --fecha-ref 2026-11-05
```

Crea en `datacloud/historico/salida/` (no se sube a git):

| Fichero | Se carga en | Columnas |
|---|---|---|
| `clientes.csv` | Individual, Contact Point Email y Party Identification | customer_id (Id y Party), first_name, last_name, email, id_name, id_type |
| `pedidos.csv` | Product Order Engagement | event_id, order_id, customer_id, order_datetime, order_amount (sin envío), currency |
| `lineas_pedido.csv` | Sales Order Product (opcional) | line_id, event_id, order_id, customer_id, sku, category, quantity, line_amount |
| `productos.csv` | Product | sku, name, category, subcategory, price, currency |
| `esperado_rfm.csv` | Nada: sirve para comprobar el CI | R, F, M y segmento esperados de cada cliente |

- Reparto: 241 Champions, 660 Leales, 360 Nuevos, 540 En riesgo y 1.199 Dormidos. El script recalcula cada cliente con las mismas reglas que el CI.
- Las fechas son relativas a `--fecha-ref` (hoy por defecto) y ninguna recencia queda a menos de 3 días de un umbral. Aun así, regenera y vuelve a cargar la víspera de la demo.
- El `customer_id` se calcula con el mismo hash que `lib/auth.ts`. **Lucía** (`lucia.martin@example.com`, Champions) está en el histórico: si inicia sesión en la web con ese email, su perfil web se unifica con su histórico.
- **Carmen** no está en el histórico: su primer pedido (60-120 €) se hace en la web antes de la demo, iniciando sesión con su email. Así queda como Nuevos (R5 F1 M2) y de paso se prueba la cadena completa.
- Los SKU son los mismos que envía la web (`ALT-W-1001`…), no el id de la URL.

## Notas

- El consentimiento de medición (purpose `Tracking`) está fijado en OptIn porque es una demo. En producción debe venir del banner de cookies (RGPD).
- Los campos extra de Altamar en `catalog`, `cart` y `order` viajan como campos de la interacción. Si alguno no llega, el evento estándar se registra igual.
