import { buildApiUrl } from "@/lib/apiConfig";

const DEMAND_SETU_TEMPLATE = {
  templateName: "website_static_template",
  language: "en_US",
};

export function phoneToDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

/**
 * Sends Demand Setu welcome WhatsApp template after a successful booking.
 */
export async function sendBookingWelcomeWhatsApp({ mobile }) {
  const mobileDigits = phoneToDigits(mobile);
  if (!mobileDigits) {
    return { ok: false, reason: "no_mobile" };
  }

  const to = mobileDigits.length <= 10 ? `91${mobileDigits}` : mobileDigits;

  const response = await fetch(buildApiUrl("api/whatsapp/send-template"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone: to,
      templateName: DEMAND_SETU_TEMPLATE.templateName,
      language: DEMAND_SETU_TEMPLATE.language,
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.error ||
      `WhatsApp template failed (${response.status})`;
    throw new Error(message);
  }

  return { ok: true, data: payload };
}
