import { CATEGORIES } from "@/lib/listings";
import { getApiPropertyType } from "@/lib/propertyTypes";

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
  const params = new URLSearchParams();
  const id = String(categoryId || "all");

  if (id !== "all") {
    params.set("category", id);
    const propertyType = getApiPropertyType(id);
    if (propertyType) params.set("propertyType", propertyType);
  }

  const selectedCity = String(city || "").trim();
  const selectedState = String(state || "").trim();
  if (selectedCity) params.set("city", selectedCity);
  if (selectedState) params.set("state", selectedState);

  const query = params.toString();
  return query ? `/listings?${query}` : "/listings";
}
