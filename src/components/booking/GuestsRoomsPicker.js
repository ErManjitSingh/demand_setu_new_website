"use client";

import { useEffect, useRef, useState } from "react";

export function formatGuestsRoomsLabel({ adults, children, rooms }) {
  const parts = [];
  parts.push(`${adults} Adult${adults !== 1 ? "s" : ""}`);
  if (children > 0) parts.push(`${children} Child${children !== 1 ? "ren" : ""}`);
  parts.push(`${rooms} Room${rooms !== 1 ? "s" : ""}`);
  return parts.join(" · ");
}

export default function GuestsRoomsPicker({
  value,
  onChange,
  maxGuests = 16,
  className = "",
  label = "Guests & Rooms",
  compact = false,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { adults, children, rooms } = value;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const setAdults = (n) =>
    onChange({ ...value, adults: Math.min(maxGuests, Math.max(1, n)) });
  const setChildren = (n) =>
    onChange({ ...value, children: Math.max(0, Math.min(8, n)) });
  const setRooms = (n) =>
    onChange({ ...value, rooms: Math.max(1, Math.min(8, n)) });

  const display = formatGuestsRoomsLabel(value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-start gap-2.5 text-left transition hover:bg-white ${
          compact ? "px-4 py-3.5" : "px-4 py-3 sm:px-4 sm:py-3"
        }`}
      >
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-muted text-brand">
          <GuestsIcon />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-bold uppercase tracking-wide text-brand">
            {label}
          </span>
          <span className="mt-0.5 block text-sm font-bold text-foreground">{display}</span>
        </span>
        <svg
          className={`mt-2 h-4 w-4 shrink-0 text-stone-400 transition ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-[200] mt-2 rounded-2xl border border-stone-200 bg-white p-4 shadow-2xl sm:min-w-[280px]">
          <CounterRow
            label="Adults"
            hint="Ages 13+"
            count={adults}
            onDec={() => setAdults(adults - 1)}
            onInc={() => setAdults(adults + 1)}
            min={1}
          />
          <CounterRow
            label="Children"
            hint="Ages 0–12"
            count={children}
            onDec={() => setChildren(children - 1)}
            onInc={() => setChildren(children + 1)}
            min={0}
          />
          <CounterRow
            label="Rooms"
            hint="Number of rooms"
            count={rooms}
            onDec={() => setRooms(rooms - 1)}
            onInc={() => setRooms(rooms + 1)}
            min={1}
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-3 w-full rounded-xl bg-brand py-2.5 text-sm font-bold text-white"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}

function CounterRow({ label, hint, count, onDec, onInc, min }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-stone-100 py-3 last:border-0">
      <div>
        <p className="text-sm font-bold text-foreground">{label}</p>
        <p className="text-xs text-muted">{hint}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDec}
          disabled={count <= min}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 text-lg font-bold disabled:opacity-40"
        >
          −
        </button>
        <span className="w-6 text-center text-sm font-extrabold">{count}</span>
        <button
          type="button"
          onClick={onInc}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-brand bg-brand-muted text-lg font-bold text-brand"
        >
          +
        </button>
      </div>
    </div>
  );
}

function GuestsIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}
