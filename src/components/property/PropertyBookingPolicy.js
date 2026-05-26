import { BOOKING_POLICIES, PROPERTY_POLICIES } from "@/lib/property";

export default function PropertyBookingPolicy() {
  return (
    <section className="mt-10" id="booking-policy">
      <div className="rounded-3xl border border-border/80 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-brand">
          Policies
        </p>
        <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">
          Booking & house rules
        </h2>
        <p className="mt-2 text-sm text-muted">
          Please read before you reserve — transparent terms, no surprises.
        </p>

        {/* Vertical policy list — no grid */}
        <ul className="mt-6 divide-y divide-stone-200">
          {BOOKING_POLICIES.map((policy) => (
            <li key={policy.title} className="flex gap-4 py-5 first:pt-0 last:pb-0">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-muted text-xl">
                {policy.icon}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-extrabold text-foreground">
                  {policy.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{policy.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Quick reference — vertical rows */}
      <div className="mt-4 overflow-hidden rounded-3xl border border-brand/15 bg-gradient-to-b from-brand-muted/40 to-white">
        <div className="border-b border-brand/10 px-5 py-4 sm:px-6">
          <h3 className="text-sm font-extrabold text-brand-dark">Quick reference</h3>
        </div>
        <ul className="divide-y divide-brand/10">
          {PROPERTY_POLICIES.map((p) => (
            <li
              key={p.label}
              className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6"
            >
              <span className="text-xs font-bold uppercase tracking-wide text-brand">
                {p.label}
              </span>
              <span className="text-sm font-semibold text-stone-700 sm:text-right">
                {p.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
