import Link from "next/link";
import { LogoLink } from "@/components/Logo";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 ">
   

      <div className=" glass border-b border-white/60 shadow-sm shadow-stone-200/40 ">
        <div className=" mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
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

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <a
              href="tel:+918353056000"
              className="flex items-center gap-2 rounded-full border border-border/80 bg-white/90 px-2.5 py-1.5 transition hover:border-brand/40 sm:px-3.5 sm:py-2"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-muted text-brand sm:h-9 sm:w-9">
                <PhoneIcon />
              </span>
              <span className="min-w-0 text-left leading-tight">
                <span className="block text-[9px] font-bold uppercase tracking-wide text-muted sm:text-[10px]">
                  Customer Service
                </span>
                <span className="block text-xs font-extrabold text-brand sm:text-sm">
                  +91 8353056000
                </span>
              </span>
            </a>
            <Link
              href="/signin"
              className="inline-flex rounded-full border border-border bg-white px-3 py-2 text-xs font-semibold text-foreground transition hover:border-brand/40 sm:px-5 sm:py-2.5 sm:text-sm"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/listings", label: "Explore" },
  { href: "/listings?category=hotel", label: "Hotels" },
  { href: "/listings?category=airbnb", label: "Airbnb" },
  { href: "/listings?category=homestay", label: "Villas" },
];

function PhoneIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
      />
    </svg>
  );
}
