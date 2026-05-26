import Link from "next/link";
import ListingsHero from "@/components/listings/ListingsHero";
import ListingsFilterSidebar from "@/components/listings/ListingsFilterSidebar";
import RecommendedSlider from "@/components/listings/RecommendedSlider";
import AllPropertiesList from "@/components/listings/AllPropertiesList";
import ListingsMobileFilters from "@/components/listings/ListingsMobileFilters";
import CategoryPills from "@/components/CategoryPills";
import {
  getListingsByCategory,
  getCategoryLabel,
  CATEGORIES,
} from "@/lib/listings";

export const metadata = {
  title: "Explore Stays | Demand Setu",
  description: "Browse hotels, Airbnbs, homestays and villas across India.",
};

const SORT_OPTIONS = ["Recommended", "Price: low", "Top rated"];

export default async function ListingsPage({ searchParams }) {
  const params = await searchParams;
  const category = params?.category ?? "all";
  const listings = getListingsByCategory(category);
  const label = getCategoryLabel(category);
  const activeCat = category === "all" ? "all" : category;
  const categoryMeta = CATEGORIES.find((c) => c.id === category);

  const recommended = listings.slice(0, 3);

  const heroCover =
    categoryMeta?.cover ??
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1400&q=80";

  const heroDescription =
    category === "all"
      ? "Hotels, villas & unique stays for unforgettable memories."
      : categoryMeta?.description ??
        `${label} across India — handpicked for unforgettable memories.`;

  return (
    <div className="min-h-screen bg-background">
      <ListingsHero
        category={category}
        cover={heroCover}
        description={heroDescription}
      />

      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-10">
        <CategoryPills activeCategory={activeCat} />

        {listings.length === 0 ? (
          <div className="mt-10 rounded-3xl border-2 border-dashed border-brand/20 bg-white p-12 text-center sm:p-16">
            <span className="text-5xl">🏝️</span>
            <h2 className="mt-4 text-2xl font-extrabold">No stays in this category</h2>
            <p className="mt-2 text-muted">Try another collection or view all stays.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              <Link
                href="/listings"
                className="rounded-full bg-gradient-to-r from-brand to-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand/25"
              >
                View all stays
              </Link>
              {CATEGORIES.map((c) => (
                <Link
                  key={c.id}
                  href={`/listings?category=${c.id}`}
                  className="rounded-full border border-border bg-white px-4 py-2.5 text-sm font-bold transition hover:border-brand"
                >
                  {c.icon} {c.label}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-10">
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <ListingsFilterSidebar activeCategory={activeCat} />
              </div>
            </div>

            <div className="min-w-0 space-y-10 pb-16">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted">
                  <span className="font-extrabold text-foreground">{listings.length}</span>{" "}
                  stays
                  {category !== "all" && (
                    <>
                      {" "}
                      in <span className="font-extrabold text-brand">{label}</span>
                    </>
                  )}
                </p>
                <div className="flex items-center gap-2">
                  <ListingsMobileFilters activeCategory={activeCat} />
                  <div className="hidden items-center gap-1 rounded-xl border border-border bg-white p-1 shadow-sm sm:flex">
                    {SORT_OPTIONS.map((opt, i) => (
                      <button
                        key={opt}
                        type="button"
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                          i === 0
                            ? "bg-brand-muted text-brand-dark"
                            : "text-muted hover:text-foreground"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {recommended.length > 0 && (
                <RecommendedSlider listings={recommended} />
              )}

              <AllPropertiesList listings={listings} />

              <div className="grid gap-4 rounded-3xl bg-stone-900 p-6 text-white sm:grid-cols-3">
                {[
                  {
                    icon: "🛡️",
                    title: "Verified stays",
                    text: "Every listing checked by our team",
                  },
                  {
                    icon: "💳",
                    title: "Secure payments",
                    text: "UPI · Visa · Mastercard",
                  },
                  {
                    icon: "📞",
                    title: "24/7 support",
                    text: "+91 8353056000",
                  },
                ].map((item) => (
                  <div key={item.title} className="text-center sm:py-2">
                    <span className="text-2xl">{item.icon}</span>
                    <p className="mt-2 text-sm font-bold">{item.title}</p>
                    <p className="mt-0.5 text-xs text-stone-400">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
