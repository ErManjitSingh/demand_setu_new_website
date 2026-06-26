import PackagesPageClient from "@/components/packages/PackagesPageClient";
import {
  fetchHotelCitiesList,
  fetchHotelStatesList,
} from "@/lib/locationResolve";

export const metadata = {
  title: "Tour Packages | Demand Setu",
  description:
    "Tour packages across India and the world — explore states, cities and famous itineraries with Demand Setu.",
};

export default async function PackagesPage() {
  const [states, cities] = await Promise.all([
    fetchHotelStatesList(),
    fetchHotelCitiesList(),
  ]);

  return <PackagesPageClient states={states} cities={cities} />;
}
