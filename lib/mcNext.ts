/**
 * Cliente server-side para el Form Handler de Marketing Cloud Next.
 *
 * Usa el método "Server-side" del Code Snippet del Form Handler: un POST de formulario
 * estándar a la URL pública de envío del sitio de Marketing. No necesita OAuth.
 * Se llama desde la ruta de API para validar y filtrar bots antes de enviar.
 */

export type Registration = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  marketingConsent: boolean;
  privacyAccepted: boolean;
  source: string;
  submittedAt: string;
  ip?: string;
  userAgent?: string;
};

export function isConfigured(): boolean {
  return !!process.env.MC_FORM_HANDLER_URL;
}

/**
 * Nombres de campo tal como están definidos en el Form Handler de MC Next.
 * Si en el Form Handler se llaman distinto, solo hay que cambiar este objeto.
 */
export function toFormHandlerFields(r: Registration): Record<string, string> {
  return {
    first_name: r.firstName,
    last_name: r.lastName,
    email: r.email,
    phone: r.phone ?? "",
    // Lead exige Company; en B2C se usa un valor fijo.
    company: "Particular",
    // Status es obligatorio en el Form Handler; valor estándar del picklist de Lead.
    status: process.env.MC_LEAD_STATUS || "Open - Not Contacted",
    marketing_consent: r.marketingConsent ? "true" : "false"
  };
}

/**
 * POST de formulario a una URL de envío de Form Handler.
 * `origin` es el dominio de la web (p. ej. https://altamar-demo.vercel.app); debe estar en la CORS allowlist de la org.
 */
async function postToFormHandler(url: string, fields: Record<string, string>, origin: string, path: string): Promise<void> {
  const res = await fetch(url, {
    method: "POST",
    // El endpoint de envío valida Origin y Referer contra la CORS allowlist (403/404 si no coinciden).
    headers: { "Content-Type": "application/x-www-form-urlencoded", Origin: origin, Referer: `${origin}${path}` },
    body: new URLSearchParams(fields),
    // El handler responde con una redirección a la Success o Failure Page URL; no se sigue.
    redirect: "manual",
    cache: "no-store"
  });
  const location = res.headers.get("location") || "";
  console.info("[registro] respuesta del Form Handler", { path, status: res.status, location });
  const failed = res.status >= 400 || (res.status >= 300 && location.includes("error"));
  if (failed) throw new Error(`Form Handler ${res.status} ${location}: ${await res.text().catch(() => "")}`);
}

export async function submitToFormHandler(r: Registration, origin: string): Promise<void> {
  await postToFormHandler(process.env.MC_FORM_HANDLER_URL as string, toFormHandlerFields(r), origin, "/registro");
  // Evidencia del alta (RGPD) en los logs del servidor hasta que existan campos en Lead para guardarla.
  console.info("[registro] consentimiento", {
    email: r.email,
    marketingConsent: r.marketingConsent,
    privacyAccepted: r.privacyAccepted,
    source: r.source,
    submittedAt: r.submittedAt,
    ip: r.ip,
    userAgent: r.userAgent
  });
}

export type Confirmation = {
  email: string;
  leadId: string;
  confirmedAt: string;
  ip?: string;
  userAgent?: string;
};

export function isConfirmationConfigured(): boolean {
  return !!process.env.MC_CONFIRM_FORM_HANDLER_URL;
}

/**
 * Clic en el enlace del email de doble opt-in. Se envía a un segundo Form Handler cuyo Flow
 * comprueba que el Lead `lead_id` tiene ese email y crea el consentimiento Opt In.
 * Sustituye al "Wait Until Event → Email Link Click", que no recibe los clics de este email.
 */
export async function submitConfirmation(c: Confirmation, origin: string): Promise<void> {
  await postToFormHandler(
    process.env.MC_CONFIRM_FORM_HANDLER_URL as string,
    { email: c.email, lead_id: c.leadId },
    origin,
    "/registro/confirmado"
  );
  console.info("[registro] confirmación doble opt-in", c);
}

/** Dominio desde el que se usó la web, para las cabeceras Origin/Referer del envío. */
export function requestOrigin(req: Request): string {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  return req.headers.get("origin") || (host ? `https://${host}` : process.env.NEXT_PUBLIC_SITE_URL || "");
}
