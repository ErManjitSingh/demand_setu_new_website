import { fromLocationSlug, toLocationSlug } from "@/lib/listingsSlug";

export function toTitleCase(value) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => {
      const lower = part.toLowerCase();
      if (lower === "&") return "&";
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

export function normalizeStateName(raw) {
  const cleaned = String(raw || "")
    .replace(/^[,\s]+/, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return "";

  const lowered = cleaned.toLowerCase();
  const aliases = {
    delhi: "Delhi",
    gujrat: "Gujarat",
    kerela: "Kerala",
    himachal: "Himachal Pradesh",
    "himachal prades": "Himachal Pradesh",
    arunanchal: "Arunachal Pradesh",
    meghalya: "Meghalaya",
    maharastra: "Maharashtra",
    "jammu and kashmir": "Jammu & Kashmir",
    srilanka: "Sri Lanka",
    tamilnadu: "Tamil Nadu",
    uttrakhand: "Uttarakhand",
    leh: "Ladakh",
    "leh ladakh": "Ladakh",
  };

  if (aliases[lowered]) return aliases[lowered];
  return toTitleCase(cleaned);
}

export function normalizeCityName(raw) {
  return String(raw || "").trim();
}

export function normalizeLocationList(rawItems, normalizeItem = normalizeCityName) {
  const seen = new Set();
  const out = [];

  for (const item of rawItems || []) {
    const value = normalizeItem(item);
    if (!value) continue;
    const dedupeKey = value.toLowerCase();
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    out.push(value);
  }

  return out.sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
}

/** Match slug or label to exact API city/state names from catalog lists. */
export function resolveLocationFromCatalog(nameOrSlug, { cities = [], states = [] } = {}) {
  const slug = toLocationSlug(nameOrSlug);
  if (!slug) return { city: "", state: "", kind: null, ambiguous: false };

  const cityMatch = cities.find((city) => toLocationSlug(city) === slug) || "";
  const stateMatch = states.find((state) => toLocationSlug(state) === slug) || "";

  if (stateMatch && !cityMatch) {
    return { city: "", state: stateMatch, kind: "state", ambiguous: false };
  }
  if (cityMatch && !stateMatch) {
    return { city: cityMatch, state: "", kind: "city", ambiguous: false };
  }
  if (cityMatch && stateMatch) {
    return { city: cityMatch, state: stateMatch, kind: null, ambiguous: true };
  }

  return { city: fromLocationSlug(slug), state: "", kind: "city", ambiguous: false };
}

/** Apply explicit city/state selection kind when slug matches both lists. */
export function applyLocationKind(resolved, kind) {
  if (!resolved?.ambiguous || !kind) return resolved;
  if (kind === "state") {
    return { city: "", state: resolved.state, kind: "state", ambiguous: false };
  }
  if (kind === "city") {
    return { city: resolved.city, state: "", kind: "city", ambiguous: false };
  }
  return resolved;
}
