"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  buildListingsUrlPreservingFilters,
  fillMissingBookingDefaults,
  loadTripSearch,
  mergeTripFromUrlAndSession,
  saveTripSearch,
  tripParamsNeedSync,
} from "@/lib/bookingSearch";

/**
 * On /listings, merges the last home/explore/header search from sessionStorage
 * into the URL when query params are missing (keeps filter params intact).
 */
export default function ListingsTripHydrator() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lastSynced = useRef("");

  useEffect(() => {
    const session = loadTripSearch();
    const merged = mergeTripFromUrlAndSession(searchParams, session);
    const hasLocation = Boolean(merged.city || merged.state);
    const hasDates = Boolean(merged.checkIn && merged.checkOut);

    if (!hasLocation && !hasDates) return;

    const trip = hasLocation && !hasDates ? fillMissingBookingDefaults(merged) : merged;

    saveTripSearch(trip);

    if (!tripParamsNeedSync(searchParams, trip)) return;

    const nextUrl = buildListingsUrlPreservingFilters(searchParams, trip);
    if (lastSynced.current === nextUrl) return;
    lastSynced.current = nextUrl;

    router.replace(nextUrl, { scroll: false });
  }, [router, searchParams]);

  return null;
}
