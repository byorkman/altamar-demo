/**
 * Histórico sintético de Altamar para el RFM (Data 360).
 *
 *   node datacloud/historico/generar.mjs [--fecha-ref 2026-11-05] [--semilla 42] [--salida datacloud/historico/salida]
 *
 * Genera 3.000 clientes con su histórico de pedidos de los últimos 24 meses, repartidos
 * en los cinco segmentos del CI Altamar_RFM (241 Champions, 660 Leales, 360 Nuevos,
 * 540 En riesgo, 1.199 Dormidos). Las fechas son relativas a --fecha-ref (hoy por
 * defecto): regenera y vuelve a cargar la víspera de la demo para que la recencia
 * no se desplace.
 *
 * Ficheros (CSV, UTF-8, coma):
 *   clientes.csv       → Individual, Contact Point Email y Party Identification
 *   pedidos.csv        → Product Order Engagement (importe SIN envío, como la web)
 *   lineas_pedido.csv  → Sales Order Product / línea de pedido (opcional para el RFM)
 *   productos.csv      → catálogo (Product), mismo SKU que envía la web
 *   esperado_rfm.csv   → R, F, M y segmento que debe dar el CI, para comprobarlo
 *
 * El customerId usa el mismo hash que lib/auth.ts, así que una clienta del histórico
 * que inicia sesión en la web con su email se unifica con su perfil (Lucía).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(
    process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith("--") ? [...acc, [a.slice(2), all[i + 1]]] : acc), [])
);

const REF = new Date((args["fecha-ref"] || new Date().toISOString().slice(0, 10)) + "T00:00:00Z");
const OUT = path.resolve(args.salida || path.join(here, "salida"));
const DAY = 86400000;
const ID_NAME = "Altamar Customer Id"; // igual que el sitemap
const ID_TYPE = "Customer Id";
const MAX_DAYS = 700; // margen dentro de la ventana de 730 días del CI

const TARGET = { Champions: 241, Leales: 660, Nuevos: 360, "En riesgo": 540, Dormidos: 1199 };

// Clientas de la demo que viven en el histórico. Carmen NO: su primer pedido se hace en la web.
const PERSONAS = [{ firstName: "Lucía", lastName: "Martín", email: "lucia.martin@example.com", segment: "Champions" }];

// ---------- utilidades ----------

/** Igual que lib/auth.ts */
function fnv(s) {
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 0x01000193);
    }
    return (h >>> 0).toString(16).toUpperCase().padStart(8, "0");
}
const customerId = (email) => "ALT-" + fnv(email.trim().toLowerCase());

let seed = Number(args.semilla || 42) >>> 0;
function rand() {
    // mulberry32
    seed = (seed + 0x6d2b79f5) >>> 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const int = (a, b) => a + Math.floor(rand() * (b - a + 1));
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const round2 = (n) => Math.round(n * 100) / 100;

// Evita quedarse a 1-2 días de un umbral de R, para que recalcular un día después no cambie el segmento
function days(a, b) {
    for (;;) {
        const d = int(a, b);
        if (![30, 90, 180, 365].some((t) => Math.abs(d - t) <= 2)) return d;
    }
}

function csv(file, rows) {
    const esc = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
    const head = Object.keys(rows[0]);
    fs.writeFileSync(path.join(OUT, file), [head.join(","), ...rows.map((r) => head.map((k) => esc(r[k])).join(","))].join("\n") + "\n");
}

// ---------- catálogo (data/products.ts) ----------

const src = fs.readFileSync(path.join(here, "../../data/products.ts"), "utf8");
const products = [...src.matchAll(/sku: "([^"]+)",\s*name: "([^"]+)",\s*category: "([^"]+)",\s*subcategory: "([^"]+)",\s*price: ([\d.]+)/g)].map(
    (m) => ({ sku: m[1], name: m[2], category: m[3], subcategory: m[4], price: Number(m[5]) })
);
if (products.length < 30) throw new Error(`Solo se han leído ${products.length} productos de data/products.ts`);
const byCat = products.reduce((acc, p) => ((acc[p.category] = acc[p.category] || []).push(p), acc), {});

// ---------- reglas del CI Altamar_RFM ----------

function score(dias, pedidos, gasto) {
    const r = dias <= 30 ? 5 : dias <= 90 ? 4 : dias <= 180 ? 3 : dias <= 365 ? 2 : 1;
    const f = pedidos >= 8 ? 5 : pedidos >= 5 ? 4 : pedidos >= 3 ? 3 : pedidos === 2 ? 2 : 1;
    const m = gasto > 500 ? 5 : gasto > 250 ? 4 : gasto > 120 ? 3 : gasto >= 60 ? 2 : 1;
    let s = "Dormidos";
    if (r >= 4 && f >= 4 && m >= 4) s = "Champions";
    else if (f === 1 && r >= 4) s = "Nuevos";
    else if (r >= 3 && f >= 2) s = "Leales";
    else if (r <= 2 && (f >= 3 || m >= 3)) s = "En riesgo";
    return { r, f, m, s };
}

// Perfil de compra que se propone para cada segmento; el resultado se valida con score()
const PLAN = {
    Champions: () => ({ last: days(0, 85), orders: int(5, 12), lines: [1, 3] }),
    Nuevos: () => ({ last: days(0, 85), orders: 1, lines: [1, 2] }),
    Leales: () => ({ last: days(0, 175), orders: int(2, 6), lines: [1, 2] }),
    "En riesgo": () => ({ last: days(185, 600), orders: int(3, 8), lines: [1, 3] }),
    Dormidos: () => ({ last: days(0, MAX_DAYS), orders: int(1, 2), lines: [1, 1] })
};

const FIRST = ["María", "Lucía", "Paula", "Laura", "Marta", "Elena", "Sara", "Ana", "Julia", "Carla", "Noa", "Alba", "Irene", "Claudia", "Sofía", "Inés", "Pablo", "Daniel", "Hugo", "Álvaro", "Javier", "Adrián", "Diego", "Mario", "Marc", "Jorge", "Iker", "Raúl", "Sergio", "Nicolás"];
const LAST = ["García", "Fernández", "González", "Rodríguez", "López", "Martínez", "Sánchez", "Pérez", "Gómez", "Martín", "Jiménez", "Ruiz", "Hernández", "Díaz", "Moreno", "Muñoz", "Álvarez", "Romero", "Navarro", "Torres", "Domínguez", "Vázquez", "Ramos", "Gil", "Serrano", "Blanco", "Molina", "Morales", "Ortega", "Delgado"];
const slug = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// ---------- generación ----------

const clientes = [];
const pedidos = [];
const lineas = [];
const esperado = [];
let orderSeq = 0;

function buildOrders(cid, plan) {
    const fav = pick(Object.keys(byCat));
    const dates = [plan.last];
    while (dates.length < plan.orders) dates.push(int(Math.min(plan.last + 7, MAX_DAYS), MAX_DAYS));
    return dates.map((d) => {
        const n = int(plan.lines[0], plan.lines[1]);
        const items = [];
        for (let i = 0; i < n; i++) {
            const p = pick(rand() < 0.7 ? byCat[fav] : products);
            const quantity = rand() < 0.85 ? 1 : 2;
            items.push({ p, quantity, amount: round2(p.price * quantity) });
        }
        const at = new Date(REF.getTime() - d * DAY + int(9 * 3600, 23 * 3600) * 1000);
        return { d, at, items, amount: round2(items.reduce((t, i) => t + i.amount, 0)) };
    });
}

function addCustomer(person, segment) {
    const cid = customerId(person.email);
    for (let attempt = 0; attempt < 500; attempt++) {
        const orders = buildOrders(cid, PLAN[segment]());
        const dias = Math.min(...orders.map((o) => o.d));
        const gasto = round2(orders.reduce((t, o) => t + o.amount, 0));
        const sc = score(dias, orders.length, gasto);
        if (sc.s !== segment) continue;

        clientes.push({ customer_id: cid, first_name: person.firstName, last_name: person.lastName, email: person.email, id_name: ID_NAME, id_type: ID_TYPE });
        orders
            .sort((a, b) => a.at - b.at)
            .forEach((o) => {
                orderSeq++;
                const orderId = "ORD-" + String(orderSeq).padStart(7, "0"); // la web usa ORD- + 6 caracteres: no hay colisión
                const eventId = "H-" + String(orderSeq).padStart(7, "0");
                pedidos.push({ event_id: eventId, order_id: orderId, customer_id: cid, order_datetime: o.at.toISOString().replace(".000", ""), order_amount: o.amount.toFixed(2), currency: "EUR" });
                o.items.forEach((it, i) =>
                    lineas.push({ line_id: `${eventId}-${i + 1}`, event_id: eventId, order_id: orderId, customer_id: cid, sku: it.p.sku, category: it.p.category, quantity: it.quantity, line_amount: it.amount.toFixed(2) })
                );
            });
        esperado.push({ customer_id: cid, email: person.email, dias_ref: dias, pedidos: orders.length, gasto: gasto.toFixed(2), r: sc.r, f: sc.f, m: sc.m, segmento: segment });
        return;
    }
    throw new Error(`No se ha podido generar un cliente ${segment}`);
}

fs.mkdirSync(OUT, { recursive: true });
const used = new Set(PERSONAS.map((p) => p.email));
const quota = { ...TARGET };
for (const p of PERSONAS) {
    addCustomer(p, p.segment);
    quota[p.segment]--;
}
let n = 0;
for (const [segment, count] of Object.entries(quota)) {
    for (let i = 0; i < count; i++) {
        let person;
        do {
            const firstName = pick(FIRST);
            const lastName = pick(LAST);
            person = { firstName, lastName, email: `${slug(firstName)}.${slug(lastName)}.${String(++n).padStart(4, "0")}@example.com` };
        } while (used.has(person.email));
        used.add(person.email);
        addCustomer(person, segment);
    }
}

// Orden aleatorio de clientes para que el fichero no vaya agrupado por segmento
clientes.sort(() => rand() - 0.5);

csv("clientes.csv", clientes);
csv("pedidos.csv", pedidos);
csv("lineas_pedido.csv", lineas);
csv("productos.csv", products.map((p) => ({ sku: p.sku, name: p.name, category: p.category, subcategory: p.subcategory, price: p.price.toFixed(2), currency: "EUR" })));
csv("esperado_rfm.csv", esperado);

const counts = esperado.reduce((acc, e) => ((acc[e.segmento] = (acc[e.segmento] || 0) + 1), acc), {});
console.log(`Fecha de referencia: ${REF.toISOString().slice(0, 10)} · salida: ${OUT}`);
console.log(`${clientes.length} clientes · ${pedidos.length} pedidos · ${lineas.length} líneas · ${products.length} productos`);
for (const s of Object.keys(TARGET)) console.log(`  ${s.padEnd(10)} ${String(counts[s] || 0).padStart(5)}  (${Math.round(((counts[s] || 0) / clientes.length) * 100)} %)`);
for (const p of PERSONAS) {
    const e = esperado.find((x) => x.email === p.email);
    console.log(`  ${p.firstName}: ${e.customer_id} · ${p.email} · R${e.r} F${e.f} M${e.m} → ${e.segmento}`);
}
