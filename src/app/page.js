import Image from "next/image";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import CategoryPills from "@/components/CategoryPills";
import PropertyCard from "@/components/PropertyCard";
import SectionHeading from "@/components/SectionHeading";
import GuestFavourites from "@/components/GuestFavourites";
import CategoryShowcase from "@/components/CategoryShowcase";
import { LISTINGS, DESTINATIONS, TESTIMONIALS } from "@/lib/listings";

const topRated = LISTINGS.filter((l) => l.rating >= 4.9);
const heroSpotlight = topRated[0];
const heroSide = topRated.slice(1, 3);
const trending = LISTINGS.slice(0, 6);



export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="mesh-hero pattern-dots relative overflow-hidden">
        {/* Darken left side so text always reads clearly */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-orange-950/50 via-orange-900/20 to-transparent" />
        <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-orange-950/50 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 sm:pb-12 sm:pt-14">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="relative z-10">
             

              <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Luxury stays.
                <span className="mt-1 block text-amber-200">
                  Unforgettable journeys.
                </span>
              </h1>

              <p className="mt-5 max-w-lg text-base font-medium leading-relaxed text-white/90 sm:text-lg">
                Handpicked hotels, designer Airbnbs & private villas—crafted for
                travellers who expect more than ordinary.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/listings"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-orange-700 shadow-xl shadow-black/20 transition hover:bg-orange-50"
                >
                  Explore stays
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href="/listings?category=homestay"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white/80 bg-transparent px-6 py-3 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  View villas
                </Link>
              </div>

           
            </div>

            {/* Floating preview cards - desktop */}
            <div className="relative z-10 hidden h-[420px] lg:block">
              {heroSpotlight && (
                <Link
                  href={`/property/${heroSpotlight.slug}`}
                  className="animate-float absolute right-0 top-0 w-[72%] overflow-hidden rounded-3xl shadow-2xl ring-2 ring-white/30"
                >
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={heroSpotlight.image}
                      alt={heroSpotlight.title}
                      fill
                      className="object-cover"
                      sizes="400px"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-xs font-bold text-orange-200">Featured</p>
                      <p className="text-lg font-bold">{heroSpotlight.title}</p>
                    </div>
                  </div>
                </Link>
              )}
              {heroSide.map((item, i) => (
                <Link
                  key={item.slug}
                  href={`/property/${item.slug}`}
                  className={`animate-float-delay absolute overflow-hidden rounded-2xl shadow-xl ring-2 ring-white/25 ${
                    i === 0 ? "left-0 top-8 w-[42%]" : "bottom-0 left-8 w-[38%]"
                  }`}
                >
                  <div className="relative aspect-square">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-10 sm:mt-12">
            <SearchBar elevated />
          </div>
        </div>
      </section>

      {/* Marquee trust */}
      <div className="overflow-hidden border-y border-border bg-white py-3">
        <div className="animate-marquee flex w-max gap-12 whitespace-nowrap px-4 text-sm font-semibold text-stone-500">
          {[...Array(2)].map((_, set) => (
            <span key={set} className="flex gap-12">
              {[
                "✦ Verified properties",
                "✦ Best price guarantee",
                "✦ Free cancellation",
                "✦ 24/7 orange-line support",
                "✦ Secure payments",
                "✦ Superhost partners",
              ].map((t) => (
                <span key={`${set}-${t}`}>{t}</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Category showcase */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="Collections"
          title="Choose your perfect stay style"
          subtitle="From boutique hotels to private beach villas—every property is personally vetted by our team."
        />

        <CategoryShowcase />

        <div className="mt-10">
          <CategoryPills />
        </div>
      </section>

      {/* Destinations */}
      <section className="bg-gradient-to-b from-white to-brand-muted/30 py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Destinations"
            title="Where will you go next?"
            subtitle="Trending regions with the highest guest satisfaction this season."
            action={
              <Link
                href="/listings"
                className="text-sm font-bold text-brand hover:text-brand-dark"
              >
                View all →
              </Link>
            }
          />

          <div className="no-scrollbar mt-8 flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-6">
            {DESTINATIONS.map((dest) => (
              <Link
                key={dest.name}
                href="/listings"
                className="card-shine group relative w-[140px] shrink-0 overflow-hidden rounded-2xl shadow-lg ring-1 ring-stone-900/5 sm:w-auto"
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-110"
                    sizes="140px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-center text-white">
                    <p className="font-bold">{dest.name}</p>
                    <p className="text-[10px] text-stone-300">{dest.stays} stays</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <GuestFavourites listings={LISTINGS} />

      {/* Promo */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-stone-900 shadow-2xl ring-1 ring-stone-900/10">
          <Image
            src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1400&q=80"
            alt="Luxury villa"
            fill
            className="object-cover opacity-60"
            sizes="(max-width:768px) 100vw, 1152px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand/30 to-transparent" />

          <div className="relative flex flex-col gap-6 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12 lg:p-14">
            <div className="max-w-lg">
              <span className="inline-block rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">
                LIMITED TIME
              </span>
              <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
                Villa season is here.
                <span className="text-gradient block text-transparent">
                  Save up to 30%.
                </span>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-stone-300 sm:text-base">
                Private pools, butler service & beach access—exclusive Demand
                Setu member rates on HomeStay & Villa collection.
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {["Private pools", "Chef on request", "Airport pickup"].map(
                  (perk) => (
                    <li
                      key={perk}
                      className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur"
                    >
                      ✓ {perk}
                    </li>
                  )
                )}
              </ul>
            </div>
            <Link
              href="/listings?category=homestay"
              className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-brand to-amber-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-brand/40 transition hover:brightness-110"
            >
              Browse villas
            </Link>
          </div>
        </div>
      </section>

      {/* Trending grid */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="Trending now"
          title="Popular this week"
          subtitle="The stays everyone is booking right now."
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trending.map((listing) => (
            <PropertyCard key={listing.slug} listing={listing} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-border bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Reviews"
            title="Loved by travellers"
            subtitle="Real stories from guests who chose Demand Setu."
            align="center"
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <article
                key={t.name}
                className="relative rounded-3xl border border-border bg-gradient-to-br from-white to-brand-muted/30 p-6 shadow-lg shadow-stone-200/50"
              >
                <div className="flex gap-1 text-amber-500">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-stone-600">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand to-amber-500 text-sm font-bold text-white">
                    {t.avatar}
                  </span>
                  <div>
                    <p className="font-bold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted">{t.location}</p>
                  </div>
                </div>
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-brand">
                  Stayed at {t.stay}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Trust + CTA */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            {
              icon: "🛡️",
              title: "Verified stays",
              desc: "Every property inspected by our hospitality team before listing.",
            },
            {
              icon: "💎",
              title: "Best price promise",
              desc: "Found a lower rate? We'll match it and add 10% orange credit.",
            },
            {
              icon: "📞",
              title: "24/7 orange line",
              desc: "Dedicated concierge from booking to checkout, anywhere in India.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-border bg-white p-6 shadow-md transition hover:border-brand/30 hover:shadow-xl"
            >
              <span className="text-3xl">{item.icon}</span>
              <h3 className="mt-4 text-lg font-extrabold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl bg-gradient-to-r from-brand via-orange-500 to-amber-500 p-8 text-center text-white shadow-2xl shadow-brand/30 sm:p-12">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Ready for your next escape?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-orange-50 sm:text-base">
            Join 50,000+ travellers who book smarter with Demand Setu.
          </p>
          <Link
            href="/listings"
            className="mt-6 inline-flex rounded-full bg-white px-8 py-3.5 text-sm font-bold text-brand-dark shadow-xl transition hover:bg-orange-50"
          >
            Start exploring
          </Link>
        </div>
      </section>
    </>
  );
}
