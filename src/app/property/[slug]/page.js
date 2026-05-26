import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PropertyCard from "@/components/PropertyCard";
import SectionHeading from "@/components/SectionHeading";
import {
  getListingBySlug,
  getListingsByCategory,
  formatPrice,
  getCategoryLabel,
  LISTINGS,
  SAMPLE_REVIEWS,
} from "@/lib/listings";

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

  const gallery = listing.gallery?.length
    ? listing.gallery
    : [listing.image];

  return (
    <>
      {/* Bento gallery - desktop */}
      <div className="relative hidden bg-stone-900 sm:block">
        <div className="mx-auto grid max-h-[520px] max-w-6xl grid-cols-4 grid-rows-2 gap-2 p-4 sm:px-6">
          <div className="relative col-span-2 row-span-2 overflow-hidden rounded-2xl">
            <Image
              src={gallery[0]}
              alt={listing.title}
              fill
              priority
              className="object-cover"
              sizes="50vw"
            />
          </div>
          {gallery.slice(1, 5).map((src, i) => (
            <div
              key={src}
              className="relative overflow-hidden rounded-2xl bg-stone-800"
            >
              <Image src={src} alt="" fill className="object-cover" sizes="25vw" />
              {i === gallery.slice(1, 5).length - 1 && gallery.length > 4 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-bold text-white backdrop-blur-sm">
                  +{gallery.length - 4} photos
                </div>
              )}
            </div>
          ))}
        </div>
        <Link
          href="/listings"
          className="absolute left-8 top-8 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-foreground shadow-lg backdrop-blur transition hover:bg-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back
        </Link>
      </div>

      {/* Mobile hero */}
      <div className="relative aspect-[4/3] w-full sm:hidden">
        <Image
          src={listing.image}
          alt={listing.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
        <Link
          href="/listings"
          className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/95 shadow-xl"
          aria-label="Back"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        {listing.badge && (
          <span className="absolute bottom-4 left-4 rounded-full bg-brand px-4 py-1.5 text-xs font-bold text-white shadow-lg">
            {listing.badge}
          </span>
        )}
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-12">
          <div>
            {/* Title block */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-muted px-3 py-1 text-xs font-bold text-brand-dark">
                  {getCategoryLabel(listing.category)}
                </span>
                <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-4xl">
                  {listing.title}
                </h1>
                <p className="mt-2 flex items-center gap-2 text-muted">
                  <svg className="h-5 w-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  {listing.location} · {listing.region}
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 px-4 py-3 shadow-sm">
                <span className="text-2xl font-extrabold text-amber-800">
                  {listing.rating}
                </span>
                <div className="text-xs">
                  <p className="font-bold text-foreground">Exceptional</p>
                  <p className="text-muted">{listing.reviews} reviews</p>
                </div>
              </div>
            </div>

            {/* Quick specs */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: "👤", label: "Guests", value: listing.guests },
                { icon: "🛏️", label: "Bedrooms", value: listing.beds },
                { icon: "🚿", label: "Bathrooms", value: listing.baths },
                { icon: "🌙", label: "Min nights", value: listing.nights },
              ].map((spec) => (
                <div
                  key={spec.label}
                  className="rounded-2xl border border-border bg-white p-4 text-center shadow-sm"
                >
                  <span className="text-2xl">{spec.icon}</span>
                  <p className="mt-2 text-lg font-extrabold">{spec.value}</p>
                  <p className="text-xs font-medium text-muted">{spec.label}</p>
                </div>
              ))}
            </div>

            {/* Host */}
            <div className="mt-8 flex items-center gap-4 rounded-3xl border border-border bg-gradient-to-r from-white to-brand-muted/40 p-5 shadow-md">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-amber-500 text-2xl font-extrabold text-white shadow-lg">
                {listing.host.charAt(0)}
              </span>
              <div className="flex-1">
                <p className="text-lg font-extrabold">Hosted by {listing.host}</p>
                <p className="text-sm text-muted">
                  Superhost · 5 years hosting · Responds in 1 hour
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["Identity verified", "Top rated"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-brand-dark ring-1 ring-brand/20"
                    >
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              </div>
              <button
                type="button"
                className="hidden rounded-xl border-2 border-brand px-4 py-2 text-sm font-bold text-brand transition hover:bg-brand hover:text-white sm:block"
              >
                Message
              </button>
            </div>

            {/* About */}
            <div className="mt-10 rounded-3xl border border-border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-extrabold">About this stay</h2>
              <p className="mt-4 leading-relaxed text-muted">{listing.description}</p>
            </div>

            {/* Amenities */}
            <div className="mt-8">
              <h2 className="text-xl font-extrabold">What this place offers</h2>
              <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {listing.amenities.map((amenity) => (
                  <li
                    key={amenity}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3.5 text-sm font-medium shadow-sm transition hover:border-brand/30 hover:shadow-md"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-muted text-brand">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>

            {/* Map placeholder */}
            <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
              <div className="border-b border-border p-5">
                <h2 className="text-xl font-extrabold">Where you&apos;ll be</h2>
                <p className="mt-1 text-sm text-muted">{listing.location}</p>
              </div>
              <div className="relative flex h-56 items-center justify-center bg-gradient-to-br from-brand-muted via-orange-50 to-amber-50">
                <div className="absolute inset-0 opacity-30 pattern-dots" />
                <div className="relative text-center">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand text-2xl text-white shadow-xl shadow-brand/40">
                    📍
                  </span>
                  <p className="mt-3 text-sm font-bold text-foreground">
                    {listing.region}, India
                  </p>
                  <p className="text-xs text-muted">Exact location shared after booking</p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-10">
              <SectionHeading
                eyebrow="Reviews"
                title={`${listing.rating} · ${listing.reviews} guest reviews`}
                subtitle="What travellers are saying about this property."
              />

              <div className="mt-6 grid gap-6 rounded-3xl border border-border bg-white p-6 shadow-sm sm:grid-cols-[180px_1fr]">
                <div className="text-center sm:text-left">
                  <p className="text-5xl font-extrabold text-foreground">
                    {listing.rating}
                  </p>
                  <div className="mt-1 flex justify-center gap-0.5 text-amber-500 sm:justify-start">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="mt-1 text-sm text-muted">{listing.reviews} reviews</p>
                </div>
                <div className="space-y-2.5">
                  {RATING_BARS.map((bar) => (
                    <div key={bar.label} className="flex items-center gap-3">
                      <span className="w-28 shrink-0 text-xs font-medium text-muted">
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

              <div className="mt-6 space-y-4">
                {SAMPLE_REVIEWS.map((review) => (
                  <article
                    key={review.name}
                    className="rounded-2xl border border-border bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-stone-700 to-stone-900 text-sm font-bold text-white">
                        {review.avatar}
                      </span>
                      <div>
                        <p className="font-bold">{review.name}</p>
                        <p className="text-xs text-muted">{review.date}</p>
                      </div>
                      <div className="ml-auto flex text-amber-500 text-sm">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {review.text}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            {similar.length > 0 && (
              <div className="mt-12 lg:hidden">
                <h2 className="text-xl font-extrabold">Similar stays</h2>
                <div className="mt-5 space-y-4">
                  {similar.map((item) => (
                    <PropertyCard key={item.slug} listing={item} variant="horizontal" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking sidebar */}
          <aside className="hidden lg:block">
            <div className="border-gradient sticky top-24 rounded-3xl p-[1px] shadow-2xl shadow-brand/10">
              <div className="rounded-[calc(1.5rem-1px)] bg-white p-6">
                <div className="flex items-baseline justify-between">
                  <p>
                    <span className="text-3xl font-extrabold">
                      {formatPrice(listing.price)}
                    </span>
                    <span className="text-muted"> / night</span>
                  </p>
                  {listing.originalPrice && (
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700 line-through decoration-transparent">
                      <span className="line-through text-muted">
                        {formatPrice(listing.originalPrice)}
                      </span>
                    </span>
                  )}
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border-2 border-border text-sm">
                  <div className="grid grid-cols-2 border-b-2 border-border">
                    <div className="border-r-2 border-border p-4">
                      <p className="text-[10px] font-bold uppercase text-brand">Check-in</p>
                      <p className="mt-1 font-bold">Add date</p>
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] font-bold uppercase text-brand">Check-out</p>
                      <p className="mt-1 font-bold">Add date</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] font-bold uppercase text-brand">Guests</p>
                    <p className="mt-1 font-bold">{listing.guests} guests</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-5 w-full rounded-2xl bg-gradient-to-r from-brand via-orange-500 to-amber-500 py-4 text-base font-extrabold text-white shadow-xl shadow-brand/30 transition hover:brightness-105"
                >
                  Reserve now
                </button>
                <p className="mt-3 text-center text-xs text-muted">
                  You won&apos;t be charged yet
                </p>

                <ul className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
                  <li className="flex justify-between text-muted">
                    <span>{formatPrice(listing.price)} × 5 nights</span>
                    <span className="font-semibold text-foreground">
                      {formatPrice(listing.price * 5)}
                    </span>
                  </li>
                  <li className="flex justify-between text-muted">
                    <span>Cleaning fee</span>
                    <span className="font-semibold text-foreground">
                      {formatPrice(800)}
                    </span>
                  </li>
                  <li className="flex justify-between text-muted">
                    <span>Service fee</span>
                    <span className="font-semibold text-foreground">
                      {formatPrice(Math.round(listing.price * 0.12))}
                    </span>
                  </li>
                  <li className="flex justify-between border-t border-dashed border-border pt-3 text-base font-extrabold">
                    <span>Total</span>
                    <span className="text-brand-dark">
                      {formatPrice(
                        listing.price * 5 + 800 + Math.round(listing.price * 0.12)
                      )}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>

        {similar.length > 0 && (
          <section className="mt-16 hidden lg:block">
            <SectionHeading
              eyebrow="You may also like"
              title="Similar stays"
              subtitle="More properties in the same collection."
            />
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {similar.map((item) => (
                <PropertyCard key={item.slug} listing={item} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile booking bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl lg:hidden"
        style={{ paddingBottom: "max(0.75rem, var(--safe-bottom))" }}
      >
        <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
          <div>
            <p className="text-lg font-extrabold">{formatPrice(listing.price)}</p>
            <p className="text-xs text-muted">
              per night · ★ {listing.rating} ({listing.reviews})
            </p>
          </div>
          <button
            type="button"
            className="rounded-2xl bg-gradient-to-r from-brand to-orange-500 px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-brand/30"
          >
            Reserve
          </button>
        </div>
      </div>
      <div className="h-28 lg:hidden" />
    </>
  );
}
