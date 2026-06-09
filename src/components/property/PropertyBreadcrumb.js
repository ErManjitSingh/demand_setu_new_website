import Link from "next/link";

export default function PropertyBreadcrumb({ listing, city, state }) {
  const cityLabel = city || listing.location?.split(",")[0]?.trim() || listing.region;

  return (
    <nav className="flex flex-wrap items-center gap-1.5 text-xs text-[#4a4a4a] sm:text-sm">
      <Link href="/" className="hover:text-brand">
        Home
      </Link>
      <span className="text-[#9b9b9b]">/</span>
      <Link href="/listings?category=hotel" className="hover:text-brand">
        Hotels in India
      </Link>
      <span className="text-[#9b9b9b]">/</span>
      <Link
        href={`/listings?city=${encodeURIComponent(cityLabel)}${state ? `&state=${encodeURIComponent(state)}` : ""}`}
        className="hover:text-brand"
      >
        {cityLabel}
      </Link>
      <span className="text-[#9b9b9b]">/</span>
      <span className="font-semibold text-[#1a1a1a]">{listing.title}</span>
    </nav>
  );
}
