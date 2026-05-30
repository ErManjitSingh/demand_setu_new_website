import Link from "next/link";
import { notFound } from "next/navigation";
import BookingCheckoutForm from "@/components/booking/BookingCheckoutForm";
import { getListingBySlug } from "@/lib/listings";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const listing = getListingBySlug(slug);
  if (!listing) return { title: "Booking | Demand Setu" };
  return {
    title: `Complete booking · ${listing.title} | Demand Setu`,
    description: `Confirm your stay at ${listing.title}.`,
  };
}

export default async function PropertyBookPage({ params, searchParams }) {
  const { slug } = await params;
  const listing = getListingBySlug(slug);
  if (!listing) notFound();

  const query = await searchParams;

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-5">
          <nav className="flex items-center gap-2 text-xs text-muted sm:text-sm">
            <Link href="/" className="hover:text-brand">
              Home
            </Link>
            <span>/</span>
            <Link href={`/property/${slug}`} className="hover:text-brand">
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
        <BookingCheckoutForm listing={listing} searchParams={query} />
      </div>
    </div>
  );
}
