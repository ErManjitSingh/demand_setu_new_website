import { AMENITY_ICON_MAP } from "@/lib/property";

export default function PropertyAmenities({ groups }) {
  return (
    <section className="mt-10" id="amenities">
      <p className="text-xs font-bold uppercase tracking-widest text-brand">
        Amenities
      </p>
      <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">
        Everything you need for a perfect stay
      </h2>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {groups.map((group) => (
          <div
            key={group.title}
            className="rounded-3xl border border-border/80 bg-white p-5 shadow-sm"
          >
            <h3 className="text-sm font-extrabold text-foreground">{group.title}</h3>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-1">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm font-medium text-stone-700"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-muted text-brand">
                    <AmenityIcon name={AMENITY_ICON_MAP[item] ?? "check"} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function AmenityIcon({ name }) {
  const className = "h-4 w-4";
  switch (name) {
    case "wifi":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M2.34 8.76a9.75 9.75 0 0113.32 0" />
        </svg>
      );
    case "pool":
      return <span className="text-base">🏊</span>;
    case "breakfast":
      return <span className="text-base">🍳</span>;
    case "parking":
      return <span className="text-base">🅿️</span>;
    case "kitchen":
      return <span className="text-base">🍳</span>;
    case "pet":
      return <span className="text-base">🐾</span>;
    case "spa":
      return <span className="text-base">💆</span>;
    default:
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      );
  }
}
