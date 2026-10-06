export type Category = "mujer" | "hombre" | "ninos" | "accesorios";

export type Product = {
  id: string;
  sku: string;
  name: string;
  category: Category;
  subcategory: string;
  price: number; // EUR, precio actual
  originalPrice?: number; // EUR, si hay descuento
  currency: "EUR";
  image: string;
  color: string;
  sizes: string[];
  description: string;
  tags: string[];
};

/** Fotos de Unsplash (licencia Unsplash: uso comercial permitido, sin atribución obligatoria). */
const img = (photo: string) =>
  `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=800&h=1000&q=80`;

const W = ["XS", "S", "M", "L", "XL"];
const M = ["S", "M", "L", "XL", "XXL"];
const K = ["4A", "6A", "8A", "10A", "12A"];
const U = ["Única"];

/**
 * Catálogo de la marca ficticia Altamar (moda mediterránea).
 * Nombres, descripciones y precios inventados para demos.
 */
export const products: Product[] = [
  // ============= MUJER =============
  {
    id: "w-cala",
    sku: "ALT-W-1001",
    name: "Vestido Midi de Lino Cala",
    category: "mujer",
    subcategory: "vestidos",
    price: 79.95,
    currency: "EUR",
    image: img("photo-1747396206869-75ea57b325ce"),
    color: "Arena",
    sizes: W,
    description: "Vestido midi de lino lavado con tirantes anchos y caída fluida. Fresco, ligero y hecho para los días largos de verano.",
    tags: ["nueva-coleccion", "lino", "verano"]
  },
  {
    id: "w-formentera",
    sku: "ALT-W-1002",
    name: "Vestido Largo de Lino Formentera",
    category: "mujer",
    subcategory: "vestidos",
    price: 89.95,
    originalPrice: 109.95,
    currency: "EUR",
    image: img("photo-1764298493197-a1c1cce57800"),
    color: "Crudo",
    sizes: W,
    description: "Vestido largo de lino con manga amplia y silueta relajada. Combínalo con sombrero de paja y alpargatas.",
    tags: ["lino", "verano", "sale"]
  },
  {
    id: "w-brisa",
    sku: "ALT-W-1003",
    name: "Camisa Oversize de Algodón Brisa",
    category: "mujer",
    subcategory: "camisas",
    price: 45.95,
    currency: "EUR",
    image: img("photo-1600884350802-c6d0bf14dcc6"),
    color: "Blanco",
    sizes: W,
    description: "Camisa de algodón orgánico con corte oversize y cuello abierto. Un básico de armario que funciona con todo.",
    tags: ["essentials", "nueva-coleccion"]
  },
  {
    id: "w-mistral",
    sku: "ALT-W-1004",
    name: "Camisa de Popelina Mistral",
    category: "mujer",
    subcategory: "camisas",
    price: 39.95,
    originalPrice: 49.95,
    currency: "EUR",
    image: img("photo-1595272251257-1bbe120103d5"),
    color: "Blanco",
    sizes: W,
    description: "Camisa de popelina de algodón con botones de nácar y puños con doble botón.",
    tags: ["essentials", "sale"]
  },
  {
    id: "w-azulejo",
    sku: "ALT-W-1005",
    name: "Falda Midi Estampada Azulejo",
    category: "mujer",
    subcategory: "faldas",
    price: 49.95,
    currency: "EUR",
    image: img("photo-1789110854735-67c4e4737aa2"),
    color: "Blanco y azul",
    sizes: W,
    description: "Falda midi con estampado inspirado en la cerámica mediterránea y cintura elástica.",
    tags: ["nueva-coleccion", "verano"]
  },
  {
    id: "w-palmera",
    sku: "ALT-W-1006",
    name: "Pantalón Ancho Estampado Palmera",
    category: "mujer",
    subcategory: "pantalones",
    price: 55.95,
    currency: "EUR",
    image: img("photo-1789110520665-f07353f0afbe"),
    color: "Teja",
    sizes: W,
    description: "Pantalón de pierna ancha en viscosa fluida con estampado de hojas de palmera.",
    tags: ["nueva-coleccion", "verano"]
  },
  {
    id: "w-tramontana",
    sku: "ALT-W-1007",
    name: "Jersey de Punto Tramontana",
    category: "mujer",
    subcategory: "punto",
    price: 59.95,
    currency: "EUR",
    image: img("photo-1675470387999-5b97eebbbef4"),
    color: "Crudo",
    sizes: W,
    description: "Jersey de punto suave en mezcla de algodón y lana, perfecto para las noches junto al mar.",
    tags: ["essentials", "punto"]
  },
  {
    id: "w-niebla",
    sku: "ALT-W-1008",
    name: "Cárdigan de Punto Grueso Niebla",
    category: "mujer",
    subcategory: "punto",
    price: 65.95,
    originalPrice: 79.95,
    currency: "EUR",
    image: img("photo-1636178566141-f5b806a2d2b3"),
    color: "Gris claro",
    sizes: W,
    description: "Cárdigan largo de punto grueso con bolsillos de parche. Abriga sin pesar.",
    tags: ["punto", "sale"]
  },
  {
    id: "w-riviera",
    sku: "ALT-W-1009",
    name: "Blazer de Lino Riviera",
    category: "mujer",
    subcategory: "chaquetas",
    price: 99.95,
    currency: "EUR",
    image: img("photo-1619914777583-ce0b7830d2a6"),
    color: "Camel",
    sizes: W,
    description: "Blazer de lino sin forrar con hombros suaves. Elegancia relajada para la ciudad y la costa.",
    tags: ["nueva-coleccion", "lino"]
  },
  {
    id: "w-puerto",
    sku: "ALT-W-1010",
    name: "Camiseta Marinera de Rayas Puerto",
    category: "mujer",
    subcategory: "camisetas",
    price: 29.95,
    currency: "EUR",
    image: img("photo-1790516099864-b713b25b072d"),
    color: "Rayas marino",
    sizes: W,
    description: "La clásica camiseta marinera de rayas en algodón grueso. Un icono de Altamar.",
    tags: ["essentials", "iconos"]
  },
  {
    id: "w-jardin",
    sku: "ALT-W-1011",
    name: "Mono Estampado Jardín",
    category: "mujer",
    subcategory: "monos",
    price: 69.95,
    currency: "EUR",
    image: img("photo-1768982596726-c01dd8a8af32"),
    color: "Estampado",
    sizes: W,
    description: "Mono de manga corta con estampado botánico, cinturón a juego y pierna amplia.",
    tags: ["nueva-coleccion", "verano"]
  },

  // ============= HOMBRE =============
  {
    id: "m-levante-blanca",
    sku: "ALT-M-2001",
    name: "Camisa de Lino Levante Blanca",
    category: "hombre",
    subcategory: "camisas",
    price: 49.95,
    currency: "EUR",
    image: img("photo-1713881587420-113c1c43e28a"),
    color: "Blanco",
    sizes: M,
    description: "Camisa de lino 100% con cuello mao y corte regular. La camisa del verano.",
    tags: ["lino", "essentials", "iconos"]
  },
  {
    id: "m-levante-celeste",
    sku: "ALT-M-2002",
    name: "Camisa de Lino Levante Celeste",
    category: "hombre",
    subcategory: "camisas",
    price: 49.95,
    currency: "EUR",
    image: img("photo-1713881842156-3d9ef36418cc"),
    color: "Celeste",
    sizes: M,
    description: "Nuestra camisa de lino Levante en celeste, teñida en prenda para un acabado suave.",
    tags: ["lino", "nueva-coleccion"]
  },
  {
    id: "m-faro",
    sku: "ALT-M-2003",
    name: "Camisa de Manga Corta Faro",
    category: "hombre",
    subcategory: "camisas",
    price: 39.95,
    currency: "EUR",
    image: img("photo-1713881649391-a1c8ddaf83cd"),
    color: "Azul marino",
    sizes: M,
    description: "Camisa de manga corta en algodón y lino, cuello abierto y bolsillo en el pecho.",
    tags: ["lino", "verano"]
  },
  {
    id: "m-regata",
    sku: "ALT-M-2004",
    name: "Polo de Punto Regata",
    category: "hombre",
    subcategory: "polos",
    price: 45.95,
    currency: "EUR",
    image: img("photo-1711355249709-1733df63e028"),
    color: "Crudo",
    sizes: M,
    description: "Polo de punto fino con cuello en contraste. Pulido pero cómodo.",
    tags: ["essentials", "nueva-coleccion"]
  },
  {
    id: "m-muelle",
    sku: "ALT-M-2005",
    name: "Pantalón Chino Muelle",
    category: "hombre",
    subcategory: "pantalones",
    price: 55.95,
    currency: "EUR",
    image: img("photo-1473966968600-fa801b869a1a"),
    color: "Camel",
    sizes: ["38", "40", "42", "44", "46"],
    description: "Chino de algodón elástico con corte slim y bajo ajustado.",
    tags: ["essentials"]
  },
  {
    id: "m-arena",
    sku: "ALT-M-2006",
    name: "Bermuda de Algodón Arena",
    category: "hombre",
    subcategory: "bermudas",
    price: 35.95,
    originalPrice: 45.95,
    currency: "EUR",
    image: img("photo-1621496503717-095a410e1566"),
    color: "Gris piedra",
    sizes: M,
    description: "Bermuda de sarga de algodón con cintura ajustable. Del paseo marítimo a la terraza.",
    tags: ["verano", "sale"]
  },
  {
    id: "m-albatros",
    sku: "ALT-M-2007",
    name: "Jersey de Algodón Albatros",
    category: "hombre",
    subcategory: "punto",
    price: 59.95,
    currency: "EUR",
    image: img("photo-1611312449297-a69dc9c3987b"),
    color: "Negro",
    sizes: M,
    description: "Jersey de cuello redondo en algodón peinado. Ligero para las noches de verano.",
    tags: ["punto", "essentials"]
  },
  {
    id: "m-galerna",
    sku: "ALT-M-2008",
    name: "Jersey de Rayas Galerna",
    category: "hombre",
    subcategory: "punto",
    price: 54.95,
    currency: "EUR",
    image: img("photo-1597143720583-bbbf44a6677d"),
    color: "Rayas gris",
    sizes: M,
    description: "Jersey de punto con rayas horizontales, inspirado en los jerséis de los pescadores.",
    tags: ["punto", "iconos"]
  },
  {
    id: "m-salina",
    sku: "ALT-M-2009",
    name: "Sobrecamisa de Lino Salina",
    category: "hombre",
    subcategory: "chaquetas",
    price: 69.95,
    currency: "EUR",
    image: img("photo-1668603145969-26173ef4e895"),
    color: "Crudo",
    sizes: M,
    description: "Sobrecamisa de lino grueso con bolsillos de parche. Una capa ligera para todo el año.",
    tags: ["lino", "nueva-coleccion"]
  },
  {
    id: "m-puerto-viejo",
    sku: "ALT-M-2010",
    name: "Sobrecamisa de Cuadros Puerto Viejo",
    category: "hombre",
    subcategory: "chaquetas",
    price: 74.95,
    originalPrice: 89.95,
    currency: "EUR",
    image: img("photo-1662578354822-f8b43ecaeaaa"),
    color: "Cuadros",
    sizes: M,
    description: "Sobrecamisa de franela de algodón a cuadros, cálida para las tardes de entretiempo.",
    tags: ["sale"]
  },
  {
    id: "m-ola",
    sku: "ALT-M-2011",
    name: "Camiseta de Algodón Orgánico Ola",
    category: "hombre",
    subcategory: "camisetas",
    price: 19.95,
    currency: "EUR",
    image: img("photo-1671438118257-cefa6c86fd50"),
    color: "Blanco",
    sizes: M,
    description: "Camiseta básica de algodón orgánico de gramaje medio. Mejora con cada lavado.",
    tags: ["essentials"]
  },

  // ============= NIÑOS =============
  {
    id: "k-amapola",
    sku: "ALT-K-3001",
    name: "Vestido Floral Niña Amapola",
    category: "ninos",
    subcategory: "vestidos",
    price: 29.95,
    currency: "EUR",
    image: img("photo-1650602979536-74222284e5e2"),
    color: "Floral",
    sizes: K,
    description: "Vestido de algodón con estampado floral y vuelo, para jugar todo el día.",
    tags: ["nueva-coleccion", "verano"]
  },
  {
    id: "k-margarita",
    sku: "ALT-K-3002",
    name: "Vestido de Algodón Niña Margarita",
    category: "ninos",
    subcategory: "vestidos",
    price: 27.95,
    currency: "EUR",
    image: img("photo-1562438995-20c8bc11d4a9"),
    color: "Estampado",
    sizes: K,
    description: "Vestido ligero de algodón con tirantes y falda con volante.",
    tags: ["verano"]
  },
  {
    id: "k-coral",
    sku: "ALT-K-3003",
    name: "Camisa Estampada Niño Coral",
    category: "ninos",
    subcategory: "camisas",
    price: 25.95,
    currency: "EUR",
    image: img("photo-1665251117419-31b511ce2be3"),
    color: "Blanco estampado",
    sizes: K,
    description: "Camisa de manga corta con estampado de hojas, en algodón fresco.",
    tags: ["nueva-coleccion", "verano"]
  },
  {
    id: "k-gaviota",
    sku: "ALT-K-3004",
    name: "Sudadera con Capucha Gaviota",
    category: "ninos",
    subcategory: "sudaderas",
    price: 32.95,
    currency: "EUR",
    image: img("photo-1719421992052-e7d4394fa7fd"),
    color: "Blanco",
    sizes: K,
    description: "Sudadera de felpa con capucha y bolsillo canguro. Imprescindible en la mochila.",
    tags: ["essentials"]
  },
  {
    id: "k-hermanos",
    sku: "ALT-K-3005",
    name: "Camisa Estampada Hermanos",
    category: "ninos",
    subcategory: "camisas",
    price: 34.95,
    originalPrice: 42.95,
    currency: "EUR",
    image: img("photo-1502451885777-16c98b07834a"),
    color: "Floral gris",
    sizes: K,
    description: "Camisa estampada de manga corta, disponible en tallas para hermanos a juego.",
    tags: ["sale", "verano"]
  },
  {
    id: "k-sol",
    sku: "ALT-K-3006",
    name: "Camiseta Niña Sol",
    category: "ninos",
    subcategory: "camisetas",
    price: 15.95,
    currency: "EUR",
    image: img("photo-1760090343192-f74e63013688"),
    color: "Rosa",
    sizes: K,
    description: "Camiseta de algodón orgánico en rosa coral, suave y resistente.",
    tags: ["essentials"]
  },

  // ============= ACCESORIOS =============
  {
    id: "a-capazo",
    sku: "ALT-A-4001",
    name: "Bolso de Paja Capazo Mediterráneo",
    category: "accesorios",
    subcategory: "bolsos",
    price: 45.95,
    currency: "EUR",
    image: img("photo-1641934777532-d277296b111c"),
    color: "Natural",
    sizes: U,
    description: "Capazo tejido a mano en fibra natural con asas de piel. El compañero de playa.",
    tags: ["iconos", "verano"]
  },
  {
    id: "a-mercado",
    sku: "ALT-A-4002",
    name: "Cesta de Mimbre Mercado",
    category: "accesorios",
    subcategory: "bolsos",
    price: 39.95,
    currency: "EUR",
    image: img("photo-1594126593314-2061a87e5996"),
    color: "Natural",
    sizes: U,
    description: "Cesta de mimbre con asas largas, para el mercado, la playa o el picnic.",
    tags: ["verano"]
  },
  {
    id: "a-ala-ancha",
    sku: "ALT-A-4003",
    name: "Sombrero de Paja Ala Ancha",
    category: "accesorios",
    subcategory: "sombreros",
    price: 35.95,
    currency: "EUR",
    image: img("photo-1583703779199-e6ed378df595"),
    color: "Natural",
    sizes: U,
    description: "Sombrero de paja natural de ala ancha con cinta interior antisudor.",
    tags: ["verano", "nueva-coleccion"]
  },
  {
    id: "a-horizonte",
    sku: "ALT-A-4004",
    name: "Gafas de Sol Horizonte",
    category: "accesorios",
    subcategory: "gafas",
    price: 59.95,
    currency: "EUR",
    image: img("photo-1584036553516-bf83210aa16c"),
    color: "Negro",
    sizes: U,
    description: "Gafas de sol de montura combinada con lentes polarizadas UV400.",
    tags: ["nueva-coleccion"]
  },
  {
    id: "a-alpargatas",
    sku: "ALT-A-4005",
    name: "Alpargatas de Yute Mediterránea",
    category: "accesorios",
    subcategory: "calzado",
    price: 39.95,
    currency: "EUR",
    image: img("photo-1565953198075-db265882ee68"),
    color: "Naranja",
    sizes: ["36", "37", "38", "39", "40", "41"],
    description: "Alpargatas de lona con suela de yute cosida a mano. Hechas en España.",
    tags: ["iconos", "verano"]
  },
  {
    id: "a-cinturon",
    sku: "ALT-A-4006",
    name: "Cinturón Trenzado de Piel",
    category: "accesorios",
    subcategory: "cinturones",
    price: 34.95,
    currency: "EUR",
    image: img("photo-1711443982852-b3df5c563448"),
    color: "Marrón",
    sizes: ["85", "90", "95", "100"],
    description: "Cinturón de piel trenzada con hebilla metálica mate.",
    tags: ["essentials"]
  },
  {
    id: "a-caleta",
    sku: "ALT-A-4007",
    name: "Sandalias de Piel Caleta",
    category: "accesorios",
    subcategory: "calzado",
    price: 49.95,
    originalPrice: 59.95,
    currency: "EUR",
    image: img("photo-1625563206627-7e713d1ac0a8"),
    color: "Marrón",
    sizes: ["40", "41", "42", "43", "44", "45"],
    description: "Sandalias de piel con dos tiras ajustables y plantilla anatómica.",
    tags: ["verano", "sale"]
  },
  {
    id: "a-paseo",
    sku: "ALT-A-4008",
    name: "Sandalias Planas de Piel Paseo",
    category: "accesorios",
    subcategory: "calzado",
    price: 54.95,
    currency: "EUR",
    image: img("photo-1628375385879-1af64230c2e1"),
    color: "Cuero",
    sizes: ["36", "37", "38", "39", "40", "41"],
    description: "Sandalias planas de piel con tira al tobillo y suela de goma.",
    tags: ["verano", "nueva-coleccion"]
  }
];

export const CATEGORY_LABELS: Record<Category, string> = {
  mujer: "Mujer",
  hombre: "Hombre",
  ninos: "Niños",
  accesorios: "Accesorios"
};

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getRelated(id: string, limit = 4): Product[] {
  const p = getProduct(id);
  if (!p) return products.slice(0, limit);
  const same = products.filter((x) => x.id !== id && x.subcategory === p.subcategory && x.category === p.category);
  const cat = products.filter((x) => x.id !== id && x.category === p.category && !same.includes(x));
  return [...same, ...cat].slice(0, limit);
}

export function byCategory(category?: Category): Product[] {
  if (!category) return products;
  return products.filter((p) => p.category === category);
}

export function byTag(tag: string, limit = 4): Product[] {
  return products.filter((p) => p.tags.includes(tag)).slice(0, limit);
}

const eur = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

export function formatEUR(value: number): string {
  return eur.format(value);
}

export const FREE_SHIPPING_FROM = 50;
export const SHIPPING_COST = 4.95;
