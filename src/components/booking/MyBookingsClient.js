"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { formatPrice } from "@/lib/listings";
import { formatBookingDate } from "@/lib/dates";
import { useGuestAuth } from "@/hooks/useGuestAuth";
import {
  getBookingsByMobile,
  getGuestProfileFromSession,
} from "@/lib/inventoryBookingApi";
import {
  canPayBookingOnline,
  getBookingAmountDue,
  payInventoryBookingOnline,
} from "@/lib/razorpayDemandApi";

function parseApiDate(value) {
  if (!value) return null;
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatStatusLabel(value) {
  const label = String(value || "pending").replace(/_/g, " ");
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function getPaymentBadgeClass(payment) {
  const status = String(payment || "pending").toLowerCase();
  if (status === "completed") return "bg-emerald-100 text-emerald-800";
  if (status === "partially_paid") return "bg-amber-100 text-amber-900";
  if (status === "rejected") return "bg-red-100 text-red-800";
  return "bg-white text-brand-dark";
}

function getRoomSummary(rooms = []) {
  if (!rooms.length) return "Standard booking";
  if (rooms.length === 1) {
    const room = rooms[0];
    return `${room.roomName} · ${room.mealPlanLabel || room.mealPlan}`;
  }
  return `${rooms.length} room types · ${rooms.reduce((sum, r) => sum + (r.roomCount || 0), 0)} rooms`;
}

function getGuestsLabel(guests) {
  if (!guests) return "—";
  const adults = guests.adults ?? 0;
  const children = guests.children ?? 0;
  const rooms = guests.rooms ?? 1;
  const childPart = children > 0 ? `, ${children} child${children !== 1 ? "ren" : ""}` : "";
  return `${adults} adult${adults !== 1 ? "s" : ""}${childPart} · ${rooms} room${rooms !== 1 ? "s" : ""}`;
}

function BookingCard({ booking, onPayNow, paying, payError }) {
  const checkInDate = parseApiDate(booking.stay?.checkIn);
  const checkOutDate = parseApiDate(booking.stay?.checkOut);
  const property = booking.property || {};
  const total = booking.pricing?.payableTotal ?? booking.pricing?.total ?? 0;
  const amountDue = getBookingAmountDue(booking);
  const showPayNow = canPayBookingOnline(booking) && amountDue > 0;
  const bookingRef = String(booking._id || "").slice(-8).toUpperCase();
  const isPartial = String(booking.payment || "").toLowerCase() === "partially_paid";

  return (
    <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="bg-gradient-to-r from-brand via-orange-500 to-orange-400 px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-white/80">
            Booking #{bookingRef}
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase text-white backdrop-blur-sm">
              {formatStatusLabel(booking.tourCompleted)}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${getPaymentBadgeClass(booking.payment)}`}
            >
              {formatStatusLabel(booking.payment)}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-extrabold leading-snug text-foreground sm:text-xl">
              {property.title || "Hotel stay"}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {property.location}
              {property.region ? ` · ${property.region}` : ""}
            </p>
            {property.slug ? (
              <Link
                href={`/property/${property.slug}`}
                className="mt-2 inline-block text-xs font-bold text-brand hover:underline"
              >
                View property →
              </Link>
            ) : null}
          </div>
          <div className="shrink-0 rounded-xl bg-brand-muted px-4 py-2 text-right">
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted">Total</p>
            <p className="text-xl font-extrabold text-brand">{formatPrice(total)}</p>
            {isPartial && booking.amountPaid > 0 ? (
              <p className="mt-1 text-[10px] font-semibold text-muted">
                Paid {formatPrice(booking.amountPaid)}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-stone-100 bg-stone-50 px-3 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted">Check-in</p>
            <p className="mt-0.5 text-sm font-bold text-foreground">
              {checkInDate ? formatBookingDate(checkInDate) : booking.stay?.checkIn}
            </p>
          </div>
          <div className="rounded-xl border border-stone-100 bg-stone-50 px-3 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted">Check-out</p>
            <p className="mt-0.5 text-sm font-bold text-foreground">
              {checkOutDate ? formatBookingDate(checkOutDate) : booking.stay?.checkOut}
            </p>
          </div>
          <div className="rounded-xl border border-stone-100 bg-stone-50 px-3 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted">Guests</p>
            <p className="mt-0.5 text-sm font-bold text-foreground">
              {getGuestsLabel(booking.guests)}
            </p>
          </div>
          <div className="rounded-xl border border-stone-100 bg-stone-50 px-3 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted">Nights</p>
            <p className="mt-0.5 text-sm font-bold text-foreground">
              {booking.stay?.nights ?? "—"}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-brand/15 bg-brand-muted/40 px-3 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-brand-dark">Rooms</p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {getRoomSummary(booking.rooms)}
          </p>
          {booking.rooms?.length ? (
            <ul className="mt-2 space-y-1.5">
              {booking.rooms.map((room, index) => (
                <li
                  key={`${room.roomId}-${room.mealPlan}-${index}`}
                  className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted"
                >
                  <span>
                    {room.roomName} × {room.roomCount}
                    {room.isComboPart ? " (combo)" : ""}
                  </span>
                  <span className="font-bold text-foreground">
                    {formatPrice(room.pricing?.total ?? room.total)}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {showPayNow ? (
          <div className="mt-4 rounded-xl border border-brand/25 bg-gradient-to-r from-brand-muted/80 to-orange-50/70 px-4 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-foreground">
                  {isPartial ? "Balance due" : "Payment required"}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  Pay online now to confirm your booking
                </p>
                <p className="mt-1 text-lg font-extrabold text-brand">
                  {formatPrice(amountDue)}
                </p>
              </div>
              <button
                type="button"
                disabled={paying}
                onClick={() => onPayNow(booking)}
                className="shrink-0 rounded-xl bg-gradient-to-r from-brand to-orange-500 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-brand/25 transition hover:from-brand-dark hover:to-orange-600 disabled:opacity-70"
              >
                {paying ? "Opening payment…" : "Pay now"}
              </button>
            </div>
            {payError ? (
              <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                {payError}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4 text-xs text-muted">
          <span>
            Booked on{" "}
            {booking.createdAt
              ? new Date(booking.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "—"}
          </span>
          <span className="font-semibold text-foreground">
            {booking.bookingType === "inventory" ? "Inventory booking" : "Standard booking"}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function MyBookingsClient() {
  const router = useRouter();
  const { session, isLoggedIn, ready } = useGuestAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payingId, setPayingId] = useState(null);
  const [payErrorById, setPayErrorById] = useState({});

  const profile = getGuestProfileFromSession(session);
  const guestName = profile?.fullName || "Guest";
  const mobile = profile?.mobile || session?.mobile || "";

  const loadBookings = useCallback(async () => {
    if (!mobile) return;
    const response = await getBookingsByMobile(mobile);
    setBookings(Array.isArray(response?.data) ? response.data : []);
  }, [mobile]);

  useEffect(() => {
    if (ready && !isLoggedIn) {
      router.replace("/signin");
    }
  }, [ready, isLoggedIn, router]);

  useEffect(() => {
    if (!ready || !isLoggedIn || !mobile) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");
      try {
        await loadBookings();
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Could not load your bookings.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ready, isLoggedIn, mobile, loadBookings]);

  const handlePayNow = async (booking) => {
    const bookingId = booking._id;
    setPayingId(bookingId);
    setPayErrorById((prev) => ({ ...prev, [bookingId]: "" }));

    try {
      await payInventoryBookingOnline(booking);
      await loadBookings();
    } catch (err) {
      const message = err?.message || "Payment failed. Please try again.";
      setPayErrorById((prev) => ({
        ...prev,
        [bookingId]:
          message === "Payment cancelled"
            ? "Payment was cancelled. You can try again anytime."
            : message,
      }));
    } finally {
      setPayingId(null);
    }
  };

  if (!ready || !isLoggedIn) {
    return (
      <div className="min-h-screen bg-stone-100">
        <div className="mx-auto max-w-4xl space-y-4 px-4 py-16 sm:px-6">
          <div className="h-24 animate-pulse rounded-2xl bg-stone-200" />
          <div className="h-48 animate-pulse rounded-2xl bg-stone-200" />
          <div className="h-48 animate-pulse rounded-2xl bg-stone-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            My Bookings
          </h1>
          <p className="mt-2 text-sm text-muted">
            Welcome back, <span className="font-semibold text-foreground">{guestName}</span>.
            {mobile ? (
              <>
                {" "}
                Showing bookings for{" "}
                <span className="font-semibold text-foreground">+91 {mobile}</span>
              </>
            ) : null}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-56 animate-pulse rounded-2xl bg-stone-200" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-8 text-center">
            <p className="text-sm font-semibold text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white"
            >
              Try again
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white px-6 py-14 text-center shadow-sm">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-muted text-2xl">
              🛏️
            </span>
            <h2 className="mt-4 text-lg font-extrabold text-foreground">No bookings yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
              When you complete a stay booking, it will appear here.
            </p>
            <Link
              href="/listings"
              className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-brand to-orange-500 px-6 py-3 text-sm font-extrabold text-white shadow-md"
            >
              Explore stays
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-muted">
              {bookings.length} booking{bookings.length !== 1 ? "s" : ""} found
            </p>
            {bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onPayNow={handlePayNow}
                paying={payingId === booking._id}
                payError={payErrorById[booking._id]}
              />
            ))}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-muted">
          Need help?{" "}
          <a href="tel:+918353056000" className="font-semibold text-brand hover:underline">
            Call +91 8353056000
          </a>
        </p>
      </div>
    </div>
  );
}
