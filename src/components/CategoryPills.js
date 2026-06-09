"use client";

import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/listings";
import { ALL_STAYS_CATEGORY } from "@/lib/categoryExplore";
import { useCategoryExplore } from "@/hooks/useCategoryExplore";

function CategoryPillsClient({ activeCategory = "all" }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openExplore, modal } = useCategoryExplore();

  const hasLocation =
    pathname === "/listings" &&
    (Boolean(searchParams.get("city")?.trim()) ||
      Boolean(searchParams.get("state")?.trim()));

  const pillClass = (active) =>
    active
      ? "bg-gradient-to-r from-brand to-orange-500 text-white shadow-lg shadow-brand/30 ring-2 ring-brand/20"
      : "bg-white text-foreground shadow-md shadow-stone-200/60 ring-1 ring-stone-900/5 hover:ring-brand/30 hover:shadow-lg";

  const setCategory = (catId) => {
    const params = new URLSearchParams(searchParams.toString());
    if (catId === "all") {
      params.delete("category");
      params.delete("propertyType");
    } else {
      params.set("category", catId);
      params.delete("propertyType");
    }
    router.replace(`/listings?${params.toString()}`, { scroll: false });
  };

  const handleClick = (catId) => {
    if (hasLocation) {
      setCategory(catId);
      return;
    }
    openExplore(catId);
  };

  return (
    <>
      <div className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        <button
          type="button"
          onClick={() => handleClick("all")}
          className={`flex shrink-0 items-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-bold transition ${pillClass(activeCategory === "all")}`}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 text-lg">
            {ALL_STAYS_CATEGORY.icon}
          </span>
          {ALL_STAYS_CATEGORY.label}
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleClick(cat.id)}
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
          </button>
        ))}
      </div>
      {!hasLocation && modal}
    </>
  );
}

export default function CategoryPills(props) {
  return (
    <Suspense fallback={<div className="h-14 animate-pulse rounded-2xl bg-stone-200" />}>
      <CategoryPillsClient {...props} />
    </Suspense>
  );
}
