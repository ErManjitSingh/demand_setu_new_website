"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function PropertyGallery({ title, images }) {
  const gallery = (images?.length ? images : []).slice(0, 3);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!gallery.length) return null;

  const imgs = [
    gallery[0],
    gallery[1] ?? gallery[0],
    gallery[2] ?? gallery[0],
  ];
  const main = imgs[active] ?? imgs[0];

  return (
    <>
      {/* Desktop gallery */}
      <section className="relative hidden bg-stone-100 sm:block">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div className="grid h-[min(52vh,480px)] grid-cols-3 grid-rows-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setActive(0);
                setLightbox(true);
              }}
              className="relative col-span-2 row-span-2 overflow-hidden rounded-2xl bg-stone-200 ring-1 ring-stone-900/5"
            >
              <Image
                src={imgs[0]}
                alt={title}
                fill
                priority
                className="object-cover transition duration-500 hover:scale-[1.03]"
                sizes="(max-width: 1200px) 50vw, 600px"
              />
            </button>
            {[1, 2].map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setActive(idx);
                  setLightbox(true);
                }}
                className="relative min-h-0 overflow-hidden rounded-2xl bg-stone-200 ring-1 ring-stone-900/5"
              >
                <Image
                  src={imgs[idx]}
                  alt={`${title} photo ${idx + 1}`}
                  fill
                  className="object-cover transition hover:scale-105"
                  sizes="25vw"
                />
              </button>
            ))}
          </div>
        </div>

        <Link
          href="/listings"
          className="absolute left-6 top-6 z-10 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-foreground shadow-lg ring-1 ring-stone-200/80 transition hover:bg-stone-50 sm:left-10"
        >
          <BackIcon />
          Back to stays
        </Link>
        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="absolute bottom-6 right-6 z-10 rounded-full bg-white px-4 py-2.5 text-sm font-bold shadow-lg ring-1 ring-stone-200/80 transition hover:bg-stone-50 sm:right-10"
        >
          View photos
        </button>
      </section>

      {/* Mobile gallery */}
      <section className="sm:hidden">
        <div className="relative aspect-[4/3] w-full bg-stone-200">
          <Image
            src={main}
            alt={title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
          <Link
            href="/listings"
            className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-bold shadow-lg"
          >
            <BackIcon className="h-4 w-4" />
            Back
          </Link>
          <button
            type="button"
            onClick={() => setLightbox(true)}
            className="absolute bottom-4 right-4 z-10 rounded-full bg-black/55 px-3 py-1.5 text-xs font-bold text-white backdrop-blur"
          >
            {active + 1} / {gallery.length} · Tap to expand
          </button>
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto bg-white px-4 py-3 shadow-sm">
          {gallery.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-[72px] w-[96px] shrink-0 overflow-hidden rounded-xl ring-2 transition ${
                active === i ? "ring-brand" : "ring-stone-200"
              }`}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="96px" />
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black/95"
          role="dialog"
          aria-modal
        >
          <div className="flex items-center justify-between px-4 py-3">
            <button
              type="button"
              onClick={() => setLightbox(false)}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white"
            >
              Close
            </button>
            <span className="text-sm font-medium text-white/80">
              {active + 1} / {gallery.length}
            </span>
          </div>
          <div className="relative mx-4 min-h-[50vh] flex-1">
            <Image
              src={main}
              alt={title}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-6">
            {gallery.map((src, i) => (
              <button
                key={`lb-${i}`}
                type="button"
                onClick={() => setActive(i)}
                className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg ring-2 ${
                  active === i ? "ring-brand" : "ring-white/30"
                }`}
              >
                <Image src={src} alt="" fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function BackIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  );
}
