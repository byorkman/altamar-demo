import { NextResponse } from "next/server";
import { isConfirmationConfigured, requestOrigin, submitConfirmation } from "@/lib/mcNext";

export const runtime = "nodejs";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Id de Lead de Salesforce: prefijo 00Q y 15 o 18 caracteres.
const LEAD_ID = /^00Q[a-zA-Z0-9]{12}([a-zA-Z0-9]{3})?$/;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const leadId = typeof body.leadId === "string" ? body.leadId.trim() : "";
  if (!EMAIL.test(email) || !LEAD_ID.test(leadId)) return NextResponse.json({ ok: false }, { status: 422 });

  if (!isConfirmationConfigured()) {
    console.error("[registro] Falta MC_CONFIRM_FORM_HANDLER_URL: no se puede registrar la confirmación.");
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  try {
    await submitConfirmation(
      {
        email,
        leadId,
        confirmedAt: new Date().toISOString(),
        ip: req.headers.get("x-forwarded-for")?.split(",")[0].trim(),
        userAgent: req.headers.get("user-agent")?.slice(0, 255) || undefined
      },
      requestOrigin(req)
    );
  } catch (err) {
    console.error("[registro] Error enviando la confirmación al Form Handler", err);
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
