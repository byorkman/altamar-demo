/**
 * Sitemap Altamar Demo - Data Cloud (Salesforce Interactions SDK)
 * Se pega en el editor de sitemap del conector web de Data Cloud.
 *
 * La web publica eventos de negocio en window.altamarDataLayer (ver lib/tracking.ts).
 * Este sitemap lee esa cola, incluidos los eventos que llegaron antes de que cargara
 * el SDK, y los envía a Data Cloud con los nombres de campo del schema
 * (datacloud/altamar_schema.json).
 *
 * Reglas:
 *  - interaction.eventType      = "Altamar_Engagement"
 *  - user.attributes.eventType  = "Altamar_Profile"
 *  - eventId, deviceId, sessionId, dateTime y category los rellena el SDK.
 *  - No usar nombres reservados del SDK como interaction.name ("Purchase",
 *    "Add To Cart", "View Catalog Object"...): el SDK los descarta si no llevan
 *    su estructura propia.
 */

(function () {
    const ENGAGEMENT = "Altamar_Engagement";
    const PROFILE = "Altamar_Profile";

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
            let referrer = "";
            try {
                if (document.referrer && new URL(document.referrer).host !== window.location.host) referrer = document.referrer;
            } catch (e) {}
            const src = clean({
                referrer,
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

    function engagement(name, fields) {
        const user = currentUser();
        return SalesforceInteractions.sendEvent({
            interaction: clean({
                name,
                eventType: ENGAGEMENT,
                pageUrl: window.location.href,
                ...page,
                ...trafficSource(),
                customerId: user && user.customerId,
                ...fields
            })
        });
    }

    function profile(name, attributes) {
        return SalesforceInteractions.sendEvent({
            interaction: { name },
            user: { attributes: clean({ eventType: PROFILE, isAnonymous: "0", ...attributes }) }
        });
    }

    const productFields = (p) =>
        clean({
            sku: p.sku,
            productName: p.name,
            prodCategory: p.category,
            prodSubcategory: p.subcategory,
            color: p.color,
            price: p.price,
            currency: p.currency
        });

    const handlers = {
        page_view(e) {
            page = clean({ pageType: e.pageType, pageCategory: e.pageCategory, pageTitle: e.pageTitle });
            // En las fichas de producto se envía View Product (con este mismo contexto de página)
            if (e.pageType !== "product") engagement("View Page", {});
        },

        product_view(e) {
            // product_view puede llegar antes que el page_view de la ficha: fijamos aquí el contexto
            page = clean({ pageType: "product", pageCategory: e.product.category, pageTitle: document.title });
            engagement("View Product", productFields(e.product));
        },

        add_to_cart(e) {
            engagement("Add to Cart", {
                ...productFields(e.product),
                size: e.size,
                quantity: e.quantity,
                lineTotal: round2(e.product.price * e.quantity)
            });
        },

        remove_from_cart(e) {
            engagement("Remove from Cart", {
                ...productFields(e.product),
                size: e.size,
                quantity: e.quantity,
                lineTotal: round2(e.product.price * e.quantity)
            });
        },

        login(e) {
            profile("Identity Login", {
                email: e.user.email,
                customerId: e.user.customerId,
                firstName: e.user.firstName,
                loyaltyTier: e.user.loyaltyTier
            });
        },

        newsletter_signup(e) {
            profile("Newsletter Signup", { email: e.email, newsletterOptIn: "1" });
            engagement("Newsletter Signup", {});
        },

        order_completed(e) {
            const o = e.order;
            const units = o.items.reduce((sum, i) => sum + i.quantity, 0);
            engagement("Order Completed", {
                orderId: o.orderId,
                orderTotal: o.total,
                shippingCost: o.shipping,
                quantity: units,
                currency: o.currency
            });
            o.items.forEach((item) =>
                engagement("Order Line", {
                    ...productFields(item),
                    orderId: o.orderId,
                    size: item.size,
                    quantity: item.quantity,
                    lineTotal: round2(item.price * item.quantity)
                })
            );
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

    SalesforceInteractions.init({
        consents: [{
            provider: "Altamar",
            purpose: "Personalization",
            status: SalesforceInteractions.ConsentStatus.OptIn // Demo. En producción: leer del banner de cookies
        }]
    }).then(() => {
        // Los eventos se envían desde el data layer, no por tipos de página
        SalesforceInteractions.initSitemap({ global: {}, pageTypes: [] });

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
