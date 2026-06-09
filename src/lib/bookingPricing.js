export const GST_RATE = 0.05;

export function calculateBookingPrice(nightly, nights) {
  const rate = Math.max(Number(nightly) || 0, 0);
  const stayNights = Math.max(Number(nights) || 1, 1);
  const subtotal = rate * stayNights;
  const gst = Math.round(subtotal * GST_RATE);
  const total = subtotal + gst;

  return { subtotal, gst, total, nights: stayNights };
}
