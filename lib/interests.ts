"use client";

import type { Category } from "@/data/products";

/** Recuerda las últimas categorías vistas para personalizar la home (solo en este navegador). */
const KEY = "altamar_interests";

export function rememberCategory(category: Category) {
  try {
    const counts = JSON.parse(localStorage.getItem(KEY) || "{}");
    counts[category] = (counts[category] || 0) + 1;
    localStorage.setItem(KEY, JSON.stringify(counts));
  } catch {}
}

export function topCategory(): Category | null {
  try {
    const counts: Record<string, number> = JSON.parse(localStorage.getItem(KEY) || "{}");
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top ? (top[0] as Category) : null;
  } catch {
    return null;
  }
}
