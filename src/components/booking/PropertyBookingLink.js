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

function getStaticPropertyHref(slug, requireBooking) {
  const resolved = requireBooking ? fillMissingBookingDefaults({}) : {};
  return buildPropertyUrl(slug, resolved);
}

function PropertyBookingLinkClient({
  slug,
  className,
  children,
  requireBooking = false,
  onBlocked,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

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
  const href = useMemo(
    () => buildPropertyUrl(slug, resolvedTrip),
    [slug, resolvedTrip]
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
  const { slug, className, children, requireBooking = false } = props;

  return (
    <Suspense
      fallback={
        <PropertyBookingLinkFallback
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

function PropertyBookingLinkFallback({ slug, className, children, requireBooking }) {
  const href = getStaticPropertyHref(slug, requireBooking);

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
