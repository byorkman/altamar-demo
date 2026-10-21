import { NextResponse } from "next/server";
import { isConfigured, requestOrigin, submitToFormHandler, type Registration } from "@/lib/mcNext";

export const runtime = "nodejs";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clean(v: unknown, max = 80): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Petición no válida." }, { status: 400 });
  }

  // Honeypot: un humano nunca rellena este campo oculto. Se responde OK para no dar pistas al bot.
  if (clean(body.website)) return NextResponse.json({ ok: true });

  const reg: Registration = {
    firstName: clean(body.firstName),
    lastName: clean(body.lastName),
    email: clean(body.email, 254).toLowerCase(),
    phone: clean(body.phone, 30) || undefined,
    marketingConsent: body.marketingConsent === true,
    privacyAccepted: body.privacyAccepted === true,
    source: "altamar-web/registro",
    submittedAt: new Date().toISOString(),
    ip: req.headers.get("x-forwarded-for")?.split(",")[0].trim(),
    userAgent: req.headers.get("user-agent")?.slice(0, 255) || undefined
  };

  const errors: Record<string, string> = {};
  if (!reg.firstName) errors.firstName = "Indica tu nombre.";
  if (!reg.lastName) errors.lastName = "Indica tus apellidos.";
  if (!EMAIL.test(reg.email)) errors.email = "Revisa el email.";
  if (!reg.privacyAccepted) errors.privacyAccepted = "Necesitamos que aceptes la política de privacidad.";
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  if (!isConfigured()) {
    console.error("[registro] Marketing Cloud Next no está configurado (falta MC_FORM_HANDLER_URL).");
    return NextResponse.json({ ok: false, error: "El registro no está disponible ahora mismo." }, { status: 503 });
  }

  try {
    await submitToFormHandler(reg, requestOrigin(req));
  } catch (err) {
    console.error("[registro] Error enviando al Form Handler", err);
    return NextResponse.json({ ok: false, error: "No hemos podido completar el registro. Inténtalo de nuevo." }, { status: 502 });
  }

  // Misma respuesta exista o no el email: no se revela si alguien ya está registrado.
  return NextResponse.json({ ok: true, marketingConsent: reg.marketingConsent });
}
