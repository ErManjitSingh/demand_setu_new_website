import Image from "next/image";
import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import CategoryPills from "@/components/CategoryPills";
import SearchBar from "@/components/SearchBar";
import SectionHeading from "@/components/SectionHeading";
import {
  getListingsByCategory,
  getCategoryLabel,
  CATEGORIES,
} from "@/lib/listings";

export const metadata = {
  title: "Explore Stays | Demand Setu",
  description: "Browse hotels, Airbnbs, homestays and villas across India.",
};

const FILTER_ICONS = {
  Price: "₹",
  Rating: "★",
  Guests: "👥",
  Amenities: "✦",
};

export default async function ListingsPage({ searchParams }) {
  const params = await searchParams;
  const category = params?.category ?? "all";
  const listings = getListingsByCategory(category);
  const label = getCategoryLabel(category);
  const activeCat = category === "all" ? "all" : category;
  const categoryMeta = CATEGORIES.find((c) => c.id === category);
  const topPick = listings[0];

  return (
    <>
      {/* Page hero banner */}
      <div className="relative overflow-hidden bg-stone-900">
        <Image
          src={
            categoryMeta?.cover ??
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1400&q=80"
          }
          alt=""
          fill
          className="object-cover opacity-40"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/90 to-stone-900/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand/20 to-transparent" />

        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <nav className="mb-4 flex items-center gap-2 text-xs font-medium text-stone-400">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span>/</span>
            <span className="text-orange-300">Explore</span>
          </nav>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {category === "all" ? "Explore all stays" : label}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-stone-300 sm:text-base">
            {categoryMeta?.description ??
              `${listings.length} handpicked properties with Demand Setu quality guarantee`}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold text-white backdrop-blur">
              {listings.length} properties
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold text-white backdrop-blur">
              ★ 4.8+ avg rating
            </span>
            <span className="rounded-full border border-brand/50 bg-brand/20 px-4 py-1.5 text-xs font-bold text-orange-100">
              Free cancellation
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <SearchBar compact />

        <div className="mt-8">
          <CategoryPills activeCategory={activeCat} />
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-white p-3 shadow-sm">
          {Object.entries(FILTER_ICONS).map(([filter, icon]) => (
            <button
              key={filter}
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-stone-50 px-4 py-2.5 text-xs font-bold text-foreground ring-1 ring-stone-900/5 transition hover:bg-brand-muted hover:ring-brand/20"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-muted text-brand text-[10px]">
                {icon}
              </span>
              {filter}
              <svg className="h-3.5 w-3.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden text-xs text-muted sm:inline">Sort by</span>
            <button
              type="button"
              className="rounded-xl bg-gradient-to-r from-brand to-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-brand/25"
            >
              Recommended
            </button>
          </div>
        </div>

        {listings.length === 0 ? (
          <div className="mt-16 rounded-3xl border-2 border-dashed border-border bg-white p-16 text-center">
            <p className="text-4xl">🏝️</p>
            <p className="mt-4 text-xl font-bold">No stays found</p>
            <p className="mt-2 text-muted">Try another category</p>
            <Link
              href="/listings"
              className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-white"
            >
              View all stays
            </Link>
          </div>
        ) : (
          <>
            {/* Top pick highlight */}
            {topPick && (
              <div className="mt-8">
                <SectionHeading
                  eyebrow="Editor's pick"
                  title="Top recommendation"
                  subtitle="Our team's highest-rated stay in this collection."
                />
                <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-stretch" style={{ minHeight: "420px" }}>
                  <div className="lg:w-[55%] lg:shrink-0">
                    <PropertyCard listing={topPick} featured />
                  </div>
                  <div className="flex flex-col justify-between gap-4 lg:min-w-0 lg:flex-1">
                    {listings.slice(1, 3).map((listing) => (
                      <PropertyCard
                        key={listing.slug}
                        listing={listing}
                        variant="horizontal"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-12">
              <SectionHeading
                eyebrow="All results"
                title={`${listings.length} stays available`}
                subtitle="Tap any card for full details, gallery & booking."
              />
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {listings.slice(1).map((listing) => (
                  <PropertyCard key={listing.slug} listing={listing} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
