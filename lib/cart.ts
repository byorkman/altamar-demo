"use client";

import type { Product } from "@/data/products";
import { track, toTracked } from "./tracking";

export type CartLine = {
  productId: string;
  sku: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  currency: string;
  color: string;
  quantity: number;
  image: string;
  size?: string;
};

const KEY = "altamar_cart";
export const CART_EVENT = "altamar:cart-changed";

function read(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(lines: CartLine[]) {
  localStorage.setItem(KEY, JSON.stringify(lines));
  window.dispatchEvent(new CustomEvent(CART_EVENT));
}

const lineProduct = (l: CartLine) =>
  toTracked({ ...l, name: l.name, color: l.color });

export function getCart(): CartLine[] {
  return read();
}

export function addToCart(p: Product, size?: string, quantity = 1) {
  const lines = read();
  const existing = lines.find((l) => l.productId === p.id && l.size === size);
  if (existing) existing.quantity += quantity;
  else
    lines.push({
      productId: p.id,
      sku: p.sku,
      name: p.name,
      category: p.category,
      subcategory: p.subcategory,
      price: p.price,
      currency: p.currency,
      color: p.color,
      quantity,
      image: p.image,
      size
    });
  write(lines);
  track({ event: "add_to_cart", product: toTracked(p), quantity, size });
}

export function changeQuantity(productId: string, size: string | undefined, delta: number) {
  const lines = read();
  const line = lines.find((l) => l.productId === productId && l.size === size);
  if (!line) return;
  line.quantity += delta;
  write(lines.filter((l) => l.quantity > 0));
  if (delta > 0) track({ event: "add_to_cart", product: lineProduct(line), quantity: delta, size });
  else track({ event: "remove_from_cart", product: lineProduct(line), quantity: -delta, size });
}

export function removeLine(productId: string, size?: string) {
  const lines = read();
  const line = lines.find((l) => l.productId === productId && l.size === size);
  write(lines.filter((l) => !(l.productId === productId && l.size === size)));
  if (line) track({ event: "remove_from_cart", product: lineProduct(line), quantity: line.quantity, size });
}

export function clearCart() {
  write([]);
}

export function cartSubtotal(lines: CartLine[] = read()): number {
  return Math.round(lines.reduce((sum, l) => sum + l.price * l.quantity, 0) * 100) / 100;
}

export function cartCount(lines: CartLine[] = read()): number {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}
