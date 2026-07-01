import { notFound, redirect } from "next/navigation";
import PropertyPageView, { buildPropertyMetadata } from "@/app/property/PropertyPageView";
import { buildPropertyUrl, parseTripFromSearchParams } from "@/lib/bookingSearch";
import { resolvePropertyByRouteParams } from "@/lib/propertyData";
import { propertyRouteSegmentMatches } from "@/lib/propertySlug";

export async function generateMetadata({ params }) {
  const routeParams = await params;
  const resolved = await resolvePropertyByRouteParams(routeParams);
  return buildPropertyMetadata(resolved);
}

export default async function PropertySlugPage({ params, searchParams }) {
  const routeParams = await params;
  const query = await searchParams;
  const resolved = await resolvePropertyByRouteParams(routeParams);
  if (!resolved) notFound();

  if (!propertyRouteSegmentMatches(routeParams.property, resolved.listing)) {
    const trip = parseTripFromSearchParams(query);
    redirect(buildPropertyUrl(resolved.listing, trip));
  }

  return PropertyPageView({ resolved, searchParams });
}
