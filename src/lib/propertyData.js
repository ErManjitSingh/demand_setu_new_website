import { getListingBySlug } from "@/lib/listings";
import {
  fetchHotelById,
  fetchListingsForLocation,
  mapHotelToListing,
  parseHotelIdFromSlug,
} from "@/lib/hotelListingsApi";
import { resolveLocationFromSlug } from "@/lib/locationResolve";
import {
  parsePropertySegment,
  propertyNameMatchesSegment,
} from "@/lib/propertySlug";

export async function resolvePropertyBySlug(slug) {
  const staticListing = getListingBySlug(slug);
  if (staticListing) {
    return { listing: staticListing, hotel: null, source: "static" };
  }

  const hotelId = parseHotelIdFromSlug(slug);
  if (!hotelId) return null;

  const hotel = await fetchHotelById(hotelId);
  if (!hotel) return null;

  return {
    listing: mapHotelToListing(hotel),
    hotel,
    source: "api",
  };
}

export async function resolvePropertyByRouteParams(routeParams) {
  const propertySegment = String(routeParams?.property || "").trim();
  const locationSlug = String(routeParams?.location || "").trim().toLowerCase();
  if (!propertySegment) return null;

  const parsed = parsePropertySegment(propertySegment);
  if (parsed.hotelId) {
    return resolvePropertyBySlug(parsed.internalSlug);
  }

  const staticListing = getListingBySlug(propertySegment);
  if (staticListing) {
    return { listing: staticListing, hotel: null, source: "static" };
  }

  if (!locationSlug) return null;

  const location = await resolveLocationFromSlug(locationSlug);
  const { listings } = await fetchListingsForLocation({
    city: location.city,
    state: location.state,
  });

  const match = listings.find((item) =>
    propertyNameMatchesSegment(item, propertySegment)
  );
  if (!match) return null;

  const hotelId = match.hotelId || parseHotelIdFromSlug(match.slug);
  if (!hotelId) return null;

  const hotel = await fetchHotelById(hotelId);
  if (!hotel) return null;

  return {
    listing: mapHotelToListing(hotel),
    hotel,
    source: "api",
  };
}
