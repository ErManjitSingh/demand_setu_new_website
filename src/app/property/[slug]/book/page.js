import Link from "next/link";
import { notFound } from "next/navigation";
import BookingCheckoutForm from "@/components/booking/BookingCheckoutForm";
import BookingTripHydrator from "@/components/booking/BookingTripHydrator";
import {
  applyTripToParams,
  parseTripFromSearchParams,
  serializeTripForClient,
} from "@/lib/bookingSearch";
import { resolvePropertyBySlug } from "@/lib/propertyData";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const resolved = await resolvePropertyBySlug(slug);
  if (!resolved) return { title: "Booking | Demand Setu" };
  const { listing } = resolved;
  return {
    title: `Complete booking · ${listing.title} | Demand Setu`,
    description: `Confirm your stay at ${listing.title}.`,
  };
}

export default async function PropertyBookPage({ params, searchParams }) {
  const { slug } = await params;
  const query = await searchParams;
  const resolved = await resolvePropertyBySlug(slug);
  if (!resolved) notFound();

  const { listing } = resolved;
  const trip = parseTripFromSearchParams(query);
  const initialTrip = serializeTripForClient(trip);
  const propertyHref = (() => {
    const params = applyTripToParams(new URLSearchParams(), trip);
    const qs = params.toString();
    return qs ? `/property/${slug}?${qs}` : `/property/${slug}`;
  })();

  return (
    <div className="min-h-screen bg-stone-100">
      <BookingTripHydrator />
      <div className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-5">
          <nav className="flex items-center gap-2 text-xs text-muted sm:text-sm">
            <Link href="/" className="hover:text-brand">
              Home
            </Link>
            <span>/</span>
            <Link href={propertyHref} className="hover:text-brand">
              {listing.title}
            </Link>
            <span>/</span>
            <span className="font-semibold text-foreground">Checkout</span>
          </nav>
          <h1 className="mt-3 text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
            Complete your booking
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <BookingCheckoutForm
          listing={listing}
          initialTrip={initialTrip}
          propertyHref={propertyHref}
        />
      </div>
    </div>
  );
}
