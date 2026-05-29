import Link from "next/link";
import { notFound } from "next/navigation";
import PropertyCard from "@/components/PropertyCard";
import PropertyGallery from "@/components/property/PropertyGallery";
import PropertyRooms from "@/components/property/PropertyRooms";
import PropertyAmenities from "@/components/property/PropertyAmenities";
import PropertyBookingCard from "@/components/property/PropertyBookingCard";
import PropertyBookingPolicy from "@/components/property/PropertyBookingPolicy";
import PropertyMobileBar from "@/components/property/PropertyMobileBar";
import SectionHeading from "@/components/SectionHeading";
import {
  getListingBySlug,
  getListingsByCategory,
  formatPrice,
  getCategoryLabel,
  LISTINGS,
  SAMPLE_REVIEWS,
} from "@/lib/listings";
import {
  getPropertyRooms,
  getPropertyAmenityGroups,
  getPropertyHighlights,
  getPropertyGallery,
} from "@/lib/property";

export async function generateStaticParams() {
  return LISTINGS.map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const listing = getListingBySlug(slug);
  if (!listing) return { title: "Property | Demand Setu" };
  return {
    title: `${listing.title} | Demand Setu`,
    description: listing.description,
  };
}

const RATING_BARS = [
  { label: "Cleanliness", pct: 96 },
  { label: "Accuracy", pct: 94 },
  { label: "Communication", pct: 98 },
  { label: "Location", pct: 92 },
  { label: "Value", pct: 90 },
];

export default async function PropertyPage({ params }) {
  const { slug } = await params;
  const listing = getListingBySlug(slug);

  if (!listing) notFound();

  const similar = getListingsByCategory(listing.category)
    .filter((l) => l.slug !== listing.slug)
    .slice(0, 3);

  const gallery = getPropertyGallery(listing);
  const rooms = getPropertyRooms(listing);
  const amenityGroups = getPropertyAmenityGroups(listing);
  const highlights = getPropertyHighlights(listing);
  const defaultRoomPrice = rooms[0]?.price ?? listing.price;

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <PropertyGallery title={listing.title} images={gallery} />

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-x-10 xl:gap-x-12">
          <div className="min-w-0">
            {/* Title — rating hidden on desktop (shown in booking card) */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex rounded-full bg-brand-muted px-3 py-1 text-xs font-bold text-brand-dark">
                    {getCategoryLabel(listing.category)}
                  </span>
                  {listing.badge && (
                    <span className="inline-flex rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">
                      {listing.badge}
                    </span>
                  )}
                </div>
                <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-4xl">
                  {listing.title}
                </h1>
                <p className="mt-2 flex items-center gap-2 text-sm text-muted sm:text-base">
                  <PinIcon />
                  {listing.location} · {listing.region}
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50 px-4 py-3 shadow-sm lg:hidden">
                <span className="text-2xl font-extrabold text-amber-800">
                  {listing.rating}
                </span>
                <div className="text-xs">
                  <p className="font-bold text-foreground">Exceptional</p>
                  <p className="text-muted">{listing.reviews} reviews</p>
                </div>
              </div>
            </div>

            {/* Highlights */}
            <ul className="mt-6 flex flex-wrap gap-2">
              {highlights.map((h) => (
                <li
                  key={h.label}
                  className="flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 shadow-sm"
                >
                  <span>{h.icon}</span>
                  {h.label}
                </li>
              ))}
            </ul>

            {/* Rooms */}
            <PropertyRooms rooms={rooms} />

            {/* Mobile booking — full card (dates, guests, price breakdown) */}
            <section id="book" className="mt-10 scroll-mt-24 lg:hidden">
              <h2 className="text-lg font-extrabold sm:text-xl">Book your stay</h2>
              <p className="mt-1 text-sm text-muted">
                Select dates, guests & rooms — see full price before you reserve.
              </p>
              <div className="mt-4">
                <PropertyBookingCard listing={listing} selectedRoomPrice={defaultRoomPrice} />
              </div>
            </section>

            {/* About */}
            <div className="mt-10 rounded-3xl border border-border/80 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-extrabold sm:text-xl">About this stay</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                {listing.description}
              </p>
            </div>

            {/* Amenities */}
            <PropertyAmenities groups={amenityGroups} />

            {/* Booking policy */}
            <PropertyBookingPolicy />

            {/* Location */}
            <div className="mt-10 overflow-hidden rounded-3xl border border-border/80 bg-white shadow-sm">
              <div className="border-b border-border p-5">
                <h2 className="text-lg font-extrabold">Where you&apos;ll be</h2>
                <p className="mt-1 text-sm text-muted">{listing.location}</p>
              </div>
              <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-brand-muted via-orange-50 to-amber-50 sm:h-56">
                <div className="absolute inset-0 opacity-30 pattern-dots" />
                <div className="relative text-center">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand text-xl text-white shadow-lg shadow-brand/40">
                    📍
                  </span>
                  <p className="mt-2 text-sm font-bold">{listing.region}, India</p>
                  <p className="text-xs text-muted">Exact address after booking</p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-10">
              <SectionHeading
                eyebrow="Reviews"
                title={`${listing.rating} · ${listing.reviews} guest reviews`}
                subtitle="What travellers say about this property."
              />
              <div className="mt-6 grid gap-6 rounded-3xl border border-border/80 bg-white p-5 shadow-sm sm:grid-cols-[160px_1fr] sm:p-6">
                <div className="text-center sm:text-left">
                  <p className="text-4xl font-extrabold sm:text-5xl">{listing.rating}</p>
                  <div className="mt-1 flex justify-center gap-0.5 text-amber-500 sm:justify-start">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="mt-1 text-sm text-muted">{listing.reviews} reviews</p>
                </div>
                <div className="space-y-2">
                  {RATING_BARS.map((bar) => (
                    <div key={bar.label} className="flex items-center gap-2 sm:gap-3">
                      <span className="w-24 shrink-0 text-xs font-medium text-muted">
                        {bar.label}
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand to-amber-400"
                          style={{ width: `${bar.pct}%` }}
                        />
                      </div>
                      <span className="w-8 text-xs font-bold">{bar.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {SAMPLE_REVIEWS.map((review) => (
                  <article
                    key={review.name}
                    className="rounded-2xl border border-border/80 bg-white p-4 shadow-sm sm:p-5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-800 text-xs font-bold text-white">
                        {review.avatar}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold">{review.name}</p>
                        <p className="text-xs text-muted">{review.date}</p>
                      </div>
                      <div className="flex text-sm text-amber-500">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{review.text}</p>
                  </article>
                ))}
              </div>
            </div>

            {similar.length > 0 && (
              <div className="mt-12 lg:hidden">
                <h2 className="text-xl font-extrabold">Similar stays</h2>
                <div className="mt-4 space-y-4">
                  {similar.map((item) => (
                    <PropertyCard key={item.slug} listing={item} variant="horizontal" />
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="hidden lg:block lg:sticky lg:top-[6.5rem] lg:z-20 lg:self-start">
            <PropertyBookingCard listing={listing} selectedRoomPrice={defaultRoomPrice} />
          </aside>
        </div>

        {similar.length > 0 && (
          <section className="mt-14 hidden border-t border-border pt-12 lg:block">
            <SectionHeading
              eyebrow="You may also like"
              title="Similar stays"
              subtitle="More in the same collection."
            />
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {similar.map((item) => (
                <PropertyCard key={item.slug} listing={item} />
              ))}
            </div>
          </section>
        )}
      </div>

      <PropertyMobileBar listing={listing} price={defaultRoomPrice} />
    </div>
  );
}

function PinIcon() {
  return (
    <svg className="h-5 w-5 shrink-0 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}
