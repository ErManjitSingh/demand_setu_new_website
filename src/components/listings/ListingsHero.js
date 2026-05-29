import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import ListingsHeroSearch from "@/components/listings/ListingsHeroSearch";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["italic"],
});

const TRUST_ITEMS = [
  { icon: "tag", label: "Best Price Guarantee" },
  { icon: "home", label: "Handpicked Properties" },
  { icon: "headset", label: "24/7 Customer Support" },
  { icon: "calendar", label: "Free Cancellation" },
];

export default function ListingsHero({ category, cover, description }) {
  return (
    <section className="relative z-30 bg-stone-950">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={cover}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/75 via-stone-950/55 to-stone-950/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/40 to-stone-950/20" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-10 sm:px-6 sm:pb-16 sm:pt-14">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-[3.25rem] lg:leading-[1.15]">
            Extraordinary stays,{" "}
            <span className={`${playfair.className} text-brand`}>
              crafted for you.
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base text-stone-300 sm:text-lg">
            {description ||
              "Hotels, villas & unique stays for unforgettable memories."}
          </p>

          <div className="relative z-20 mx-auto mt-8 max-w-4xl overflow-visible sm:mt-10">
            <ListingsHeroSearch category={category} />
          </div>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-8">
            {TRUST_ITEMS.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2 text-xs font-medium text-white/90 sm:text-sm"
              >
                <TrustIcon type={item.icon} />
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function TrustIcon({ type }) {
  const className = "h-4 w-4 text-orange-300 sm:h-[18px] sm:w-[18px]";
  switch (type) {
    case "tag":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
      );
    case "home":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      );
    case "headset":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 0v3.75m-9 0V21m-1.5 0H4.875c-.621 0-1.125-.504-1.125-1.125v-9.75c0-.621.504-1.125 1.125-1.125h3.375c.621 0 1.125.504 1.125 1.125v3.75M19.125 12H21.75c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-3.375c-.621 0-1.125-.504-1.125-1.125v-3.75" />
        </svg>
      );
    default:
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5a2.25 2.25 0 012.25 2.25V18.75M3 18.75h18" />
        </svg>
      );
  }
}
