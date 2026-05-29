"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  formatDateRange,
  formatShortDate,
  getMonthDays,
  isInRange,
  isSameDay,
  startOfDay,
} from "@/lib/dates";

export default function BookingDateRangePicker({
  checkIn,
  checkOut,
  onChange,
  variant = "combined",
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState("in");
  const ref = useRef(null);
  const today = startOfDay(new Date());
  const [viewMonth, setViewMonth] = useState(() => {
    const d = checkIn ?? today;
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const nextMonth = useMemo(() => {
    const m = viewMonth.month + 1;
    return m > 11
      ? { year: viewMonth.year + 1, month: 0 }
      : { year: viewMonth.year, month: m };
  }, [viewMonth]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const pickDay = (day) => {
    if (!day || day < today) return;
    if (phase === "in" || !checkIn || (checkIn && checkOut)) {
      onChange({ checkIn: day, checkOut: null });
      setPhase("out");
      return;
    }
    if (day <= checkIn) {
      onChange({ checkIn: day, checkOut: null });
      setPhase("out");
      return;
    }
    onChange({ checkIn, checkOut: day });
    setPhase("in");
    setOpen(false);
  };

  const label = formatDateRange(checkIn, checkOut);

  const renderMonth = (year, month) => {
    const days = getMonthDays(year, month);
    const title = new Date(year, month, 1).toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
    return (
      <div key={`${year}-${month}`} className="min-w-[240px] flex-1">
        <p className="mb-2 text-center text-xs font-bold text-foreground">{title}</p>
        <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] font-semibold text-muted">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <span key={d} className="py-1">
              {d}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {days.map((day, i) => {
            if (!day) return <span key={`e-${i}`} />;
            const disabled = day < today;
            const selected =
              isSameDay(day, checkIn) || isSameDay(day, checkOut);
            const inRange = isInRange(day, checkIn, checkOut);
            return (
              <button
                key={day.toISOString()}
                type="button"
                disabled={disabled}
                onClick={() => pickDay(day)}
                className={`h-8 rounded-lg text-xs font-semibold transition ${
                  disabled
                    ? "cursor-not-allowed text-stone-300"
                    : selected
                      ? "bg-brand text-white"
                      : inRange
                        ? "bg-brand-muted text-brand-dark"
                        : "text-foreground hover:bg-stone-100"
                }`}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const panel = open && (
    <div className="absolute left-0 right-0 z-[200] mt-2 rounded-2xl border border-stone-200 bg-white p-4 shadow-2xl sm:left-auto sm:right-0 sm:w-[min(520px,95vw)]">
      <div className="mb-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() =>
            setViewMonth((v) =>
              v.month === 0
                ? { year: v.year - 1, month: 11 }
                : { year: v.year, month: v.month - 1 }
            )
          }
          className="rounded-lg px-2 py-1 text-sm font-bold text-muted hover:bg-stone-100"
        >
          ←
        </button>
        <p className="text-xs font-semibold text-muted">
          {phase === "out" ? "Select checkout" : "Select check-in"}
        </p>
        <button
          type="button"
          onClick={() =>
            setViewMonth((v) =>
              v.month === 11
                ? { year: v.year + 1, month: 0 }
                : { year: v.year, month: v.month + 1 }
            )
          }
          className="rounded-lg px-2 py-1 text-sm font-bold text-muted hover:bg-stone-100"
        >
          →
        </button>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        {renderMonth(viewMonth.year, viewMonth.month)}
        {renderMonth(nextMonth.year, nextMonth.month)}
      </div>
      <div className="mt-3 flex justify-between border-t border-stone-100 pt-3">
        <button
          type="button"
          className="text-xs font-semibold text-muted hover:text-brand"
          onClick={() => {
            onChange({ checkIn: null, checkOut: null });
            setPhase("in");
          }}
        >
          Clear dates
        </button>
        <button
          type="button"
          className="text-xs font-bold text-brand"
          onClick={() => setOpen(false)}
        >
          Done
        </button>
      </div>
    </div>
  );

  if (variant === "split") {
    return (
      <div ref={ref} className={`relative ${className}`}>
        <div className="grid grid-cols-2 divide-x divide-stone-200">
          <button
            type="button"
            onClick={() => {
              setPhase("in");
              setOpen(true);
            }}
            className="flex w-full items-start gap-2.5 px-4 py-3.5 text-left transition hover:bg-white"
          >
            <CalendarIcon />
            <span>
              <span className="block text-[10px] font-bold uppercase tracking-wide text-brand">
                Check-in
              </span>
              <span className="mt-0.5 block text-sm font-bold text-foreground">
                {checkIn ? formatShortDate(checkIn) : "Add date"}
              </span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              setPhase("out");
              setOpen(true);
            }}
            className="flex w-full items-start gap-2.5 px-4 py-3.5 text-left transition hover:bg-white"
          >
            <CalendarIcon />
            <span>
              <span className="block text-[10px] font-bold uppercase tracking-wide text-brand">
                Check-out
              </span>
              <span className="mt-0.5 block text-sm font-bold text-foreground">
                {checkOut ? formatShortDate(checkOut) : "Add date"}
              </span>
            </span>
          </button>
        </div>
        {panel}
      </div>
    );
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start gap-2.5 px-4 py-3.5 text-left transition hover:bg-white sm:px-4 sm:py-3"
      >
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-muted text-brand">
          <CalendarIcon />
        </span>
        <span className="min-w-0">
          <span className="block text-[10px] font-bold uppercase tracking-wide text-brand">
            Check-in — Check-out
          </span>
          <span className="mt-0.5 block text-sm font-bold text-foreground">{label}</span>
        </span>
      </button>
      {panel}
    </div>
  );
}

function CalendarIcon() {
  return (
    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-muted text-brand">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5a2.25 2.25 0 012.25 2.25V18.75M3 18.75h18" />
      </svg>
    </span>
  );
}
