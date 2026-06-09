import { getListingBySlug } from "@/lib/listings";
import {
  fetchHotelById,
  mapHotelToListing,
  parseHotelIdFromSlug,
} from "@/lib/hotelListingsApi";

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
