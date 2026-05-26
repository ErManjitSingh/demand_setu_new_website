import Link from "next/link";

export default function SearchBar({ compact = false, elevated = false }) {
  if (compact) {
    return (
      <Link
        href="/listings"
        className="card-shine group flex items-center gap-4 rounded-2xl border border-white/80 bg-white/90 p-2 pl-2 shadow-xl shadow-stone-300/30 ring-1 ring-stone-900/5 transition hover:shadow-2xl hover:ring-brand/20"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-orange-400 text-white shadow-md shadow-brand/30">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </span>
        <div className="min-w-0 flex-1 text-left">
          <p className="text-sm font-bold text-foreground">Where to next?</p>
          <p className="truncate text-xs text-muted">
            Anywhere · Any week · Add guests
          </p>
        </div>
        <span className="mr-2 hidden rounded-full bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-600 sm:inline">
          Search
        </span>
      </Link>
    );
  }

  return (
    <div
      className={`rounded-3xl border border-white/60 bg-white/95 p-2 shadow-2xl shadow-stone-900/10 ring-1 ring-white/80 backdrop-blur-xl sm:p-2.5 ${
        elevated ? "animate-pulse-glow" : ""
      }`}
    >
      <div className="grid gap-1.5 sm:grid-cols-[1.3fr_1fr_1fr_auto] sm:gap-0 sm:rounded-2xl sm:bg-stone-50/80 sm:p-1">
        <label className="group flex gap-3 rounded-2xl px-4 py-3 transition hover:bg-white sm:rounded-l-xl">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-muted text-brand">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </span>
          <span className="min-w-0">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-brand">
              Location
            </span>
            <input
              type="text"
              placeholder="Goa, Manali, Jaipur..."
              className="mt-0.5 w-full bg-transparent text-sm font-semibold outline-none placeholder:font-normal placeholder:text-stone-400"
              readOnly
            />
          </span>
        </label>
        <label className="group flex gap-3 rounded-2xl px-4 py-3 transition hover:bg-white">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-muted text-brand">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          </span>
          <span>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-brand">
              Check in — out
            </span>
            <input
              type="text"
              placeholder="Add dates"
              className="mt-0.5 w-full bg-transparent text-sm font-semibold outline-none placeholder:font-normal placeholder:text-stone-400"
              readOnly
            />
          </span>
        </label>
        <label className="group flex gap-3 rounded-2xl px-4 py-3 transition hover:bg-white">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-muted text-brand">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </span>
          <span>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-brand">
              Guests
            </span>
            <input
              type="text"
              placeholder="2 guests"
              className="mt-0.5 w-full bg-transparent text-sm font-semibold outline-none placeholder:font-normal placeholder:text-stone-400"
              readOnly
            />
          </span>
        </label>
        <Link
          href="/listings"
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand via-orange-500 to-amber-500 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-brand/35 transition hover:brightness-105 sm:mx-1 sm:my-1 sm:rounded-xl sm:py-3"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          Search stays
        </Link>
      </div>
    </div>
  );
}
