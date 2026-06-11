import { toDateParam } from "@/lib/dates";
import { parseHotelIdFromSlug } from "@/lib/hotelListingsApi";

function mapLineItemForApi(item) {
  return {
    roomId: item.roomId,
    roomName: item.roomName,
    categoryLabel: item.categoryLabel,
    mealPlan: item.mealPlan,
    mealPlanLabel: item.mealPlanLabel,
    inclusion: item.inclusion || "",
    roomCount: item.roomCount,
    nights: item.nights,
    occupancyLabel: item.occupancyLabel || null,
    pricing: {
      baseSubtotal: item.baseSubtotal ?? item.subtotal,
      extraAdultSubtotal: item.extraAdultSubtotal ?? 0,
      subtotal: item.subtotal,
      gst: item.gst,
      total: item.total,
    },
    isComboPart: Boolean(item.isComboPart),
    isCustomCombo: Boolean(item.isCustomCombo),
  };
}

/**
 * Builds the JSON body to POST when creating a booking from checkout.
 */
export function buildCheckoutApiPayload({
  listing,
  checkIn,
  checkOut,
  guests,
  nights,
  hasInventorySelection,
  roomBooking,
  lineItems,
  subtotal,
  gst,
  total,
  nightly,
  memberSignIn = false,
  guest = {},
}) {
  const memberDiscount = memberSignIn ? Math.round(total * 0.1) : 0;
  const payableTotal = memberSignIn ? Math.round(total * 0.9) : total;
  const hotelId = listing.hotelId || parseHotelIdFromSlug(listing.slug) || null;

  return {
    property: {
      hotelId,
      slug: listing.slug,
      title: listing.title,
      location: listing.location,
      region: listing.region,
      category: listing.category,
    },
    stay: {
      checkIn: checkIn ? toDateParam(checkIn) : roomBooking?.checkIn || null,
      checkOut: checkOut ? toDateParam(checkOut) : roomBooking?.checkOut || null,
      nights,
    },
    guests: {
      adults: guests.adults,
      children: guests.children,
      rooms: guests.rooms,
      childAges: guests.childAges || [],
    },
    bookingType: hasInventorySelection ? "inventory" : "standard",
    rooms: hasInventorySelection ? (lineItems || []).map(mapLineItemForApi) : [],
    customRoomSlots: hasInventorySelection ? roomBooking?.customRoomSlots || null : null,
    totalRooms: hasInventorySelection
      ? roomBooking?.totalRooms || guests.rooms
      : guests.rooms,
    pricing: {
      currency: "INR",
      nightlyRate: hasInventorySelection ? null : nightly,
      subtotal,
      gst,
      total,
      memberDiscount,
      payableTotal,
    },
    guest: {
      firstName: guest.firstName || "",
      lastName: guest.lastName || "",
      fullName: guest.fullName || "",
      email: guest.email || "",
      country: guest.country || "India",
      mobile: guest.mobile || "",
      password: guest.password || "",
      memberSignIn: Boolean(memberSignIn),
    },
  };
}
