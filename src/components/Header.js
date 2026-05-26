import Link from "next/link";
import { LogoLink } from "@/components/Logo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/listings", label: "Explore" },
  { href: "/listings?category=hotel", label: "Hotels" },
  { href: "/listings?category=airbnb", label: "Airbnb" },
  { href: "/listings?category=homestay", label: "Villas" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50">
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 px-4 py-1.5 text-center text-[11px] font-medium text-stone-300">
        <span className="text-brand-light">✦</span>{" "}
        <span className="text-white">Summer Sale</span> — Up to 30% off villa
        stays · Code{" "}
        <span className="rounded bg-brand/20 px-1.5 py-0.5 font-bold text-orange-300">
          ORANGE30
        </span>
      </div>

      <div className="glass border-b border-white/60 shadow-sm shadow-stone-200/40">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
          <LogoLink size="md" className="max-w-[140px] sm:max-w-[180px]" />

          <nav className="hidden items-center gap-0.5 rounded-full border border-border/80 bg-stone-50/80 p-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-stone-600 transition hover:bg-white hover:text-brand-dark hover:shadow-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-stone-500 transition hover:border-brand/40 hover:text-brand sm:flex"
              aria-label="Wishlist"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>
            <button
              type="button"
              className="hidden rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-brand/40 md:inline-flex"
            >
              Sign in
            </button>
            <Link
              href="/listings"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand to-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand/30 transition hover:shadow-xl hover:shadow-brand/40 active:scale-[0.98] sm:px-5"
            >
              Book now
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
