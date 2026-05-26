import { formatPrice } from "@/lib/listings";

export default function PropertyMobileBar({ listing, price }) {
  const nightly = price ?? listing.price;

  return (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl lg:hidden"
        style={{ paddingBottom: "max(0.75rem, var(--safe-bottom))" }}
      >
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-lg font-extrabold">{formatPrice(nightly)}</p>
            <p className="truncate text-xs text-muted">
              per night · ★ {listing.rating} ({listing.reviews})
            </p>
          </div>
          <a
            href="#rooms"
            className="shrink-0 rounded-2xl bg-gradient-to-r from-brand to-orange-500 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-brand/30"
          >
            Choose room
          </a>
        </div>
      </div>
      <div className="h-28 lg:hidden" aria-hidden />
    </>
  );
}
