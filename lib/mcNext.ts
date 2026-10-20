/**
 * Cliente server-side para el Form Handler de Marketing Cloud Next.
 *
 * Solo se importa desde rutas de API: las credenciales de la External Client App
 * nunca llegan al navegador. Salesforce recomienda este patrón (server-side) frente
 * a llamar al Form Handler desde JavaScript del navegador.
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

type Token = { accessToken: string; instanceUrl: string; expiresAt: number };

let cached: Token | null = null;

function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Falta la variable de entorno ${name}`);
  return v;
}

export function isConfigured(): boolean {
  return ["SF_MY_DOMAIN", "SF_CLIENT_ID", "SF_CLIENT_SECRET", "MC_FORM_HANDLER_URL"].every((k) => !!process.env[k]);
}

/** OAuth 2.0 Client Credentials contra la External Client App. El token se reutiliza mientras sea válido. */
async function getToken(): Promise<Token> {
  if (cached && cached.expiresAt > Date.now()) return cached;
  const res = await fetch(`https://${env("SF_MY_DOMAIN")}/services/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: env("SF_CLIENT_ID"),
      client_secret: env("SF_CLIENT_SECRET")
    }),
    cache: "no-store"
  });
  if (!res.ok) throw new Error(`OAuth ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { access_token: string; instance_url: string };
  // La respuesta no trae expires_in; se renueva a los 20 minutos y ante un 401.
  cached = { accessToken: json.access_token, instanceUrl: json.instance_url, expiresAt: Date.now() + 20 * 60 * 1000 };
  return cached;
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
    marketing_consent: r.marketingConsent ? "true" : "false",
    privacy_accepted: r.privacyAccepted ? "true" : "false",
    consent_source: r.source,
    consent_captured_at: r.submittedAt,
    consent_ip: r.ip ?? "",
    consent_user_agent: r.userAgent ?? ""
  };
}

export async function submitToFormHandler(r: Registration, retry = true): Promise<void> {
  const token = await getToken();
  const res = await fetch(env("MC_FORM_HANDLER_URL"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
      "Content-Type": "application/json",
      // El Form Handler valida Origin contra la CORS allowlist de la org.
      Origin: process.env.NEXT_PUBLIC_SITE_URL || ""
    },
    body: JSON.stringify(toFormHandlerFields(r)),
    cache: "no-store"
  });
  if (res.status === 401 && retry) {
    cached = null;
    return submitToFormHandler(r, false);
  }
  if (!res.ok) throw new Error(`Form Handler ${res.status}: ${await res.text()}`);
}
