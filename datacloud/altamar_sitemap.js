/**
 * Sitemap Altamar Demo v2 - Data 360 (Salesforce Interactions SDK)
 * Se pega en el editor de sitemap del conector web "Altamar Web v2".
 *
 * La web publica eventos de negocio en window.altamarDataLayer (ver lib/tracking.ts).
 * Este sitemap lee esa cola, incluidos los eventos que llegaron antes de que cargara
 * el SDK, y los envía con los eventTypes estándar del conector
 * (datacloud/altamar_schema.json, el esquema de 12 eventos + campos Altamar):
 *
 *  - page_view ........ userEngagement  (View Page)
 *  - product_view ..... catalog         (ViewCatalogObject)
 *  - add_to_cart ...... cart + cartItem (AddToCart)
 *  - remove_from_cart . cart + cartItem (RemoveFromCart)
 *  - order_completed .. order + orderItem (Purchase). totalValue = productos SIN envío,
 *                       que es lo que mide el Monetario del RFM.
 *  - login ............ contactPointEmail + identity (Login) + partyIdentification
 *                       con userId = customerId (ALT-XXXXXXXX), el mismo IDName e
 *                       IDType que el histórico (datacloud/historico).
 *  - newsletter_signup  contactPointEmail + userEngagement (Newsletter Signup)
 *
 * eventId, deviceId, sessionId, dateTime y category los rellena el SDK.
 */

(function () {
    const SI = window.SalesforceInteractions;
    const CURRENCY = "EUR";
    const ID_NAME = "Altamar Customer Id";
    const ID_TYPE = "Customer Id";

    const clean = (obj) =>
        Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== ""));

    const round2 = (n) => Math.round(n * 100) / 100;

    function currentUser() {
        try {
            return JSON.parse(localStorage.getItem("altamar_user") || "null");
        } catch (e) {
            return null;
        }
    }

    // Origen de la visita (UTM y referrer), guardado para toda la sesión
    function trafficSource() {
        const KEY = "altamar_traffic";
        try {
            const saved = sessionStorage.getItem(KEY);
            if (saved) return JSON.parse(saved);
            const p = new URLSearchParams(window.location.search);
            const src = clean({
                utmSource: p.get("utm_source"),
                utmMedium: p.get("utm_medium"),
                utmCampaign: p.get("utm_campaign")
            });
            sessionStorage.setItem(KEY, JSON.stringify(src));
            return src;
        } catch (e) {
            return {};
        }
    }

    let page = {}; // contexto de la última página vista

    // Campos Altamar que viajan en todos los eventos de engagement
    function context() {
        const user = currentUser();
        return clean({ ...page, ...trafficSource(), customerId: user && user.customerId });
    }

    function send(event) {
        try {
            return SI.sendEvent(event);
        } catch (err) {
            console.warn("[altamar] sendEvent", err);
        }
    }

    function engagement(name, fields) {
        return send({ interaction: clean({ name, eventType: "userEngagement", ...context(), ...fields }) });
    }

    const lineItem = (item, quantity) => ({
        catalogObjectType: "Product",
        catalogObjectId: item.sku,
        price: item.price,
        quantity,
        currency: item.currency || CURRENCY
    });

    const handlers = {
        page_view(e) {
            page = clean({ pageType: e.pageType, pageCategory: e.pageCategory, pageTitle: e.pageTitle });
            // En las fichas de producto se envía ViewCatalogObject (con este mismo contexto de página)
            if (e.pageType !== "product") engagement("View Page", {});
        },

        product_view(e) {
            const p = e.product;
            // product_view puede llegar antes que el page_view de la ficha: fijamos aquí el contexto
            page = clean({ pageType: "product", pageCategory: p.category, pageTitle: document.title });
            send({
                interaction: {
                    name: SI.CatalogObjectInteractionName.ViewCatalogObject,
                    ...context(),
                    catalogObject: {
                        type: "Product",
                        id: p.sku,
                        attributes: clean({
                            name: p.name,
                            price: p.price,
                            category: p.category,
                            subcategory: p.subcategory,
                            color: p.color
                        })
                    }
                }
            });
        },

        add_to_cart(e) {
            send({
                interaction: { name: SI.CartInteractionName.AddToCart, ...context(), lineItem: lineItem(e.product, e.quantity) }
            });
        },

        remove_from_cart(e) {
            send({
                interaction: { name: SI.CartInteractionName.RemoveFromCart, ...context(), lineItem: lineItem(e.product, e.quantity) }
            });
        },

        login(e) {
            const u = e.user;
            // 1) Punto de contacto: match rule por email
            send({ user: { attributes: { eventType: "contactPointEmail", email: u.email } } });
            // 2) Identidad del visitante, asociada a la interacción de login
            send({
                interaction: { name: "Login", eventType: "userEngagement", ...context() },
                user: {
                    attributes: clean({
                        eventType: "identity",
                        isAnonymous: "0",
                        email: u.email,
                        firstName: u.firstName,
                        lastName: u.lastName,
                        customerId: u.customerId,
                        loyaltyTier: u.loyaltyTier
                    })
                }
            });
            // 3) Identificador de negocio: match rule por customerId, igual que el histórico
            send({
                user: { attributes: { eventType: "partyIdentification", userId: u.customerId, IDName: ID_NAME, IDType: ID_TYPE } }
            });
        },

        newsletter_signup(e) {
            send({ user: { attributes: { eventType: "contactPointEmail", email: e.email } } });
            engagement("Newsletter Signup", {});
        },

        order_completed(e) {
            const o = e.order;
            const net = round2(o.subtotal !== undefined ? o.subtotal : o.total - o.shipping);
            send({
                interaction: {
                    name: SI.OrderInteractionName.Purchase,
                    ...context(),
                    shippingCost: o.shipping,
                    orderGrossValue: o.total,
                    order: {
                        id: o.orderId,
                        currency: o.currency || CURRENCY,
                        totalValue: net,
                        lineItems: o.items.map((item) => lineItem(item, item.quantity))
                    }
                }
            });
        }
    };

    function handle(e) {
        try {
            const fn = e && handlers[e.event];
            if (fn) fn(e);
        } catch (err) {
            console.warn("[altamar] evento no enviado", e, err);
        }
    }

    // Demo: consentimiento de medición aceptado al cargar. En producción: leer del banner de cookies
    const consents = () => [{ provider: "Altamar", purpose: SI.ConsentPurpose.Tracking, status: SI.ConsentStatus.OptIn }];

    SI.init({ consents: consents() }).then(() => {
        SI.updateConsents(consents());
        // Los eventos se envían desde el data layer, no por tipos de página
        SI.initSitemap({ global: {}, pageTypes: [] });

        const queue = (window.altamarDataLayer = window.altamarDataLayer || []);
        queue.forEach(handle); // eventos ocurridos antes de cargar el SDK
        const originalPush = queue.push.bind(queue);
        queue.push = function () {
            const result = originalPush.apply(null, arguments);
            Array.prototype.forEach.call(arguments, handle);
            return result;
        };
    });
})();
