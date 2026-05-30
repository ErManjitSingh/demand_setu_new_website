"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/listings";
import { addDays, nightsBetween, startOfDay, toDateParam } from "@/lib/dates";
import BookingDateRangePicker from "@/components/booking/BookingDateRangePicker";
import GuestsRoomsPicker from "@/components/booking/GuestsRoomsPicker";

export default function PropertyBookingCard({ listing, selectedRoomPrice }) {
  const router = useRouter();
  const nightly = selectedRoomPrice ?? listing.price;
  const today = startOfDay(new Date());

  const [checkIn, setCheckIn] = useState(() => addDays(today, 7));
  const [checkOut, setCheckOut] = useState(() => addDays(today, 12));
  const [guests, setGuests] = useState({
    adults: Math.min(listing.guests, 2) || 2,
    children: 0,
    rooms: 1,
  });

  const nights = useMemo(
    () => nightsBetween(checkIn, checkOut, 5),
    [checkIn, checkOut]
  );
  const cleaning = 800;
  const service = Math.round(nightly * 0.12);
  const total = nightly * nights + cleaning + service;
  const savePct =
    listing.originalPrice && !selectedRoomPrice
      ? Math.round(
          ((listing.originalPrice - nightly) / listing.originalPrice) * 100
        )
      : null;

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-[0_12px_48px_rgba(28,25,23,0.14)] ring-1 ring-stone-200/90">
      <div className="border-b border-orange-100/80 bg-gradient-to-r from-brand-muted via-orange-50 to-amber-50 px-5 py-3.5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-brand">
          Book your stay
        </p>
        <p className="mt-0.5 text-xs text-muted">Best price on Demand Setu</p>
      </div>

      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-3xl font-extrabold tracking-tight text-foreground">
                {formatPrice(nightly)}
              </span>
              <span className="text-sm font-medium text-muted">/ night</span>
            </div>
            {listing.originalPrice && savePct > 0 && (
              <p className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-muted line-through">
                  {formatPrice(listing.originalPrice)}
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  Save {savePct}%
                </span>
              </p>
            )}
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-2 ring-1 ring-amber-200/70">
            <svg className="h-4 w-4 fill-amber-500 text-amber-500" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-extrabold text-amber-900">{listing.rating}</span>
            <span className="text-xs text-amber-800/70">· {listing.reviews}</span>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-stone-200 bg-stone-50/50">
          <BookingDateRangePicker
            variant="split"
            checkIn={checkIn}
            checkOut={checkOut}
            onChange={({ checkIn: ci, checkOut: co }) => {
              if (ci !== undefined) setCheckIn(ci);
              if (co !== undefined) setCheckOut(co);
            }}
          />
          <div className="border-t border-stone-200">
            <GuestsRoomsPicker
              value={guests}
              onChange={setGuests}
              maxGuests={listing.guests}
              label="Guests & Rooms"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            const params = new URLSearchParams({
              checkIn: toDateParam(checkIn),
              checkOut: toDateParam(checkOut),
              adults: String(guests.adults),
              children: String(guests.children),
              rooms: String(guests.rooms),
              price: String(nightly),
            });
            router.push(`/property/${listing.slug}/book?${params.toString()}`);
          }}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand via-orange-500 to-amber-500 py-4 text-base font-extrabold text-white shadow-lg shadow-brand/35 transition hover:brightness-105 active:scale-[0.99]"
        >
          Reserve now
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
        <p className="mt-2.5 text-center text-xs text-muted">You won&apos;t be charged yet</p>

        <div className="mt-5 rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-100">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
            Price details
          </p>
          <ul className="mt-3 space-y-2.5 text-sm">
            <PriceRow
              label={`${formatPrice(nightly)} × ${nights} night${nights !== 1 ? "s" : ""}`}
              value={formatPrice(nightly * nights)}
            />
            <PriceRow label="Cleaning fee" value={formatPrice(cleaning)} />
            <PriceRow label="Service fee" value={formatPrice(service)} />
          </ul>
          <div className="mt-3 flex items-center justify-between border-t border-dashed border-stone-300 pt-3">
            <span className="font-extrabold text-foreground">Total</span>
            <span className="text-lg font-extrabold text-brand">{formatPrice(total)}</span>
          </div>
        </div>

        <ul className="mt-4 space-y-2">
          {["Free cancellation up to 48 hours", "Best price guarantee"].map((text) => (
            <li
              key={text}
              className="flex items-center gap-2.5 rounded-xl bg-emerald-50/80 px-3 py-2 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
                ✓
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PriceRow({ label, value }) {
  return (
    <li className="flex items-center justify-between gap-2">
      <span className="text-muted">{label}</span>
      <span className="shrink-0 font-semibold text-foreground">{value}</span>
    </li>
  );
}
