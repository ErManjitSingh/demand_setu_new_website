import Link from "next/link";

function buildListingsHref(category) {
  if (category && category !== "all") {
    return `/listings?category=${category}`;
  }
  return "/listings";
}

export default function ListingsHeroSearch({ category }) {
  const searchHref = buildListingsHref(category);

  return (
    <div className="w-full rounded-[2rem] bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.25)] ring-1 ring-white/80 sm:rounded-full sm:p-1.5">
      <div className="flex flex-col sm:flex-row sm:items-stretch">
        <PillField
          icon={<PinIcon />}
          label="Where are you going?"
          placeholder="Search location"
          className="sm:rounded-l-full"
        />
        <Divider />
        <PillField
          icon={<CalendarIcon />}
          label="Check-in – Check-out"
          placeholder="Add dates"
        />
        <Divider />
        <PillField
          icon={<GuestsIcon />}
          label="Guests & Rooms"
          placeholder="2 Guests, 1 Room"
          showChevron
        />
        <Link
          href={searchHref}
          className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand to-orange-500 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-brand/35 transition hover:brightness-105 active:scale-[0.99] sm:mt-0 sm:min-w-[160px] sm:rounded-full sm:px-6"
        >
          <SearchIcon />
          <span className="whitespace-nowrap">Search stays</span>
        </Link>
      </div>
    </div>
  );
}

function PillField({ icon, label, placeholder, showChevron, className = "" }) {
  return (
    <label
      className={`flex flex-1 cursor-pointer items-center gap-3 px-4 py-3.5 transition hover:bg-stone-50 sm:px-5 sm:py-4 ${className}`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-muted text-brand">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold text-stone-500">{label}</span>
        <span className="mt-0.5 flex items-center gap-1">
          <input
            type="text"
            readOnly
            placeholder={placeholder}
            className="w-full bg-transparent text-sm font-bold text-foreground outline-none placeholder:font-semibold placeholder:text-stone-800"
          />
          {showChevron && (
            <svg className="h-4 w-4 shrink-0 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          )}
        </span>
      </span>
    </label>
  );
}

function Divider() {
  return (
    <div className="mx-4 h-px bg-stone-200 sm:mx-0 sm:h-auto sm:w-px sm:self-stretch sm:bg-stone-200" />
  );
}

function SearchIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5a2.25 2.25 0 012.25 2.25V18.75M3 18.75h18" />
    </svg>
  );
}

function GuestsIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}
