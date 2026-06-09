import Link from "next/link";
import PaymentLogos from "@/components/PaymentLogos";

const QUICK_LINKS = [
  { label: "About Us", href: "https://www.demandsetutours.com" },
  { label: "Contact Us", href: "https://www.demandsetutours.com" },
  { label: "Travel Blog", href: "#" },
  { label: "Testimonials", href: "#" },
  { label: "FAQ", href: "#" },
  { label: "Careers", href: "#" },
];

const DESTINATIONS = [
  "Ladakh",
  "Himachal Pradesh",
  "Rajasthan",
  "Kerala",
  "Goa",
  "Kashmir",
];

const SERVICES = [
  "Tour Packages",
  "Hotels",
  "Flights",
  "Transport",
  "Visa Assistance",
  "Travel Insurance",
];

const SOCIAL = [
  { name: "Facebook", icon: FacebookIcon },
  { name: "Instagram", icon: InstagramIcon },
  { name: "Twitter", icon: TwitterIcon },
  { name: "LinkedIn", icon: LinkedInIcon },
  { name: "YouTube", icon: YouTubeIcon },
];

function FooterLink({ href, children }) {
  const className =
    "text-sm text-stone-300 transition hover:text-white inline-block";

  if (href.startsWith("http")) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  if (href === "#") {
    return <span className={`${className} cursor-default`}>{children}</span>;
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#121212] pb-24 text-white md:pb-0">
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
        {/* Newsletter — orange card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] p-6 shadow-[0_8px_40px_rgba(234,88,12,0.45)] sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-8">
            <div className="flex items-start gap-4 sm:items-center">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white shadow-md">
                <EnvelopeIcon className="h-7 w-7 text-[#ea580c]" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-white sm:text-xl">
                  Stay Updated with Travel Offers
                </h3>
                <p className="mt-1 max-w-md text-sm text-orange-50/95">
                  Get exclusive deals, travel tips, and destination guides delivered
                  to your inbox
                </p>
              </div>
            </div>

            <form className="relative w-full shrink-0 lg:max-w-md lg:flex-1">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full rounded-xl border-0 bg-white py-3.5 pl-4 pr-32 text-sm text-stone-800 outline-none placeholder:text-stone-400 shadow-inner sm:pr-36"
                readOnly
              />
              <button
                type="button"
                className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-1.5 rounded-lg bg-stone-100 px-3 py-2 text-sm font-semibold text-stone-700 transition hover:bg-white sm:px-4"
              >
                Subscribe
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Main columns */}
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Company */}
          <div className="lg:col-span-4">
            <Link href="/" className="text-2xl font-extrabold text-[#ea580c] sm:text-3xl">
              Demand Setu
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone-400">
              Your trusted travel partner for unforgettable journeys. We craft
              personalized travel experiences that create lasting memories.
            </p>

            <ul className="mt-6 space-y-3">
              <li>
                <a
                  href="tel:+918353056000"
                  className="flex items-start gap-3 text-sm text-stone-300 transition hover:text-white"
                >
                  <PhoneIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#ea580c]" />
                  +91 8353056000
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@demandsetutours.com"
                  className="flex items-start gap-3 text-sm text-stone-300 transition hover:text-white"
                >
                  <EnvelopeIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#ea580c]" />
                  info@demandsetutours.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-stone-300">
                <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#ea580c]" />
                <span>
                  First floor, Mother Bindra Tower, 39 mile, Shahpur, Himachal
                  Pradesh 176206
                </span>
              </li>
            </ul>

            <div className="mt-6 flex gap-2">
              {SOCIAL.map(({ name, icon: Icon }) => (
                <a
                  key={name}
                  href="#"
                  aria-label={name}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-800 text-stone-300 transition hover:bg-[#ea580c] hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="flex items-center gap-2 text-base font-bold text-white">
              <LinkChainIcon className="h-5 w-5 text-[#ea580c]" />
              Quick Links
            </h4>
            <ul className="mt-5 space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div className="lg:col-span-3">
            <h4 className="flex items-center gap-2 text-base font-bold text-white">
              <MapPinIcon className="h-5 w-5 text-[#ea580c]" />
              Popular Destinations
            </h4>
            <ul className="mt-5 space-y-2.5">
              {DESTINATIONS.map((dest) => (
                <li key={dest}>
                  <FooterLink href="/listings">{dest}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            <h4 className="flex items-center gap-2 text-base font-bold text-white">
              <UmbrellaIcon className="h-5 w-5 text-[#ea580c]" />
              Travel Services
            </h4>
            <ul className="mt-5 space-y-2.5">
              {SERVICES.map((service) => (
                <li key={service}>
                  <FooterLink
                    href={
                      service === "Hotels"
                        ? "/listings?category=hotel"
                        : "/listings"
                    }
                  >
                    {service}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-stone-800" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center gap-4 py-8 sm:flex-row sm:justify-between">
          <p className="text-sm text-stone-500">
            © {new Date().getFullYear()} Demand Setu. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
            <a href="#" className="transition hover:text-stone-300">
              Privacy Policy
            </a>
            <span className="text-stone-700">|</span>
            <a href="#" className="transition hover:text-stone-300">
              Terms of Service
            </a>
            <span className="text-stone-700">|</span>
            <a href="#" className="transition hover:text-stone-300">
              Cancellation Policy
            </a>
          </div>
        </div>

        {/* Payment */}
        <div className="flex flex-col items-center gap-3 border-t border-stone-800/80 pb-10 pt-6">
          <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
            We Accept:
          </p>
          <PaymentLogos />
        </div>
      </div>
    </footer>
  );
}

function EnvelopeIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function PhoneIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.956 1.294c-.28.38-.739.557-1.183.411a12.034 12.034 0 01-7.143-7.143c-.146-.444.031-.902.411-1.183l1.294-.956c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

function MapPinIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}

function LinkChainIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
    </svg>
  );
}

function UmbrellaIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5m0 15V21m0-16.5A9 9 0 003 12h18a9 9 0 00-9-10.5zM12 7.5v3" />
    </svg>
  );
}

function ArrowRightIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

function FacebookIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function TwitterIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function YouTubeIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}
