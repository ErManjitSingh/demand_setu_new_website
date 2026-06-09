"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatGuestsRoomsLabel } from "@/components/booking/GuestsRoomsPicker";
import BookingPriceBreakdown from "@/components/booking/BookingPriceBreakdown";
import { useTripSearch } from "@/hooks/useTripSearch";
import { formatPrice, getCategoryLabel } from "@/lib/listings";
import {
  daysUntil,
  formatBookingDate,
  nightsBetween,
  toDateParam,
} from "@/lib/dates";
import { calculateBookingPrice } from "@/lib/bookingPricing";
import { normalizeGuests } from "@/lib/bookingSearch";
import { serializeChildAgesParam } from "@/lib/guestOccupancy";
import { loadRoomSelection } from "@/lib/roomSelectionStorage";

const AMENITY_ICONS = {
  "Free WiFi": "📶",
  Pool: "🏊",
  Breakfast: "🍳",
  Parking: "🅿️",
  Kitchen: "🍴",
  AC: "❄️",
  Spa: "💆",
  "Pet friendly": "🐾",
};

function BookingCheckoutFormClient({
  listing,
  initialTrip,
  propertyHref,
}) {
  const urlParams = useSearchParams();
  const trip = useTripSearch(initialTrip);
  const [roomBooking, setRoomBooking] = useState(null);

  const checkIn = trip.checkIn;
  const checkOut = trip.checkOut;
  const { adults, children, rooms } = trip.guests;
  const nightly = Number(urlParams.get("price")) || listing.price;
  const isInventoryBooking = urlParams.get("inventory") === "1";

  const inventoryQueryKey = [
    urlParams.get("inventory"),
    urlParams.get("total"),
    urlParams.get("checkIn"),
    urlParams.get("checkOut"),
    urlParams.get("rooms"),
  ].join("|");

  useEffect(() => {
    setRoomBooking(loadRoomSelection(listing.slug));
  }, [listing.slug, inventoryQueryKey]);

  const nights = useMemo(
    () => nightsBetween(checkIn, checkOut, 1),
    [checkIn, checkOut]
  );

  const datesMatchSelection = useMemo(() => {
    if (!roomBooking?.checkIn || !roomBooking?.checkOut || !checkIn || !checkOut) {
      return false;
    }
    return (
      roomBooking.checkIn === toDateParam(checkIn) &&
      roomBooking.checkOut === toDateParam(checkOut)
    );
  }, [roomBooking, checkIn, checkOut]);

  const guestsMatchSelection = useMemo(() => {
    if (!roomBooking?.guests || !trip.guests) return false;
    const saved = normalizeGuests(roomBooking.guests);
    const current = normalizeGuests(trip.guests);
    return (
      saved.adults === current.adults &&
      saved.children === current.children &&
      saved.rooms === current.rooms &&
      serializeChildAgesParam(saved.childAges) ===
        serializeChildAgesParam(current.childAges)
    );
  }, [roomBooking, trip.guests]);

  const hasSavedLineItems =
    Array.isArray(roomBooking?.lineItems) && roomBooking.lineItems.length > 0;

  const hasInventorySelection = useMemo(() => {
    if (!hasSavedLineItems || !datesMatchSelection) return false;
    if (isInventoryBooking) return true;
    return guestsMatchSelection;
  }, [
    hasSavedLineItems,
    datesMatchSelection,
    isInventoryBooking,
    guestsMatchSelection,
  ]);

  const pricing = useMemo(() => {
    if (hasInventorySelection) {
      return {
        subtotal: Number(roomBooking.subtotal) || 0,
        gst: Number(roomBooking.gst) || 0,
        total: Number(roomBooking.total) || 0,
        lineItems: roomBooking.lineItems,
      };
    }
    const fallback = calculateBookingPrice(nightly, nights);
    return { ...fallback, lineItems: [] };
  }, [hasInventorySelection, roomBooking, nightly, nights]);

  const { subtotal, gst, total, lineItems } = pricing;
  const backToProperty = propertyHref || `/property/${listing.slug}`;
  const daysAway = daysUntil(checkIn);
  const locationScore = (listing.rating * 2).toFixed(1);
  const guestLabel = formatGuestsRoomsLabel({ adults, children, rooms });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("India");
  const [mobile, setMobile] = useState("");
  const [memberSignIn, setMemberSignIn] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const fullName = `${firstName} ${lastName}`.trim();

  const handleBook = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !mobile.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 900);
  };

  if (success) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-lg sm:p-10">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-3xl text-white shadow-lg">
          ✓
        </span>
        <h1 className="mt-5 text-2xl font-extrabold text-foreground">Successfully booked!</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          Thank you, <span className="font-bold text-foreground">{fullName}</span>. Your stay at{" "}
          <span className="font-bold text-foreground">{listing.title}</span> is confirmed. You
          will shortly receive a call on{" "}
          <span className="font-bold text-brand">{mobile}</span>.
        </p>
        <p className="mt-2 text-xs text-muted">Confirmation sent to {email}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={backToProperty}
            className="rounded-xl border border-stone-200 px-6 py-3 text-sm font-bold transition hover:border-brand"
          >
            Back to property
          </Link>
          <Link
            href="/listings"
            className="rounded-xl bg-brand px-6 py-3 text-sm font-extrabold text-white shadow-md"
          >
            Explore more stays
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:items-start lg:gap-8">
      {/* Left — property & booking summary */}
      <aside className="space-y-4 lg:sticky lg:top-24">
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
          <div className="relative aspect-[16/10] w-full bg-stone-100">
            <Image
              src={listing.image}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="360px"
              priority
            />
          </div>
          <div className="p-4">
            <div className="flex flex-wrap items-center gap-2">
              <StarRating rating={listing.rating} />
              <span className="rounded bg-brand-muted px-2 py-0.5 text-[10px] font-bold uppercase text-brand-dark">
                {getCategoryLabel(listing.category)}
              </span>
            </div>
            <h2 className="mt-2 text-lg font-extrabold leading-snug text-foreground">
              {listing.title}
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">
              {listing.location}, {listing.region}, India
            </p>
            <p className="mt-2 text-xs font-semibold text-emerald-700">
              Excellent location — {locationScore}
            </p>
            {listing.reviews > 0 && (
              <div className="mt-3 flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand text-sm font-extrabold text-white">
                  {listing.rating}
                </span>
                <div>
                  <p className="text-sm font-bold text-foreground">Exceptional</p>
                  <p className="text-xs text-muted">{listing.reviews} reviews</p>
                </div>
              </div>
            )}
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-stone-100 pt-4">
              {(listing.amenities ?? []).slice(0, 5).map((a) => (
                <li key={a} className="flex items-center gap-1.5 text-xs font-medium text-stone-600">
                  <span aria-hidden>{AMENITY_ICONS[a] ?? "✓"}</span>
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
          <h3 className="text-base font-extrabold text-foreground">Your booking details</h3>
          <div className="mt-4 grid grid-cols-2 gap-4 border-b border-stone-100 pb-4">
            <div>
              <p className="text-xs font-bold text-muted">Check-in</p>
              <p className="mt-1 text-sm font-bold text-foreground">
                {formatBookingDate(checkIn)}
              </p>
              <p className="mt-0.5 text-xs text-muted">From 14:00</p>
            </div>
            <div>
              <p className="text-xs font-bold text-muted">Check-out</p>
              <p className="mt-1 text-sm font-bold text-foreground">
                {formatBookingDate(checkOut)}
              </p>
              <p className="mt-0.5 text-xs text-muted">Until 12:00</p>
            </div>
          </div>
          {daysAway !== null && daysAway <= 7 && (
            <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-amber-700">
              <span className="text-base">⚠</span>
              {daysAway === 0
                ? "Checking in today!"
                : daysAway === 1
                  ? "Just 1 day away!"
                  : `Just ${daysAway} days away!`}
            </p>
          )}
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-muted">Total length of stay</dt>
              <dd className="font-bold">
                {nights} night{nights !== 1 ? "s" : ""}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted">Guests & rooms</dt>
              <dd className="text-right font-bold">{guestLabel}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
          <h3 className="text-base font-extrabold text-foreground">Price summary</h3>

          {hasInventorySelection ? (
            <div className="mt-3">
              <BookingPriceBreakdown
                lineItems={lineItems}
                subtotal={subtotal}
                gst={gst}
                total={total}
                nights={nights}
                scrollable
              />
            </div>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              <PriceRow
                label={`${formatPrice(nightly)} × ${nights} nights`}
                value={formatPrice(subtotal)}
              />
              <PriceRow label="GST (5%)" value={formatPrice(gst)} />
            </ul>
          )}

          {memberSignIn && (
            <p className="mt-3 flex justify-between text-sm text-emerald-700">
              <span>Member discount (10%)</span>
              <span className="font-bold">−{formatPrice(Math.round(total * 0.1))}</span>
            </p>
          )}

          <div className="mt-3 flex items-center justify-between border-t border-stone-200 pt-3">
            <span className="font-extrabold text-foreground">Total</span>
            <span className="text-xl font-extrabold text-brand">
              {formatPrice(memberSignIn ? Math.round(total * 0.9) : total)}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-muted">Includes 5% GST · INR</p>
        </div>

        {hasInventorySelection ? (
          <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
            <h3 className="text-base font-extrabold text-foreground">Selected rooms</h3>
            <ul className="mt-3 space-y-3 text-sm">
              {lineItems.map((item) => (
                <li
                  key={`${item.roomId}-${item.mealPlan}`}
                  className="rounded-lg border border-stone-100 bg-stone-50 p-3"
                >
                  <p className="font-bold text-foreground">{item.roomName}</p>
                  <p className="text-xs text-muted">{item.categoryLabel}</p>
                  <p className="mt-1 text-xs font-semibold text-brand">{item.mealPlanLabel}</p>
                  <p className="mt-1 text-xs text-muted">{item.inclusion}</p>
                  {item.occupancyLabel ? (
                    <p className="mt-2 text-[11px] leading-relaxed text-muted">
                      {item.occupancyLabel}
                    </p>
                  ) : null}
                  <p className="mt-2 space-y-0.5 text-xs text-foreground">
                    <span className="flex justify-between gap-2">
                      <span>Base rate</span>
                      <span>{formatPrice(item.baseSubtotal ?? item.subtotal)}</span>
                    </span>
                    {(item.extraAdultSubtotal ?? 0) > 0 ? (
                      <span className="flex justify-between gap-2 text-brand">
                        <span>Extra adult</span>
                        <span>{formatPrice(item.extraAdultSubtotal)}</span>
                      </span>
                    ) : null}
                    <span className="flex justify-between gap-2 font-bold">
                      <span>
                        {item.roomCount} room{item.roomCount !== 1 ? "s" : ""} · {item.nights} night
                        {item.nights !== 1 ? "s" : ""}
                      </span>
                      <span>{formatPrice(item.total)} incl. GST</span>
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </aside>

      {/* Right — guest form */}
      <div className="min-w-0 space-y-4">
        <div className="rounded-xl border border-brand/20 bg-brand-muted/30 px-4 py-3.5 text-sm text-stone-700">
          <span className="font-bold text-brand">Save 10% or more</span> when you{" "}
          <Link href="/signin" className="font-bold text-brand underline">
            sign in
          </Link>{" "}
          or{" "}
          <Link href="/signup" className="font-bold text-brand underline">
            create a free account
          </Link>
          .
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-xl font-extrabold text-foreground sm:text-2xl">Enter your details</h2>

          <div className="mt-4 flex items-start gap-3 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-200 text-xs font-bold text-stone-600">
              i
            </span>
            <p className="text-sm text-muted">
              Almost done! Just fill in the <span className="font-bold text-brand">*</span> required
              info
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field
              label="First name"
              id="firstName"
              required
              value={firstName}
              onChange={setFirstName}
            />
            <Field
              label="Last name"
              id="lastName"
              required
              value={lastName}
              onChange={setLastName}
            />
          </div>

          <div className="mt-4">
            <Field
              label="Email address"
              id="email"
              type="email"
              required
              value={email}
              onChange={setEmail}
              hint="Confirmation email will be sent to this address"
            />
          </div>

          <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-lg border border-stone-100 bg-stone-50/80 p-3">
            <input
              type="checkbox"
              checked={memberSignIn}
              onChange={(e) => setMemberSignIn(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-stone-300 text-brand"
            />
            <span className="text-sm">
              <span className="font-bold text-foreground">
                Sign in to save 10% or more (optional)
              </span>
              <span className="mt-0.5 block text-xs text-muted">
                Member prices apply at checkout when signed in
              </span>
            </span>
          </label>

          <div className="mt-4">
            <label htmlFor="country" className="block text-sm font-bold text-foreground">
              Country/region <span className="text-brand">*</span>
            </label>
            <select
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              {["India", "United States", "United Kingdom", "UAE", "Singapore", "Australia"].map(
                (c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="mt-4">
            <label htmlFor="mobile" className="block text-sm font-bold text-foreground">
              Phone number <span className="text-brand">*</span>
            </label>
            <p className="mt-0.5 text-xs text-muted">
              Needed by the property to validate your booking
            </p>
            <div className="mt-1.5 flex gap-2">
              <span className="flex shrink-0 items-center rounded-lg border border-stone-300 bg-stone-50 px-3 text-sm font-semibold text-stone-600">
                IN +91
              </span>
              <input
                id="mobile"
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="98765 43210"
                className="min-w-0 flex-1 rounded-lg border border-stone-300 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={loading}
              onClick={handleBook}
              className="rounded-xl bg-brand py-4 text-sm font-extrabold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark disabled:opacity-70"
            >
              {loading ? "Processing…" : "Pay now"}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleBook}
              className="rounded-xl border-2 border-brand bg-white py-4 text-sm font-extrabold text-brand transition hover:bg-brand-muted disabled:opacity-70"
            >
              {loading ? "Booking…" : "Book now — pay at property"}
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-muted">
            Free cancellation up to 48 hours before check-in · Best price guarantee
          </p>
        </div>
      </div>
    </div>
  );
}

export default function BookingCheckoutForm(props) {
  return (
    <Suspense
      fallback={
        <div className="grid gap-6 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]">
          <div className="h-[520px] animate-pulse rounded-xl bg-stone-200" />
          <div className="h-[640px] animate-pulse rounded-xl bg-stone-200" />
        </div>
      }
    >
      <BookingCheckoutFormClient {...props} />
    </Suspense>
  );
}

function Field({ label, id, value, onChange, placeholder, type = "text", required, hint }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-foreground">
        {label} {required && <span className="text-brand">*</span>}
      </label>
      {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
    </div>
  );
}

function PriceRow({ label, value, accent }) {
  return (
    <li className={`flex justify-between gap-2 ${accent ? "text-emerald-700" : ""}`}>
      <span className="text-muted">{label}</span>
      <span className="font-semibold">{value}</span>
    </li>
  );
}
function StarRating({ rating }) {
  const full = Math.min(5, Math.round(rating));
  return (
    <span className="flex gap-0.5 text-amber-500" aria-label={`${rating} stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="text-sm">
          {i < full ? "★" : "☆"}
        </span>
      ))}
    </span>
  );
}

