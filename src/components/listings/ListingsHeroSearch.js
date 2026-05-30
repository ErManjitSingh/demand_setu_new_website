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

export default function ListingsHeroSearch({ category }) {
  const searchHref = buildListingsHref(category);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });
  const [location, setLocation] = useState("");

  return (
    <div className="relative z-20 w-full overflow-visible rounded-[2rem] bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.25)] ring-1 ring-white/80 sm:rounded-full sm:p-1.5">
      <div className="flex flex-col overflow-visible sm:flex-row sm:items-center">
        <label className="flex flex-1 cursor-pointer items-center gap-3 px-4 py-3.5 transition hover:bg-stone-50 sm:rounded-l-full sm:px-5 sm:py-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-muted text-brand">
            <PinIcon />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-semibold text-stone-500">Where are you going?</span>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Search location"
              className="mt-0.5 w-full bg-transparent text-sm font-bold text-foreground outline-none placeholder:font-semibold placeholder:text-stone-800"
            />
          </span>
        </label>
        <Divider />
        <div className="relative z-30 min-w-0 flex-1 overflow-visible">
          <BookingDateRangePicker
            variant="combined"
            heroLayout
            checkIn={checkIn}
            checkOut={checkOut}
            onChange={({ checkIn: ci, checkOut: co }) => {
              if (ci !== undefined) setCheckIn(ci);
              if (co !== undefined) setCheckOut(co);
            }}
          />
        </div>
        <Divider />
        <div className="relative z-30 min-w-0 flex-1 overflow-visible">
          <GuestsRoomsPicker
            value={guests}
            onChange={setGuests}
            label="Guests & Rooms"
            heroLayout
          />
        </div>
        <Link
          href={searchHref}
          className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand to-orange-500 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-brand/35 transition hover:brightness-105 active:scale-[0.99] sm:mt-0 sm:min-w-[160px] sm:rounded-full sm:px-6"
        >
          <SearchIcon />
          <span className="whitespace-nowrap">Search stays</span>
        </Link>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="mx-4 h-px bg-stone-200 sm:mx-0 sm:h-auto sm:w-px sm:self-stretch sm:bg-stone-200" />
  );
}

function SearchIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}
