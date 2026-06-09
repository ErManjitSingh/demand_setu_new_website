"use client";

import { Suspense, useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  buildPropertyUrlPreservingTrip,
  fillMissingBookingDefaults,
  loadTripSearch,
  mergeTripFromUrlAndSession,
  saveTripSearch,
  tripParamsNeedSync,
} from "@/lib/bookingSearch";

function PropertyTripHydratorClient({
  propertyState = "",
  propertyCity = "",
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const lastSynced = useRef("");

  useEffect(() => {
    const slug = String(params?.slug || "").trim();
    if (!slug) return;

    const session = loadTripSearch();
    let merged = mergeTripFromUrlAndSession(searchParams, session);

    if (!merged.city && !merged.state) {
      const fallbackState = String(propertyState || "").trim();
      const fallbackCity = String(propertyCity || "").trim();
      if (fallbackState) merged = { ...merged, state: fallbackState };
      else if (fallbackCity) merged = { ...merged, city: fallbackCity };
    }

    const hasLocation = Boolean(merged.city || merged.state);
    const hasDates = Boolean(merged.checkIn && merged.checkOut);

    if (!hasLocation && !hasDates) return;

    const trip =
      (hasLocation || hasDates) && !hasDates
        ? fillMissingBookingDefaults(merged)
        : merged;

    saveTripSearch(trip);

    if (!tripParamsNeedSync(searchParams, trip)) return;

    const nextUrl = buildPropertyUrlPreservingTrip(searchParams, slug, trip);
    if (lastSynced.current === nextUrl) return;
    lastSynced.current = nextUrl;

    router.replace(nextUrl, { scroll: false });
  }, [params?.slug, propertyCity, propertyState, router, searchParams]);

  return null;
}

export default function PropertyTripHydrator({
  propertyState = "",
  propertyCity = "",
}) {
  return (
    <Suspense fallback={null}>
      <PropertyTripHydratorClient
        propertyState={propertyState}
        propertyCity={propertyCity}
      />
    </Suspense>
  );
}
