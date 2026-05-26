import Link from "next/link";
import { CATEGORIES } from "@/lib/listings";

const PRICE_RANGES = [
  "Under ₹2,000",
  "₹2,000 – ₹5,000",
  "₹5,000 – ₹10,000",
  "₹10,000+",
];

const AMENITY_FILTERS = [
  "Free WiFi",
  "Pool",
  "Breakfast",
  "Parking",
  "Pet friendly",
];

export default function ListingsFilterSidebar({ activeCategory }) {
  return (
    <aside className="rounded-3xl border border-border/80 bg-white shadow-lg shadow-stone-200/30">
      <div className="border-b border-stone-100 px-5 py-4">
        <h3 className="text-sm font-extrabold text-foreground">Refine search</h3>
        <p className="mt-0.5 text-xs text-muted">Property type, price & more</p>
      </div>

      <div className="p-5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-brand">
          Property type
        </p>
        <ul className="mt-3 space-y-1">
          <li>
            <Link
              href="/listings"
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                activeCategory === "all"
                  ? "bg-brand text-white shadow-md shadow-brand/20"
                  : "text-muted hover:bg-brand-muted hover:text-brand-dark"
              }`}
            >
              <span>✨</span> All stays
            </Link>
          </li>
          {CATEGORIES.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/listings?category=${cat.id}`}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  activeCategory === cat.id
                    ? "bg-brand text-white shadow-md shadow-brand/20"
                    : "text-muted hover:bg-brand-muted hover:text-brand-dark"
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
                <span className="ml-auto text-xs opacity-70">{cat.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-stone-100 px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-brand">
          Price per night
        </p>
        <ul className="mt-3 space-y-1">
          {PRICE_RANGES.map((range) => (
            <li key={range}>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted transition hover:bg-stone-50">
                <input
                  type="checkbox"
                  readOnly
                  className="h-4 w-4 rounded border-stone-300 accent-[#ea580c]"
                />
                {range}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-stone-100 px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-brand">
          Guest rating
        </p>
        <ul className="mt-3 flex gap-2">
          {["4.9+", "4.5+", "4.0+"].map((r) => (
            <li key={r}>
              <button
                type="button"
                className="rounded-full border border-border bg-stone-50 px-3 py-1.5 text-xs font-bold text-amber-700 transition hover:border-brand hover:bg-brand-muted"
              >
                ★ {r}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-stone-100 px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-brand">
          Amenities
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {AMENITY_FILTERS.map((a) => (
            <li key={a}>
              <button
                type="button"
                className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted transition hover:border-brand hover:text-brand-dark"
              >
                {a}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-stone-100 p-5">
        <div className="rounded-2xl bg-gradient-to-br from-stone-900 to-stone-800 p-4 text-white">
          <p className="text-xs font-bold text-orange-200">Orange line · 24/7</p>
          <p className="mt-1 text-sm font-semibold leading-snug">
            Talk to a travel expert—we&apos;ll find your perfect stay.
          </p>
          <a
            href="tel:+918353056000"
            className="mt-3 flex w-full items-center justify-center rounded-xl bg-white py-2.5 text-sm font-bold text-stone-900 transition hover:bg-orange-50"
          >
            +91 8353056000
          </a>
        </div>
      </div>
    </aside>
  );
}
