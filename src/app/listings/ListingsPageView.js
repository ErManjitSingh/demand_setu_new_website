import { Suspense } from "react";
import ListingsTripHydrator from "@/components/listings/ListingsTripHydrator";
import ListingsSearchLogger from "@/components/listings/ListingsSearchLogger";
import ListingsHero from "@/components/listings/ListingsHero";
import ListingsSeoContent from "@/components/listings/ListingsSeoContent";
import ListingsSeoSchema from "@/components/listings/ListingsSeoSchema";
import ApiListingsResults from "@/components/listings/ApiListingsResults";
import ListingsFilteredCatalog from "@/components/listings/ListingsFilteredCatalog";
import ListingsResultsSkeleton from "@/components/listings/ListingsResultsSkeleton";
import CategoryPills from "@/components/CategoryPills";
import { LISTINGS, getCategoryLabel, CATEGORIES } from "@/lib/listings";
import { fetchSeoListingRecord } from "@/lib/seoListingApi";

export const listingsMetadata = {
  title: "Explore Stays | Demand Setu",
  description: "Browse hotels, Airbnbs, homestays and villas across India.",
};

function parsePositiveInt(value, fallback) {
  const num = Number.parseInt(String(value || ""), 10);
  if (!Number.isFinite(num) || num <= 0) return fallback;
  return num;
}

function parseNonNegativeInt(value, fallback) {
  const num = Number.parseInt(String(value || ""), 10);
  if (!Number.isFinite(num) || num < 0) return fallback;
  return num;
}

export default async function ListingsPageView({ searchParams }) {
  const params = await searchParams;
  const category = params?.category ?? "all";
  const selectedCity = String(params?.city || "").trim();
  const selectedState = String(params?.state || "").trim();
  const locationKind = params?.locationKind ?? null;
  const usesApiData = Boolean(selectedCity || selectedState);
  const label = getCategoryLabel(category);
  const activeCat = category === "all" ? "all" : category;
  const categoryMeta = CATEGORIES.find((c) => c.id === category);
  const initialCheckIn = String(params?.checkIn || "").trim();
  const initialCheckOut = String(params?.checkOut || "").trim();
  const initialAdults = parsePositiveInt(params?.adults, 2);
  const initialChildren = parseNonNegativeInt(params?.children, 0);
  const initialRooms = parsePositiveInt(params?.rooms, 1);
  const initialGuests = {
    adults: initialAdults,
    children: initialChildren,
    rooms: initialRooms,
  };

  const staticListings = usesApiData ? null : LISTINGS;

  const seoRecord =
    usesApiData && category !== "all"
      ? await fetchSeoListingRecord(
          category,
          selectedCity,
          selectedState,
          locationKind
        )
      : null;

  const heroCover =
    seoRecord?.images?.[0]?.preview ||
    categoryMeta?.cover ||
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1400&q=80";

  const heroDescription =
    seoRecord?.subHeading ||
    (selectedCity
      ? `${selectedCity} stays handpicked for unforgettable memories.`
      : selectedState
        ? `${selectedState} stays handpicked for unforgettable memories.`
        : category === "all"
          ? "Hotels, villas & unique stays for unforgettable memories."
          : (categoryMeta?.description ??
            `${label} across India — handpicked for unforgettable memories.`));

  return (
    <div className="min-h-screen bg-background">
      <ListingsSeoSchema seo={seoRecord} />
      <Suspense fallback={null}>
        <ListingsTripHydrator />
      </Suspense>
      <ListingsSearchLogger
        category={category}
        city={selectedCity}
        state={selectedState}
        locationKind={locationKind}
        checkIn={initialCheckIn || null}
        checkOut={initialCheckOut || null}
        guests={initialGuests}
      />
      <ListingsHero
        category={category}
        cover={heroCover}
        description={heroDescription}
        seo={seoRecord}
        initialCity={selectedCity}
        initialState={selectedState}
        initialLocationKind={locationKind}
        initialCheckIn={initialCheckIn}
        initialCheckOut={initialCheckOut}
        initialAdults={initialAdults}
        initialChildren={initialChildren}
        initialRooms={initialRooms}
      />

      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-10">
        <CategoryPills activeCategory={activeCat} />

        {usesApiData ? (
          <Suspense
            key={`${selectedCity}|${selectedState}|${category}`}
            fallback={<ListingsResultsSkeleton activeCategory={activeCat} />}
          >
            <ApiListingsResults
              city={selectedCity}
              state={selectedState}
              activeCat={activeCat}
              label={label}
            />
          </Suspense>
        ) : (
          <ListingsFilteredCatalog
            listings={staticListings}
            activeCat={activeCat}
            label={label}
            locationFilterMode={false}
          />
        )}

        {seoRecord && <ListingsSeoContent seo={seoRecord} />}
      </div>
    </div>
  );
}
