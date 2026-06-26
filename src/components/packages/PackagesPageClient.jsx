"use client";

import { useCallback, useState } from "react";
import AllPackagesCatalog from "@/components/packages/AllPackagesCatalog";
import PackageEnquiryForm from "@/components/booking/PackageEnquiryForm";
import FamousPackagesSection from "@/components/packages/FamousPackagesSection";
import PackagesContentMarquee from "@/components/packages/PackagesContentMarquee";
import PackagesExploreCountries from "@/components/packages/PackagesExploreCountries";
import PackagesExploreStates from "@/components/packages/PackagesExploreStates";
import PackagesFAQ from "@/components/packages/PackagesFAQ";
import PackagesHeroSearch from "@/components/packages/PackagesHeroSearch";
import PackagesPopularCities from "@/components/packages/PackagesPopularCities";
import PackagesPromoBanner from "@/components/packages/PackagesPromoBanner";
import PackagesWhyTravel from "@/components/packages/PackagesWhyTravel";
import { DEFAULT_PACKAGE_IMAGE, getFamousPackages } from "@/lib/tourPackages";

export default function PackagesPageClient({ states = [], cities = [] }) {
  const [enquiryPackage, setEnquiryPackage] = useState(null);
  const famousPackages = getFamousPackages();

  const openEnquiry = useCallback((pkg) => {
    setEnquiryPackage(pkg);
  }, []);

  const openLocationEnquiry = useCallback(
    ({ country, state, city, label, adults, travelDate, tourType }) => {
      setEnquiryPackage({
        id: "custom-enquiry",
        title: label || city || state || country || "Custom tour",
        duration: "Flexible",
        location: [city, state, country].filter(Boolean).join(", ") || "India",
        image: DEFAULT_PACKAGE_IMAGE,
        defaultTravellers: adults ?? 2,
        defaultTravelDate: travelDate ?? "",
        defaultTourType: tourType ?? "",
      });
    },
    []
  );

  return (
    <>
      <PackagesHeroSearch states={states} cities={cities} />
      <PackagesContentMarquee />
      <PackagesExploreStates states={states} onEnquire={openLocationEnquiry} />
      <PackagesExploreCountries onEnquire={openLocationEnquiry} />
      <PackagesPopularCities cities={cities} onEnquire={openLocationEnquiry} />
      <FamousPackagesSection packages={famousPackages} onViewDetails={openEnquiry} />
      <AllPackagesCatalog onViewDetails={openEnquiry} />
      <PackagesPromoBanner onEnquire={() => openLocationEnquiry({ label: "Promo package enquiry" })} />
      <PackagesWhyTravel />
      <PackagesFAQ />

      <PackageEnquiryForm
        open={Boolean(enquiryPackage)}
        onClose={() => setEnquiryPackage(null)}
        tourPackage={enquiryPackage}
      />
    </>
  );
}
