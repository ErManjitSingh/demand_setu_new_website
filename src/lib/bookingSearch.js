import { getDefaultBookingDates, parseDateParam, toDateParam, addDays } from "@/lib/dates";
import {
  applyMinimumRooms,
  getGuestOccupancyError,
  getMinimumRoomsRequired,
  normalizeChildAges,
  parseChildAgesParam,
  serializeChildAgesParam,
} from "@/lib/guestOccupancy";
import { getApiPropertyType } from "@/lib/propertyTypes";

const SESSION_KEY = "demand_setu_booking";

export const TRIP_SEARCH_UPDATED = "demand-setu-trip-search-updated";

function notifyTripSearchUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(TRIP_SEARCH_UPDATED));
}

export const DEFAULT_GUESTS = { adults: 2, children: 0, rooms: 1, childAges: [] };

/** Fill missing check-in/out and guests with today, tomorrow, and 2 adults / 1 room. */
export function fillMissingBookingDefaults(trip = {}) {
  const defaults = getDefaultBookingDates();
  let checkIn = trip.checkIn || defaults.checkIn;
  let checkOut = trip.checkOut || defaults.checkOut;

  if (!checkOut || checkOut <= checkIn) {
    checkOut = addDays(checkIn, 1);
  }

  return {
    ...trip,
    checkIn,
    checkOut,
    guests: normalizeGuests(trip.guests),
  };
}

export function normalizeGuests(guests) {
  const g = guests || DEFAULT_GUESTS;
  const adults = Math.max(1, Number.parseInt(String(g.adults ?? 2), 10) || 2);
  const children = Math.max(0, Number.parseInt(String(g.children ?? 0), 10) || 0);
  const rooms = Math.max(1, Number.parseInt(String(g.rooms ?? 1), 10) || 1);
  const childAges = normalizeChildAges(
    Array.isArray(g.childAges) ? g.childAges : parseChildAgesParam(g.childAges),
    children
  );

  return applyMinimumRooms({ adults, children, rooms, childAges });
}

export function parseGuestsFromParams(params) {
  if (!params) return { ...DEFAULT_GUESTS };
  const get = (key, fallback) => {
    if (typeof params.get === "function") return params.get(key);
    return params[key];
  };
  return normalizeGuests({
    adults: get("adults", "2"),
    children: get("children", "0"),
    rooms: get("rooms", "1"),
    childAges: parseChildAgesParam(get("childAges", "")),
  });
}

export function parseBookingFromParams(params) {
  const get = (key) => {
    if (!params) return "";
    if (typeof params.get === "function") return params.get(key) || "";
    return String(params[key] || "");
  };

  return {
    checkIn: parseDateParam(get("checkIn")),
    checkOut: parseDateParam(get("checkOut")),
    guests: parseGuestsFromParams(params),
  };
}

/** Full trip: location, category, dates, guests (from URL or plain object). */
export function parseTripFromSearchParams(params) {
  const get = (key) => {
    if (!params) return "";
    if (typeof params.get === "function") return params.get(key) || "";
    return String(params[key] || "");
  };

  const category = get("category").trim() || "all";
  const booking = parseBookingFromParams(params);

  return {
    category,
    city: get("city").trim(),
    state: get("state").trim(),
    ...booking,
  };
}

export function hasSearchParam(params, key) {
  if (!params) return false;
  if (typeof params.has === "function") return params.has(key);
  return params[key] != null && params[key] !== "";
}

export function validateSearchDates({ checkIn, checkOut }) {
  if (!checkIn || !checkOut) {
    return "Check-in and check-out dates are required.";
  }
  if (checkOut <= checkIn) {
    return "Check-out must be after check-in.";
  }
  return null;
}

export function validateTripSearch({ city, state, checkIn, checkOut, guests }) {
  const destination = String(city || "").trim() || String(state || "").trim();
  if (!destination) {
    return "Please select a city or state.";
  }

  const dateError = validateSearchDates({ checkIn, checkOut });
  if (dateError) return dateError;

  const g = normalizeGuests(guests);
  if (g.adults < 1) return "At least 1 adult guest is required.";
  if (g.rooms < 1) return "At least 1 room is required.";
  if (g.rooms < getMinimumRoomsRequired(g)) {
    return `Please select at least ${getMinimumRoomsRequired(g)} rooms for your guests.`;
  }

  return getGuestOccupancyError(g);
}

export function validatePropertyBooking({ checkIn, checkOut, guests }) {
  const dateError = validateSearchDates({ checkIn, checkOut });
  if (dateError) return dateError;

  const g = normalizeGuests(guests);
  if (g.adults < 1) return "At least 1 adult guest is required.";
  if (g.rooms < 1) return "At least 1 room is required.";
  if (g.rooms < getMinimumRoomsRequired(g)) {
    return `Please select at least ${getMinimumRoomsRequired(g)} rooms for your guests.`;
  }

  return getGuestOccupancyError(g);
}

export function appendBookingToParams(params, { checkIn, checkOut, guests }) {
  const next = params instanceof URLSearchParams ? new URLSearchParams(params) : new URLSearchParams();

  if (checkIn) next.set("checkIn", toDateParam(checkIn));
  else next.delete("checkIn");

  if (checkOut) next.set("checkOut", toDateParam(checkOut));
  else next.delete("checkOut");

  const g = normalizeGuests(guests);
  next.set("adults", String(g.adults));
  next.set("children", String(g.children));
  next.set("rooms", String(g.rooms));
  if (g.children > 0 && g.childAges?.length) {
    next.set("childAges", serializeChildAgesParam(g.childAges));
  } else {
    next.delete("childAges");
  }

  return next;
}

/** Apply trip fields to existing query string (keeps filters: price, stars, sort, etc.). */
export function applyTripToParams(params, trip) {
  const next = params instanceof URLSearchParams ? new URLSearchParams(params) : new URLSearchParams();

  const category = trip.category ?? "all";
  if (category && category !== "all") {
    next.set("category", category);
    const propertyType = getApiPropertyType(category);
    if (propertyType) next.set("propertyType", propertyType);
    else next.delete("propertyType");
  } else {
    next.delete("category");
    next.delete("propertyType");
  }

  const city = String(trip.city || "").trim();
  const state = String(trip.state || "").trim();
  if (city) next.set("city", city);
  else next.delete("city");
  if (state) next.set("state", state);
  else next.delete("state");

  appendBookingToParams(next, trip);
  return next;
}

export function buildListingsSearchUrl({
  category,
  city = "",
  state = "",
  checkIn,
  checkOut,
  guests,
  extraParams = "",
} = {}) {
  const params = new URLSearchParams(extraParams);

  const trip = {
    category: category ?? "all",
    city,
    state,
    checkIn,
    checkOut,
    guests,
  };

  return buildListingsUrlFromParams(applyTripToParams(params, trip));
}

export function buildListingsUrlFromParams(params) {
  const query = params.toString();
  return query ? `/listings?${query}` : "/listings";
}

export function buildPropertyUrl(slug, trip = {}) {
  const params = applyTripToParams(new URLSearchParams(), {
    category: trip.category,
    city: trip.city,
    state: trip.state,
    checkIn: trip.checkIn,
    checkOut: trip.checkOut,
    guests: trip.guests,
  });
  const query = params.toString();
  return query ? `/property/${slug}?${query}` : `/property/${slug}`;
}

export function buildPropertyUrlPreservingTrip(searchParams, slug, trip) {
  const params = applyTripToParams(new URLSearchParams(), trip);
  const query = params.toString();
  return query ? `/property/${slug}?${query}` : `/property/${slug}`;
}

export function buildBookUrl(slug, trip = {}, { price } = {}) {
  const params = applyTripToParams(new URLSearchParams(), trip);
  if (price != null && price !== "") params.set("price", String(price));
  const query = params.toString();
  return query ? `/property/${slug}/book?${query}` : `/property/${slug}/book`;
}

const INVENTORY_BOOKING_PARAMS = ["inventory", "total", "subtotal", "gst", "roomsSelected"];

export function appendInventoryBookingToParams(params, sourceParams) {
  const source =
    sourceParams instanceof URLSearchParams
      ? sourceParams
      : new URLSearchParams(sourceParams?.toString?.() || "");

  if (source.get("inventory") === "1") {
    params.set("inventory", "1");
    for (const key of INVENTORY_BOOKING_PARAMS) {
      if (key === "inventory") continue;
      const value = source.get(key);
      if (value) params.set(key, value);
    }
    return params;
  }

  const price = source.get("price");
  if (price) params.set("price", price);
  return params;
}

export function buildBookUrlPreservingTrip(searchParams, slug, trip, { price } = {}) {
  const params = applyTripToParams(new URLSearchParams(), trip);
  const source =
    searchParams instanceof URLSearchParams
      ? searchParams
      : new URLSearchParams(searchParams?.toString?.() || "");

  if (source.get("inventory") === "1") {
    appendInventoryBookingToParams(params, source);
  } else {
    const resolvedPrice = price ?? source.get("price") ?? "";
    if (resolvedPrice !== "") params.set("price", String(resolvedPrice));
  }

  const query = params.toString();
  return query ? `/property/${slug}/book?${query}` : `/property/${slug}/book`;
}

export function saveTripSearch(trip) {
  if (typeof window === "undefined") return;
  try {
    const payload = {
      category: trip.category && trip.category !== "all" ? trip.category : "",
      city: String(trip.city || "").trim(),
      state: String(trip.state || "").trim(),
      checkIn: trip.checkIn ? toDateParam(trip.checkIn) : "",
      checkOut: trip.checkOut ? toDateParam(trip.checkOut) : "",
      guests: normalizeGuests(trip.guests),
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
    notifyTripSearchUpdated();
  } catch {
    /* ignore */
  }
}

/**
 * Save trip to session and optionally sync the current page URL (property / listings).
 * Merges with any existing session trip so partial updates stay consistent.
 */
export function persistTripSearch(trip, sync) {
  const existing = loadTripSearch();
  const merged = {
    category: trip.category ?? existing?.category ?? "all",
    city: trip.city !== undefined ? String(trip.city || "").trim() : existing?.city || "",
    state: trip.state !== undefined ? String(trip.state || "").trim() : existing?.state || "",
    checkIn: trip.checkIn !== undefined ? trip.checkIn : existing?.checkIn || null,
    checkOut: trip.checkOut !== undefined ? trip.checkOut : existing?.checkOut || null,
    guests: normalizeGuests(trip.guests ?? existing?.guests),
  };

  saveTripSearch(merged);

  if (!sync?.router || !sync?.pathname) return merged;

  const params =
    sync.searchParams instanceof URLSearchParams
      ? sync.searchParams
      : new URLSearchParams(sync.searchParams?.toString?.() || "");

  const propertyMatch = sync.pathname.match(/^\/property\/([^/]+)$/);
  if (propertyMatch) {
    const next = buildPropertyUrlPreservingTrip(params, propertyMatch[1], merged);
    sync.router.replace(next, { scroll: false });
    return merged;
  }

  if (sync.pathname === "/listings") {
    const next = buildListingsUrlPreservingFilters(params, merged);
    sync.router.replace(next, { scroll: false });
  }

  return merged;
}

/** @deprecated Use saveTripSearch — kept for callers that only pass dates/guests. */
export function saveBookingSession(booking) {
  saveTripSearch(booking);
}

export function loadTripSearch() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return {
      category: String(data.category || "").trim() || "all",
      city: String(data.city || "").trim(),
      state: String(data.state || "").trim(),
      checkIn: parseDateParam(data.checkIn),
      checkOut: parseDateParam(data.checkOut),
      guests: normalizeGuests(data.guests),
    };
  } catch {
    return null;
  }
}

/** @deprecated Use loadTripSearch */
export function loadBookingSession() {
  const trip = loadTripSearch();
  if (!trip) return null;
  return {
    checkIn: trip.checkIn,
    checkOut: trip.checkOut,
    guests: trip.guests,
  };
}

/** Fill missing URL trip fields from session (URL wins when present). */
export function mergeTripFromUrlAndSession(searchParams, session) {
  const url = parseTripFromSearchParams(searchParams);
  if (!session) return url;

  const hasLocation =
    hasSearchParam(searchParams, "city") || hasSearchParam(searchParams, "state");
  const hasCheckIn = hasSearchParam(searchParams, "checkIn");
  const hasCheckOut = hasSearchParam(searchParams, "checkOut");
  const hasGuests =
    hasSearchParam(searchParams, "adults") &&
    hasSearchParam(searchParams, "rooms");
  const hasCategory = hasSearchParam(searchParams, "category");

  return {
    category: hasCategory ? url.category : session.category || url.category,
    city: hasLocation ? url.city : session.city || url.city,
    state: hasLocation ? url.state : session.state || url.state,
    checkIn: hasCheckIn ? url.checkIn : session.checkIn || url.checkIn,
    checkOut: hasCheckOut ? url.checkOut : session.checkOut || url.checkOut,
    guests: hasGuests ? url.guests : session.guests || url.guests,
  };
}

export function tripParamsNeedSync(searchParams, mergedTrip) {
  const url = parseTripFromSearchParams(searchParams);

  if ((mergedTrip.city || "") !== (url.city || "")) return true;
  if ((mergedTrip.state || "") !== (url.state || "")) return true;
  if ((mergedTrip.category || "all") !== (url.category || "all")) return true;

  const urlIn = url.checkIn?.getTime?.() ?? null;
  const mergedIn = mergedTrip.checkIn?.getTime?.() ?? null;
  if (urlIn !== mergedIn) return true;

  const urlOut = url.checkOut?.getTime?.() ?? null;
  const mergedOut = mergedTrip.checkOut?.getTime?.() ?? null;
  if (urlOut !== mergedOut) return true;

  const g = normalizeGuests(url.guests);
  const m = normalizeGuests(mergedTrip.guests);
  if (g.adults !== m.adults || g.children !== m.children || g.rooms !== m.rooms) return true;
  if (serializeChildAgesParam(g.childAges) !== serializeChildAgesParam(m.childAges)) return true;

  return false;
}

/** Plain strings for passing trip from Server Components to Client Components. */
export function serializeTripForClient(trip) {
  return {
    category: trip?.category || "all",
    city: String(trip?.city || "").trim(),
    state: String(trip?.state || "").trim(),
    checkIn: trip?.checkIn ? toDateParam(trip.checkIn) : "",
    checkOut: trip?.checkOut ? toDateParam(trip.checkOut) : "",
    guests: normalizeGuests(trip?.guests),
  };
}

export function buildListingsUrlPreservingFilters(searchParams, trip) {
  const base =
    searchParams instanceof URLSearchParams
      ? searchParams
      : new URLSearchParams(searchParams?.toString?.() || "");
  return buildListingsUrlFromParams(applyTripToParams(base, trip));
}
