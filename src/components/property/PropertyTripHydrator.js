"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  buildPropertyUrlPreservingTrip,
  fillMissingBookingDefaults,
  loadTripSearch,
  mergeTripFromUrlAndSession,
  saveTripSearch,
  tripParamsNeedSync,
} from "@/lib/bookingSearch";
import { parsePropertySlugPath } from "@/lib/propertySlug";

function PropertyTripHydratorClient({
  listing,
  propertyState = "",
  propertyCity = "",
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastSynced = useRef("");

  useEffect(() => {
    const parsed = parsePropertySlugPath(pathname);
    const legacyMatch = pathname.match(/^\/property\/([^/]+)$/);
    const internalSlug = parsed?.internalSlug || legacyMatch?.[1] || "";
    if (!internalSlug || !listing) return;

    const session = loadTripSearch();
    let merged = mergeTripFromUrlAndSession(searchParams, session, pathname);

    if (!merged.city && !merged.state) {
      const fallbackState = String(propertyState || "").trim();
      const fallbackCity = String(propertyCity || "").trim();
      if (fallbackState) merged = { ...merged, state: fallbackState };
      else if (fallbackCity) merged = { ...merged, city: fallbackCity };
    }

    if (!merged.category || merged.category === "all") {
      merged = { ...merged, category: listing.category || merged.category };
    }

    const hasLocation = Boolean(merged.city || merged.state);
    const hasDates = Boolean(merged.checkIn && merged.checkOut);

    if (!hasLocation && !hasDates) return;

    const trip =
      (hasLocation || hasDates) && !hasDates
        ? fillMissingBookingDefaults(merged)
        : merged;

    saveTripSearch(trip);

    if (!tripParamsNeedSync(searchParams, trip, pathname)) return;

    const nextUrl = buildPropertyUrlPreservingTrip(searchParams, listing, trip);
    if (lastSynced.current === nextUrl) return;
    lastSynced.current = nextUrl;

    router.replace(nextUrl, { scroll: false });
  }, [listing, pathname, propertyCity, propertyState, router, searchParams]);

  return null;
}

export default function PropertyTripHydrator({
  listing,
  propertyState = "",
  propertyCity = "",
}) {
  return (
    <Suspense fallback={null}>
      <PropertyTripHydratorClient
        listing={listing}
        propertyState={propertyState}
        propertyCity={propertyCity}
      />
    </Suspense>
  );
}
