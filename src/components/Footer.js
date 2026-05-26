import Link from "next/link";
import { LogoLink } from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="mt-auto pb-24 md:pb-0">
      {/* Newsletter band */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center lg:flex-row lg:text-left">
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-brand">
              Newsletter
            </p>
            <h3 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
              Get exclusive deals in your inbox
            </h3>
            <p className="mt-2 text-sm text-stone-400">
              Villa drops, flash sales & member-only rates—no spam.
            </p>
          </div>
          <form className="flex w-full max-w-md gap-2">
            <input
              type="email"
              placeholder="you@email.com"
              className="flex-1 rounded-2xl border border-stone-600 bg-stone-800/50 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-brand"
              readOnly
            />
            <button
              type="button"
              className="shrink-0 rounded-2xl bg-gradient-to-r from-brand to-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand/30"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-border bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <LogoLink size="lg" className="max-w-[200px]" />
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
                Curated hotels, Airbnbs, homestays & villas—crafted with our
                signature orange hospitality across every journey.
              </p>
              <div className="mt-5 flex gap-3">
                {["Instagram", "Facebook", "Twitter"].map((s) => (
                  <span
                    key={s}
                    className="flex h-10 w-10 cursor-default items-center justify-center rounded-xl border border-border bg-stone-50 text-xs font-bold text-stone-500 transition hover:border-brand hover:text-brand"
                  >
                    {s[0]}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wide text-foreground">
                Stays
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-muted">
                <li>
                  <Link href="/listings?category=hotel" className="transition hover:text-brand">
                    Hotels
                  </Link>
                </li>
                <li>
                  <Link href="/listings?category=airbnb" className="transition hover:text-brand">
                    Airbnb
                  </Link>
                </li>
                <li>
                  <Link href="/listings?category=homestay" className="transition hover:text-brand">
                    HomeStay & Villa
                  </Link>
                </li>
                <li>
                  <Link href="/listings" className="transition hover:text-brand">
                    All properties
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wide text-foreground">
                Company
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-muted">
                <li>
                  <a href="https://www.demandsetutours.com" className="transition hover:text-brand">
                    About us
                  </a>
                </li>
                <li>Careers</li>
                <li>Partner with us</li>
                <li>Press</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wide text-foreground">
                Support
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-muted">
                <li>Help centre</li>
                <li>Cancellation policy</li>
                <li>+91 98765 43210</li>
                <li>hello@demandsetu.com</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted sm:flex-row">
            <p>© {new Date().getFullYear()} Demand Setu Tours. All rights reserved.</p>
            <div className="flex gap-4">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Cookies</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
