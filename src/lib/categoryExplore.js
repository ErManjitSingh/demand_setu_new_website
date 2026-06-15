import { CATEGORIES } from "@/lib/listings";
import { buildListingsSearchUrl } from "@/lib/bookingSearch";

export const ALL_STAYS_CATEGORY = {
  id: "all",
  label: "All stays",
  description: "Hotels, villas & unique stays — pick a city or state.",
  icon: "✨",
};

export function resolveExploreCategory(categoryOrId) {
  if (!categoryOrId) return null;
  if (typeof categoryOrId === "object") return categoryOrId;
  if (categoryOrId === "all") return ALL_STAYS_CATEGORY;
  return CATEGORIES.find((c) => c.id === categoryOrId) ?? null;
}

export function buildExploreListingsUrl({ categoryId = "all", city = "", state = "" } = {}) {
  return buildListingsSearchUrl({
    category: categoryId,
    city,
    state,
  });
}
