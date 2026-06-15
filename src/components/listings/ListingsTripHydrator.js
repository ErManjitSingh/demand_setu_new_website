"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  buildListingsUrlPreservingFilters,
  fillMissingBookingDefaults,
  loadTripSearch,
  mergeTripFromUrlAndSession,
  saveTripSearch,
  tripParamsNeedSync,
} from "@/lib/bookingSearch";
import { isListingsSlugPath } from "@/lib/listingsSlug";

export default function ListingsTripHydrator() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastSynced = useRef("");

  useEffect(() => {
    if (!isListingsSlugPath(pathname) && pathname !== "/listings") return;

    const session = loadTripSearch();
    const merged = mergeTripFromUrlAndSession(searchParams, session, pathname);
    const hasLocation = Boolean(merged.city || merged.state);
    const hasDates = Boolean(merged.checkIn && merged.checkOut);

    if (!hasLocation && !hasDates) return;

    const trip = hasLocation && !hasDates ? fillMissingBookingDefaults(merged) : merged;

    saveTripSearch(trip);

    if (!tripParamsNeedSync(searchParams, trip, pathname)) return;

    const nextUrl = buildListingsUrlPreservingFilters(searchParams, trip);
    if (lastSynced.current === nextUrl) return;
    lastSynced.current = nextUrl;

    router.replace(nextUrl, { scroll: false });
  }, [pathname, router, searchParams]);

  return null;
}
