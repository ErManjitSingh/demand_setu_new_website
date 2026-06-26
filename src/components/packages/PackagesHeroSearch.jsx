"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { getCountrySearchOptions } from "@/lib/tourDestinations";
import { getDefaultBookingDates } from "@/lib/dates";
import PackageLocationCombobox from "@/components/packages/PackageLocationCombobox";

const HERO_SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=85",
    alt: "Himalayan mountains",
  },
  {
    src: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600&q=85",
    alt: "Taj Mahal",
  },
  {
    src: "https://images.pexels.com/photos/37839625/pexels-photo-37839625.jpeg",
    alt: "Ladakh",
  },
  {
    src: "https://images.pexels.com/photos/6904721/pexels-photo-6904721.jpeg",
    alt: "Nepal",
  },
];

const TABS = [
  { id: "country", label: "All Country" },
  { id: "state", label: "States" },
  { id: "city", label: "Cities" },
];

const HERO_PERKS = [
  "All-inclusive tour packages",
  "India & international destinations",
  "Custom itineraries on request",
];

const TOUR_TYPES = [
  { value: "private", label: "Private tour" },
  { value: "group", label: "Group tour" },
  { value: "corporate", label: "Corporate / MICE" },
  { value: "honeymoon", label: "Honeymoon" },
  { value: "family", label: "Family package" },
  { value: "custom", label: "Custom itinerary" },
];

const SLIDE_INTERVAL_MS = 5000;

function toDateInputValue(date) {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
}

function HeroSlideImage({ slide, priority = false, kenBurns = false }) {
  return (
    <Image
      src={slide.src}
      alt=""
      fill
      priority={priority}
      sizes="100vw"
      className={`object-cover ${kenBurns ? "packages-hero-bg-active" : ""}`}
    />
  );
}

function HeroBackground({ activeIndex }) {
  const [baseIndex, setBaseIndex] = useState(0);
  const [overlayIndex, setOverlayIndex] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const prevActiveRef = useRef(activeIndex);

  useEffect(() => {
    HERO_SLIDES.forEach((slide) => {
      const img = new window.Image();
      img.src = slide.src;
    });
  }, []);

  useEffect(() => {
    if (activeIndex === prevActiveRef.current) return;
    setOverlayIndex(activeIndex);
    setOverlayVisible(false);
    prevActiveRef.current = activeIndex;
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setOverlayVisible(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [activeIndex]);

  useEffect(() => {
    if (overlayIndex === null || !overlayVisible) return;
    const timer = window.setTimeout(() => {
      setBaseIndex(overlayIndex);
      setOverlayIndex(null);
      setOverlayVisible(false);
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [overlayIndex, overlayVisible]);

  return (
    <div className="pointer-events-none absolute inset-0 bg-stone-800" aria-hidden>
      <div className="absolute inset-0">
        <HeroSlideImage slide={HERO_SLIDES[baseIndex]} priority kenBurns />
      </div>
      {overlayIndex !== null && (
        <div
          className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
            overlayVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <HeroSlideImage slide={HERO_SLIDES[overlayIndex]} priority />
        </div>
      )}
    </div>
  );
}

export default function PackagesHeroSearch({ states = [], cities = [] }) {
  const defaultDates = useMemo(() => getDefaultBookingDates(), []);
  const [slideIndex, setSlideIndex] = useState(0);
  const [tab, setTab] = useState("country");
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [travelDate, setTravelDate] = useState(toDateInputValue(defaultDates.checkIn));
  const [tourType, setTourType] = useState("private");
  const [adults, setAdults] = useState(2);
  const [error, setError] = useState("");

  const countryOptions = useMemo(() => getCountrySearchOptions(), []);

  const locationOptions = useMemo(() => {
    if (tab === "country") return countryOptions;
    if (tab === "state") return states;
    return cities;
  }, [tab, states, cities, countryOptions]);

  const selectedValue =
    tab === "country" ? country : tab === "state" ? state : city;

  const locationPlaceholder =
    tab === "country"
      ? "Search country…"
      : tab === "state"
        ? "Search state…"
        : "Search city…";

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, []);

  const onTabChange = (nextTab) => {
    setTab(nextTab);
    setState("");
    setCity("");
    setError("");
    if (nextTab === "country") setCountry("India");
  };

  const onLocationChange = (value) => {
    if (tab === "country") setCountry(value);
    else if (tab === "state") setState(value);
    else setCity(value);
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const location =
      tab === "country" ? country : tab === "state" ? state : city;

    if (!location?.trim()) {
      setError(`Please select a ${tab === "country" ? "country" : tab}`);
      return;
    }
    if (!travelDate) {
      setError("Please select a travel date");
      return;
    }
    if (!tourType) {
      setError("Please select a tour type");
      return;
    }

    const tourTypeLabel =
      TOUR_TYPES.find((t) => t.value === tourType)?.label ?? tourType;

    setError("");
    const payload = {
      destinationType: tab,
      country: tab === "country" ? location : "India",
      state: tab === "state" ? location : "",
      city: tab === "city" ? location : "",
      location,
      travelDate,
      tourType: tourTypeLabel,
      adults,
    };
    console.log("Hero tour enquiry:", payload);
  };

  return (
    <section className="relative min-h-[min(100vh,880px)] overflow-hidden">
      <HeroBackground activeIndex={slideIndex} />

      <div className="relative z-10 mx-auto flex min-h-[min(100vh,880px)] max-w-6xl flex-col justify-center px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* Left — content */}
          <div className="animate-hero-enter">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
              Tour packages
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-5xl lg:text-[3.25rem]">
              Every Country. Every State.
              <span className="mt-1 block">Every City.</span>
            </h1>

            <p className="mt-4 font-serif text-3xl italic text-orange-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] sm:text-4xl">
              One Journey.
            </p>

          

            <ul className="mt-8 space-y-3">
              {HERO_PERKS.map((perk) => (
                <li key={perk} className="flex items-center gap-3 text-sm font-medium text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs text-white shadow-md">
                    ✓
                  </span>
                  {perk}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex items-center gap-2">
              {HERO_SLIDES.map((slide, i) => (
                <button
                  key={slide.src}
                  type="button"
                  onClick={() => setSlideIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === slideIndex ? "w-8 bg-brand" : "w-2 bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`Show slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right — enquiry form */}
          <div className="animate-hero-enter-delay-2 w-full lg:justify-self-end">
            <div className="overflow-hidden rounded-2xl border border-white/20 bg-white shadow-[0_32px_80px_-20px_rgba(0,0,0,0.45)] ring-1 ring-stone-900/5">
              <div className="border-b border-stone-100 bg-gradient-to-r from-brand-muted to-white px-5 py-4">
                <p className="text-lg font-extrabold text-stone-900">Plan your trip</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 p-5">
                <div>
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-stone-500">
                    Destination type
                  </span>
                  <div className="grid grid-cols-3 gap-1 rounded-xl border border-stone-200 bg-stone-50 p-1">
                    {TABS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onTabChange(item.id)}
                        className={`rounded-lg px-2 py-2.5 text-xs font-bold transition sm:text-sm ${
                          tab === item.id
                            ? "bg-brand text-white shadow-sm"
                            : "text-stone-600 hover:bg-white hover:text-stone-900"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <FormField label="Where to?">
                  <PackageLocationCombobox
                    key={tab}
                    options={locationOptions}
                    value={selectedValue}
                    onChange={onLocationChange}
                    placeholder={locationPlaceholder}
                    highlightFirst={tab === "country" ? "India" : null}
                    emptyMessage={
                      tab === "country"
                        ? "No matching country"
                        : tab === "state"
                          ? "No matching state"
                          : "No matching city"
                    }
                  />
                </FormField>

                <div className="grid gap-3 sm:grid-cols-2">
                  <FormField label="Travel date">
                    <input
                      type="date"
                      required
                      value={travelDate}
                      min={toDateInputValue(new Date())}
                      onChange={(e) => {
                        setTravelDate(e.target.value);
                        if (error) setError("");
                      }}
                      className={inputClass}
                    />
                  </FormField>

                  <FormField label="Tour type">
                    <select
                      required
                      value={tourType}
                      onChange={(e) => {
                        setTourType(e.target.value);
                        if (error) setError("");
                      }}
                      className={inputClass}
                    >
                      {TOUR_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </FormField>
                </div>

                <FormField label="Number of adults">
                  <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-3 py-2">
                    <button
                      type="button"
                      onClick={() => setAdults((n) => Math.max(1, n - 1))}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 bg-white text-lg font-bold text-stone-600 transition hover:border-brand hover:text-brand"
                      aria-label="Decrease adults"
                    >
                      −
                    </button>
                    <span className="text-base font-bold text-stone-900">
                      {adults} Adult{adults !== 1 ? "s" : ""}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAdults((n) => Math.min(50, n + 1))}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 bg-white text-lg font-bold text-stone-600 transition hover:border-brand hover:text-brand"
                      aria-label="Increase adults"
                    >
                      +
                    </button>
                  </div>
                </FormField>

                {error && (
                  <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-600">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-brand py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-brand/30 transition hover:brightness-105"
                >
                  Submit enquiry
                </button>

                <p className="text-center text-[11px] text-stone-400">
                  Free quote · No obligation · Response within a few hours
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const inputClass =
  "w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm font-medium text-stone-900 outline-none ring-brand/30 transition focus:border-brand focus:ring-2";

function FormField({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-sm font-bold text-stone-800">{label}</span>
      {children}
    </label>
  );
}
