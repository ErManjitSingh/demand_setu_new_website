import { buildApiUrl } from "@/lib/apiConfig";

const GUEST_SESSION_KEY = "demand_setu_guest_session";
const GUEST_PERSISTENT_KEY = "demand_setu_guest_persistent";
const AUTH_CHANGE_EVENT = "guest-auth-change";

function notifyAuthChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT));
}

async function postJson(path, body) {
  const response = await fetch(buildApiUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.error ||
      (Array.isArray(payload?.errors) ? payload.errors.join(", ") : null) ||
      `Request failed (${response.status})`;
    throw new Error(message);
  }

  return payload;
}

export async function createInventoryBooking(bookingData) {
  return postJson("api/inventorybooking/create", bookingData);
}

export async function guestLogin({ mobile, password }) {
  return postJson("api/inventorybooking/guest-login", { mobile, password });
}

export async function getBookingsByMobile(mobile) {
  const digits = String(mobile || "").replace(/\D/g, "");
  if (!digits) {
    return { success: true, data: [] };
  }

  const response = await fetch(
    buildApiUrl(`api/inventorybooking/get-by-mobile/${encodeURIComponent(digits)}`),
    { cache: "no-store" }
  );

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.error ||
      `Failed to load bookings (${response.status})`;
    throw new Error(message);
  }

  return payload;
}

export function getGuestProfileFromSession(session) {
  if (!session) return null;

  const firstName = session.firstName || "";
  const lastName = session.lastName || "";
  const fullName =
    session.fullName || `${firstName} ${lastName}`.trim() || session.name || "";

  return {
    _id: session._id || null,
    firstName,
    lastName,
    fullName,
    email: session.email || "",
    mobile: session.mobile || "",
    country: session.country || "India",
  };
}

export function saveGuestSession(data, { persist = false } = {}) {
  if (typeof window === "undefined") return;
  try {
    const payload = JSON.stringify({
      ...data,
      loggedInAt: Date.now(),
    });

    if (persist) {
      localStorage.setItem(GUEST_PERSISTENT_KEY, payload);
      sessionStorage.removeItem(GUEST_SESSION_KEY);
    } else {
      sessionStorage.setItem(GUEST_SESSION_KEY, payload);
      localStorage.removeItem(GUEST_PERSISTENT_KEY);
    }

    notifyAuthChange();
  } catch {
    /* ignore */
  }
}

export function loadGuestSession() {
  if (typeof window === "undefined") return null;
  try {
    const persistent = localStorage.getItem(GUEST_PERSISTENT_KEY);
    if (persistent) return JSON.parse(persistent);

    const session = sessionStorage.getItem(GUEST_SESSION_KEY);
    if (session) return JSON.parse(session);
  } catch {
    return null;
  }
  return null;
}

export function clearGuestSession() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(GUEST_PERSISTENT_KEY);
    sessionStorage.removeItem(GUEST_SESSION_KEY);
    notifyAuthChange();
  } catch {
    /* ignore */
  }
}

export function isGuestLoggedIn() {
  return Boolean(loadGuestSession());
}
