"use client";

import { track } from "./tracking";

export type DemoUser = {
  customerId: string;
  email: string;
  firstName: string;
  loyaltyTier: "Brisa" | "Marea" | "Altamar";
};

const KEY = "altamar_user";
export const USER_EVENT = "altamar:user-changed";

/** Hash FNV-1a: el mismo email siempre da el mismo customerId (sin colisiones por prefijo). */
function hash(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).toUpperCase().padStart(8, "0");
}

export function getUser(): DemoUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as DemoUser) : null;
  } catch {
    return null;
  }
}

export function login(rawEmail: string, rawFirstName?: string): DemoUser {
  const email = rawEmail.trim().toLowerCase();
  const fromEmail = email.split("@")[0].split(/[._-]/)[0].replace(/[^a-záéíóúñü]/gi, "") || "Cliente";
  const name = (rawFirstName || "").trim() || fromEmail;
  const user: DemoUser = {
    customerId: "ALT-" + hash(email),
    email,
    firstName: name.charAt(0).toUpperCase() + name.slice(1),
    loyaltyTier: "Marea"
  };
  localStorage.setItem(KEY, JSON.stringify(user));
  window.dispatchEvent(new CustomEvent(USER_EVENT));
  track({ event: "login", user });
  return user;
}

export function logout() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent(USER_EVENT));
}
