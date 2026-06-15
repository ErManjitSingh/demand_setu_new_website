import { notFound } from "next/navigation";
import ListingsPageView, { listingsMetadata } from "@/app/listings/ListingsPageView";
import { resolveListingsLocationParams } from "@/lib/locationResolve";
import { mergeListingsRouteSearchParams } from "@/lib/listingsSlug";

export const metadata = listingsMetadata;

export default async function LocationListingsPage({ params, searchParams }) {
  const routeParams = await params;
  const queryParams = await searchParams;
  const merged = mergeListingsRouteSearchParams(routeParams, queryParams);
  if (!merged) notFound();

  const resolved = await resolveListingsLocationParams(merged, routeParams.location);

  return ListingsPageView({ searchParams: Promise.resolve(resolved) });
}
