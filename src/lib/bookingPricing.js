export const GST_RATE = 0.05;
export const PROPERTY_PRICE_MARKUP_MULTIPLIER = 1.25;

export function applyPropertyPriceMarkup(amount) {
  const value = Math.max(Number(amount) || 0, 0);
  if (value === 0) return 0;
  return Math.round(value * PROPERTY_PRICE_MARKUP_MULTIPLIER);
}

/** Base total before the 25% property-page markup. */
export function removePropertyPriceMarkup(amount) {
  const value = Math.max(Number(amount) || 0, 0);
  if (value === 0) return 0;
  return Math.round(value / PROPERTY_PRICE_MARKUP_MULTIPLIER);
}

/** Base subtotal + GST (5%), without the 25% property-page markup. */
export function getBaseTotalWithGst(subtotal) {
  const baseSubtotal = removePropertyPriceMarkup(subtotal);
  const baseGst = Math.round(baseSubtotal * GST_RATE);
  return baseSubtotal + baseGst;
}

export function applyPropertyPricingMarkup(pricing) {
  if (!pricing) return pricing;

  const subtotal = applyPropertyPriceMarkup(pricing.subtotal);
  const baseSubtotal = applyPropertyPriceMarkup(
    pricing.baseSubtotal ?? pricing.subtotal
  );
  const extraAdultSubtotal = applyPropertyPriceMarkup(pricing.extraAdultSubtotal ?? 0);
  const gst = Math.round(subtotal * GST_RATE);
  const roomDetails = Array.isArray(pricing.roomDetails)
    ? pricing.roomDetails.map((room) => ({
        ...room,
        baseSubtotal: applyPropertyPriceMarkup(room.baseSubtotal),
        extraAdultSubtotal: applyPropertyPriceMarkup(room.extraAdultSubtotal),
        subtotal: applyPropertyPriceMarkup(room.subtotal),
      }))
    : pricing.roomDetails;

  return {
    ...pricing,
    subtotal,
    baseSubtotal,
    extraAdultSubtotal,
    gst,
    total: subtotal + gst,
    ...(roomDetails ? { roomDetails } : {}),
  };
}

export function calculateBookingPrice(nightly, nights) {
  const rate = Math.max(Number(nightly) || 0, 0);
  const stayNights = Math.max(Number(nights) || 1, 1);
  const subtotal = rate * stayNights;
  const gst = Math.round(subtotal * GST_RATE);
  const total = subtotal + gst;

  return { subtotal, gst, total, nights: stayNights };
}
