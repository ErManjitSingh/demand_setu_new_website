"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { parseDateParam } from "@/lib/dates";
import {
  DEFAULT_GUESTS,
  loadTripSearch,
  mergeTripFromUrlAndSession,
  normalizeGuests,
  TRIP_SEARCH_UPDATED,
} from "@/lib/bookingSearch";
import { serializeChildAgesParam } from "@/lib/guestOccupancy";

function guestsKey(guests) {
  const g = normalizeGuests(guests);
  return `${g.adults}-${g.children}-${g.rooms}-${serializeChildAgesParam(g.childAges)}`;
}

/** Resolves trip from URL query params + sessionStorage (session fills missing URL fields). */
export function useTripSearch(serverFallback) {
  const searchParams = useSearchParams();
  const queryKey = searchParams.toString();
  const [sessionVersion, setSessionVersion] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onUpdate = () => setSessionVersion((v) => v + 1);
    window.addEventListener(TRIP_SEARCH_UPDATED, onUpdate);
    return () => window.removeEventListener(TRIP_SEARCH_UPDATED, onUpdate);
  }, []);

  const fbCategory = String(serverFallback?.category || "all");
  const fbCity = String(serverFallback?.city || "").trim();
  const fbState = String(serverFallback?.state || "").trim();
  const fbCheckIn = String(serverFallback?.checkIn || "").trim();
  const fbCheckOut = String(serverFallback?.checkOut || "").trim();
  const fbGuestsKey = guestsKey(serverFallback?.guests || DEFAULT_GUESTS);

  return useMemo(() => {
    const fallback = {
      category: fbCategory,
      city: fbCity,
      state: fbState,
      checkIn: fbCheckIn ? parseDateParam(fbCheckIn) : null,
      checkOut: fbCheckOut ? parseDateParam(fbCheckOut) : null,
      guests: normalizeGuests(serverFallback?.guests || DEFAULT_GUESTS),
    };

    const session = mounted ? loadTripSearch() : null;
    const merged = mergeTripFromUrlAndSession(searchParams, session);

    return {
      category: merged.category || fallback.category || "all",
      city: merged.city || fallback.city || "",
      state: merged.state || fallback.state || "",
      checkIn: merged.checkIn || fallback.checkIn || null,
      checkOut: merged.checkOut || fallback.checkOut || null,
      guests: normalizeGuests(merged.guests || fallback.guests || DEFAULT_GUESTS),
      locationLabel:
        merged.city ||
        fallback.city ||
        merged.state ||
        fallback.state ||
        "",
    };
  }, [
    queryKey,
    mounted,
    sessionVersion,
    fbCategory,
    fbCity,
    fbState,
    fbCheckIn,
    fbCheckOut,
    fbGuestsKey,
  ]);
}
