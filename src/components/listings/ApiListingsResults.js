import { fetchListingsForLocation } from "@/lib/hotelListingsApi";
import ListingsFilteredCatalog from "@/components/listings/ListingsFilteredCatalog";

export default async function ApiListingsResults({
  city = "",
  state = "",
  activeCat,
  label,
}) {
  const listings = await fetchListingsForLocation({ city, state });

  return (
    <ListingsFilteredCatalog
      listings={listings}
      activeCat={activeCat}
      label={label}
      selectedCity={city}
      selectedState={state}
      locationFilterMode
    />
  );
}
