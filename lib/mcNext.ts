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

export async function submitToFormHandler(r: Registration): Promise<void> {
  const res = await fetch(process.env.MC_FORM_HANDLER_URL as string, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(toFormHandlerFields(r)),
    // El handler responde con una redirección a la Success o Failure Page URL; no se sigue.
    redirect: "manual",
    cache: "no-store"
  });
  const location = res.headers.get("location") || "";
  const failed = res.status >= 400 || (res.status >= 300 && location.includes("error"));
  if (failed) throw new Error(`Form Handler ${res.status} ${location}: ${await res.text().catch(() => "")}`);
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
