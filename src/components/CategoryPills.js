import Link from "next/link";
import { CATEGORIES } from "@/lib/listings";

export default function CategoryPills({ activeCategory = "all" }) {
  const pillClass = (active) =>
    active
      ? "bg-gradient-to-r from-brand to-orange-500 text-white shadow-lg shadow-brand/30 ring-2 ring-brand/20"
      : "bg-white text-foreground shadow-md shadow-stone-200/60 ring-1 ring-stone-900/5 hover:ring-brand/30 hover:shadow-lg";

  return (
    <div className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
      <Link
        href="/listings"
        className={`flex shrink-0 items-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-bold transition ${pillClass(activeCategory === "all")}`}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 text-lg">
          ✨
        </span>
        All stays
      </Link>
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.id}
          href={`/listings?category=${cat.id}`}
          className={`flex shrink-0 items-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-bold transition ${pillClass(activeCategory === cat.id)}`}
        >
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-xl text-lg ${
              activeCategory === cat.id ? "bg-white/20" : "bg-brand-muted"
            }`}
          >
            {cat.icon}
          </span>
          {cat.label}
        </Link>
      ))}
    </div>
  );
}
