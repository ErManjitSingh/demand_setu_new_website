"use client";

import Image from "next/image";
import { useState } from "react";

export default function PropertyGallery({ title, images }) {
  const gallery = images?.length ? images : [];
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!gallery.length) return null;

  const main = gallery[active] ?? gallery[0];
  const thumb1 = gallery[1] ?? gallery[0];
  const thumb2 = gallery[2] ?? gallery[0];
  const extraCount = Math.max(gallery.length - 3, 0);

  return (
    <>
      <div className="overflow-hidden rounded-sm border border-[#e0e0e0] bg-white">
        <p className="border-b border-border px-4 py-2 text-xs font-bold text-brand">
          +{gallery.length} property photos
        </p>

        {/* Desktop — MMT style: large left + 2 thumbs right */}
        <div className="hidden gap-0.5 sm:grid sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] sm:grid-rows-2">
          <button
            type="button"
            onClick={() => {
              setActive(0);
              setLightbox(true);
            }}
            className="relative row-span-2 min-h-[280px] bg-[#efefef] sm:min-h-[340px]"
          >
            <Image
              src={gallery[0]}
              alt={title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 60vw, 640px"
            />
          </button>
          <button
            type="button"
            onClick={() => {
              setActive(1);
              setLightbox(true);
            }}
            className="relative min-h-[140px] bg-[#efefef] sm:min-h-[168px]"
          >
            <Image src={thumb1} alt={`${title} room`} fill className="object-cover" sizes="30vw" />
            <span className="absolute bottom-2 left-2 rounded bg-black/65 px-2 py-0.5 text-[10px] font-bold text-white">
              Room photos
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActive(2);
              setLightbox(true);
            }}
            className="relative min-h-[140px] bg-[#efefef] sm:min-h-[168px]"
          >
            <Image src={thumb2} alt={`${title} view`} fill className="object-cover" sizes="30vw" />
            {extraCount > 0 && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-sm font-bold text-white">
                +{extraCount} more
              </span>
            )}
          </button>
        </div>

        {/* Mobile */}
        <div className="relative aspect-[16/10] sm:hidden">
          <Image src={main} alt={title} fill priority className="object-cover" sizes="100vw" />
          <button
            type="button"
            onClick={() => setLightbox(true)}
            className="absolute bottom-3 right-3 rounded bg-black/70 px-3 py-1.5 text-xs font-bold text-white"
          >
            +{gallery.length} Photos
          </button>
        </div>
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/95" role="dialog" aria-modal>
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <button
              type="button"
              onClick={() => setLightbox(false)}
              className="rounded px-3 py-1.5 text-sm font-bold hover:bg-white/10"
            >
              Close
            </button>
            <span className="text-sm">
              {active + 1} / {gallery.length}
            </span>
          </div>
          <div className="relative mx-auto w-full max-w-5xl flex-1 px-4">
            <Image src={main} alt={title} fill className="object-contain" sizes="100vw" />
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-6">
            {gallery.map((src, i) => (
              <button
                key={`lb-${i}`}
                type="button"
                onClick={() => setActive(i)}
                className={`relative h-14 w-20 shrink-0 overflow-hidden ${
                  active === i ? "ring-2 ring-brand" : "opacity-70"
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
