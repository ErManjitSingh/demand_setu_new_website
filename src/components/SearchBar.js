"use client";

import Link from "next/link";
import { useState } from "react";
import BookingDateRangePicker from "@/components/booking/BookingDateRangePicker";
import GuestsRoomsPicker from "@/components/booking/GuestsRoomsPicker";

function buildListingsHref(category) {
  if (category && category !== "all") {
    return `/listings?category=${category}`;
  }
  return "/listings";
}

export default function SearchBar({
  compact = false,
  elevated = false,
  category,
  listingsPage = false,
}) {
  const searchHref = buildListingsHref(category);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });
  const [location, setLocation] = useState("");

  if (compact) {
    return (
      <Link
        href={searchHref}
        className="card-shine group flex items-center gap-4 rounded-2xl border border-white/80 bg-white/90 p-2 pl-2 shadow-xl shadow-stone-300/30 ring-1 ring-stone-900/5 transition hover:shadow-2xl hover:ring-brand/20"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-orange-400 text-white shadow-md shadow-brand/30">
          <SearchIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1 text-left">
          <p className="text-sm font-bold text-foreground">Where to next?</p>
          <p className="truncate text-xs text-muted">
            Anywhere · Any week · Add guests
          </p>
        </div>
        <span className="mr-2 hidden rounded-full bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-600 sm:inline">
          Search
        </span>
      </Link>
    );
  }

  const shellClass = [
    "rounded-3xl border bg-white/95 p-2 backdrop-blur-xl sm:p-2.5",
    listingsPage
      ? "border-white/90 shadow-[0_28px_70px_-12px_rgba(28,25,23,0.35)] ring-2 ring-white/90"
      : "border-white/60 shadow-2xl shadow-stone-900/10 ring-1 ring-white/80",
    elevated && !listingsPage && "animate-pulse-glow",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`relative z-20 overflow-visible ${shellClass}`}>
      <div className="grid gap-2 overflow-visible sm:grid-cols-[1.3fr_1fr_1fr_auto] sm:gap-0 sm:rounded-2xl sm:bg-stone-50/90 sm:p-1">
        <label className="group flex items-center gap-3 rounded-2xl border border-transparent bg-white px-4 py-3.5 shadow-sm transition hover:border-brand/15 hover:bg-white hover:shadow-md sm:rounded-l-xl sm:border-0 sm:bg-transparent sm:py-3 sm:shadow-none">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-muted to-orange-50 text-brand ring-1 ring-brand/10">
            <PinIcon />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-brand">
              Location
            </span>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Goa, Manali, Jaipur..."
              className="mt-0.5 w-full bg-transparent text-sm font-semibold outline-none placeholder:font-normal placeholder:text-stone-400"
            />
          </span>
        </label>

        <div className="relative z-30 overflow-visible rounded-2xl border border-transparent bg-white shadow-sm sm:rounded-none sm:border-0 sm:bg-transparent sm:shadow-none">
          <BookingDateRangePicker
            variant="combined"
            checkIn={checkIn}
            checkOut={checkOut}
            onChange={({ checkIn: ci, checkOut: co }) => {
              if (ci !== undefined) setCheckIn(ci);
              if (co !== undefined) setCheckOut(co);
            }}
          />
        </div>

        <div className="relative z-30 overflow-visible rounded-2xl border border-transparent bg-white shadow-sm sm:border-0 sm:bg-transparent sm:shadow-none">
          <GuestsRoomsPicker value={guests} onChange={setGuests} label="Guests & Rooms" />
        </div>

        <Link
          href={searchHref}
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand via-orange-500 to-amber-500 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-brand/40 transition hover:brightness-105 active:scale-[0.99] sm:mx-1 sm:my-1 sm:rounded-xl sm:py-3.5"
        >
          <SearchIcon className="h-5 w-5" />
          Search stays
        </Link>
      </div>
    </div>
  );
}

function SearchIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}
