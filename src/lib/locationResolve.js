import { cache } from "react";
import { buildApiUrl } from "@/lib/apiConfig";
import {
  applyLocationKind,
  normalizeCityName,
  normalizeLocationList,
  normalizeStateName,
  resolveLocationFromCatalog,
} from "@/lib/locationCatalog";
import { toLocationSlug } from "@/lib/listingsSlug";

export const fetchHotelStatesList = cache(async () => {
  try {
    const response = await fetch(
      buildApiUrl("api/packagemaker//get-packagemaker-hotel-states"),
      { next: { revalidate: 1800 } }
    );
    if (!response.ok) return [];
    const payload = await response.json();
    if (!payload?.success || !Array.isArray(payload.data)) return [];
    return normalizeLocationList(payload.data, normalizeStateName);
  } catch {
    return [];
  }
});

export const fetchHotelCitiesList = cache(async () => {
  try {
    const response = await fetch(
      buildApiUrl("api/packagemaker//get-packagemaker-hotel-cities"),
      { next: { revalidate: 1800 } }
    );
    if (!response.ok) return [];
    const payload = await response.json();
    if (!payload?.success || !Array.isArray(payload.data)) return [];
    return normalizeLocationList(payload.data, normalizeCityName);
  } catch {
    return [];
  }
});

async function getLocationCatalog() {
  const [cities, states] = await Promise.all([
    fetchHotelCitiesList(),
    fetchHotelStatesList(),
  ]);
  return { cities, states };
}

/** Match a URL slug to canonical city/state names from the API lists. */
export async function resolveLocationFromSlug(locationSlug, kind = null) {
  const slug = String(locationSlug || "").trim().toLowerCase();
  if (!slug) return { city: "", state: "", kind: null, ambiguous: false };

  const catalog = await getLocationCatalog();
  const resolved = resolveLocationFromCatalog(slug, catalog);
  return applyLocationKind(resolved, kind);
}

/** Match a label to a known city or state for API calls. */
export async function resolveLocationName(name, kind = null) {
  return resolveLocationFromSlug(toLocationSlug(name), kind);
}

/** Fix city/state fields parsed from slug-only listings URLs before API fetch. */
export async function resolveListingsLocationParams(params, locationSlug = "", kind = null) {
  const city = String(params?.city || "").trim();
  const state = String(params?.state || "").trim();
  const slug = String(locationSlug || toLocationSlug(city || state)).trim().toLowerCase();

  if (state && city && toLocationSlug(city) !== toLocationSlug(state)) {
    const catalog = await getLocationCatalog();
    return {
      ...params,
      city: resolveLocationFromCatalog(city, catalog).city || city,
      state: resolveLocationFromCatalog(state, catalog).state || state,
    };
  }

  if (!slug) return params;

  const inferredKind =
    kind || (state && !city ? "state" : city && !state ? "city" : null);
  const resolved = await resolveLocationFromSlug(slug, inferredKind);

  if (resolved.kind === "state") {
    return { ...params, city: "", state: resolved.state };
  }
  if (resolved.kind === "city") {
    return { ...params, city: resolved.city, state: "" };
  }

  return { ...params, city: resolved.city, state: resolved.state };
}
