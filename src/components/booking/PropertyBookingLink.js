"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  buildPropertyUrl,
  fillMissingBookingDefaults,
  loadTripSearch,
  mergeTripFromUrlAndSession,
  persistTripSearch,
} from "@/lib/bookingSearch";
import { normalizeListingRef } from "@/lib/propertySlug";

function getStaticPropertyHref(listingOrSlug, requireBooking) {
  const listing = normalizeListingRef(listingOrSlug);
  const resolved = requireBooking ? fillMissingBookingDefaults({}) : {};
  const listingCity = String(listing?.propertyCity || listing?.city || "").trim();
  const listingState = String(listing?.propertyState || listing?.region || "").trim();
  const trip = {
    ...resolved,
    city: listingCity || resolved.city,
    state: listingState || resolved.state,
  };
  return buildPropertyUrl(listing, trip);
}

function PropertyBookingLinkClient({
  listing,
  slug,
  className,
  children,
  requireBooking = false,
  onBlocked,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const listingRef = useMemo(
    () => listing || normalizeListingRef(slug),
    [listing, slug]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const queryKey = searchParams.toString();
  const trip = useMemo(
    () =>
      mergeTripFromUrlAndSession(
        searchParams,
        mounted ? loadTripSearch() : null
      ),
    [queryKey, searchParams, mounted]
  );

  const resolvedTrip = useMemo(
    () => (requireBooking ? fillMissingBookingDefaults(trip) : trip),
    [requireBooking, trip]
  );
  const propertyTrip = useMemo(() => {
    const listingCity = String(
      listingRef?.propertyCity || listingRef?.city || ""
    ).trim();
    const listingState = String(
      listingRef?.propertyState || listingRef?.region || ""
    ).trim();
    if (!listingCity && !listingState) return resolvedTrip;
    return {
      ...resolvedTrip,
      city: listingCity || resolvedTrip.city,
      state: listingState || resolvedTrip.state,
    };
  }, [listingRef, resolvedTrip]);
  const href = useMemo(
    () => buildPropertyUrl(listingRef, propertyTrip),
    [listingRef, propertyTrip]
  );

  if (!requireBooking) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  const handleClick = (e) => {
    e.preventDefault();
    persistTripSearch(resolvedTrip);
    router.push(href);
  };

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}

export default function PropertyBookingLink(props) {
  const { listing, slug, className, children, requireBooking = false } = props;

  return (
    <Suspense
      fallback={
        <PropertyBookingLinkFallback
          listing={listing}
          slug={slug}
          className={className}
          requireBooking={requireBooking}
        >
          {children}
        </PropertyBookingLinkFallback>
      }
    >
      <PropertyBookingLinkClient {...props} />
    </Suspense>
  );
}

function PropertyBookingLinkFallback({
  listing,
  slug,
  className,
  children,
  requireBooking,
}) {
  const href = getStaticPropertyHref(listing || slug, requireBooking);

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
