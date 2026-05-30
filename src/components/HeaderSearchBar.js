"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BookingDateRangePicker from "@/components/booking/BookingDateRangePicker";
import GuestsRoomsPicker from "@/components/booking/GuestsRoomsPicker";
import MobilePickerSheet from "@/components/booking/MobilePickerSheet";

export default function HeaderSearchBar({
  defaultLocation = "",
  searchHref = "/listings",
}) {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });
  const [location, setLocation] = useState(defaultLocation);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    setLocation(defaultLocation);
  }, [defaultLocation]);

  const displayLocation = location.trim() || "Goa, Manali, Jaipur...";

  return (
    <>
      <div className="relative z-20 w-full overflow-visible rounded-2xl border border-border/80 bg-white p-1.5 shadow-md ring-1 ring-stone-900/5 sm:rounded-full sm:p-1">
        {/* Mobile: location + Edit */}
        <div className="flex items-center gap-3 px-2 py-1 sm:hidden">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-muted text-brand">
            <PinIcon />
          </span>
          <div className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold uppercase tracking-wide text-brand">
              Location
            </span>
            <p className="truncate text-sm font-bold text-foreground">{displayLocation}</p>
          </div>
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="shrink-0 rounded-full border-2 border-brand bg-white px-4 py-2 text-xs font-bold text-brand transition hover:bg-brand-muted active:scale-[0.98]"
          >
            Edit
          </button>
        </div>

        {/* Desktop: full search bar */}
        <div className="hidden overflow-visible sm:flex sm:flex-row sm:items-center">
          <label className="flex flex-1 cursor-pointer items-center gap-2.5 rounded-xl px-4 py-2.5 transition hover:bg-stone-50 sm:rounded-l-full">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-muted text-brand">
              <PinIcon />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-wide text-brand">
                Location
              </span>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Goa, Manali, Jaipur..."
                className="mt-0.5 w-full bg-transparent text-sm font-bold text-foreground outline-none placeholder:font-normal placeholder:text-stone-400"
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
              className="[&_button]:py-2.5"
            />
          </div>

          <Divider />

          <div className="relative z-30 min-w-0 flex-1 overflow-visible">
            <GuestsRoomsPicker
              value={guests}
              onChange={setGuests}
              label="Guests & Rooms"
              heroLayout
              className="[&_button]:py-2.5"
            />
          </div>

          <Link
            href={searchHref}
            className="flex min-w-[130px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand to-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-brand/30 transition hover:brightness-105 active:scale-[0.99]"
          >
            <SearchIcon />
            <span className="whitespace-nowrap">Search stays</span>
          </Link>
        </div>
      </div>

      {/* Mobile edit modal — dates, guests & search */}
      <MobilePickerSheet
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit your search"
      >
        <div className="space-y-3">
          <label className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50/80 px-4 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-muted text-brand">
              <PinIcon />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-wide text-brand">
                Location
              </span>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Goa, Manali, Jaipur..."
                className="mt-1 w-full bg-transparent text-sm font-bold text-foreground outline-none placeholder:font-normal placeholder:text-stone-400"
              />
            </span>
          </label>

          <div className="overflow-hidden rounded-2xl border border-stone-200">
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

          <div className="overflow-hidden rounded-2xl border border-stone-200">
            <GuestsRoomsPicker
              value={guests}
              onChange={setGuests}
              label="Guests & Rooms"
              heroLayout
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditOpen(false)}
              className="flex-1 rounded-xl border border-stone-200 py-3 text-sm font-bold text-foreground"
            >
              Done
            </button>
            <Link
              href={searchHref}
              onClick={() => setEditOpen(false)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-orange-500 py-3 text-sm font-bold text-white shadow-md shadow-brand/30"
            >
              <SearchIcon />
              Search stays
            </Link>
          </div>
        </div>
      </MobilePickerSheet>
    </>
  );
}

function Divider() {
  return (
    <div className="mx-0 h-auto w-px self-stretch bg-stone-200" />
  );
}

function SearchIcon() {
  return (
    <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
