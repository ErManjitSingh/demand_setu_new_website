"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

function getGalleryImage(gallery, index) {
  if (!gallery.length) return "";
  return gallery[Math.min(index, gallery.length - 1)];
}

function ShareButton({ title, className = "" }) {
  const handleShare = useCallback(async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
    } catch {
      /* user cancelled or clipboard blocked */
    }
  }, [title]);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        handleShare();
      }}
      className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#1a1a1a] shadow-md ring-1 ring-black/5 transition hover:bg-white sm:h-9 sm:w-9 ${className}`}
      aria-label="Share property"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
        />
      </svg>
    </button>
  );
}

function BackButton({ className = "" }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        router.back();
      }}
      className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#1a1a1a] shadow-md ring-1 ring-black/5 transition hover:bg-white sm:h-9 sm:w-9 ${className}`}
      aria-label="Go back"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
}

function GalleryTile({
  src,
  alt,
  onClick,
  priority = false,
  sizes,
  className = "",
  overlay = null,
  topRight = null,
}) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`group relative cursor-pointer overflow-hidden bg-[#ececec] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover transition duration-300 group-hover:scale-[1.02]"
        sizes={sizes}
      />
      {overlay}
      {topRight}
    </div>
  );
}

export default function PropertyGallery({ title, images }) {
  const gallery = images?.length ? images : [];
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!gallery.length) return null;

  const openLightbox = (index) => {
    setActive(index);
    setLightbox(true);
  };

  const extraPhotoCount = Math.max(gallery.length - 5, 0);
  const moreLabel =
    extraPhotoCount > 0 ? `+${extraPhotoCount} Property & Guest Photos` : null;

  const gridSlots = [
    { index: 1, share: false },
    { index: 2, share: true },
    { index: 3, share: false },
    { index: 4, share: false, showMore: Boolean(moreLabel) },
  ];

  const moreOverlay = moreLabel ? (
    <span className="absolute inset-0 flex items-center justify-center bg-black/50 px-1.5 text-center text-[9px] font-bold leading-tight text-white backdrop-blur-[1px] sm:px-3 sm:text-sm sm:leading-snug">
      {moreLabel}
    </span>
  ) : null;

  return (
    <>
      <div className="overflow-hidden rounded-xl bg-white sm:rounded-2xl">
        <div className="grid min-h-[168px] grid-cols-2 gap-1.5 sm:min-h-[360px] sm:gap-2 lg:min-h-[420px]">
          <GalleryTile
            src={gallery[0]}
            alt={title}
            onClick={() => openLightbox(0)}
            priority
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 560px"
            className="min-h-[168px] rounded-xl sm:min-h-[280px] sm:rounded-2xl lg:min-h-[420px]"
            overlay={<BackButton className="absolute left-2 top-2 z-10 sm:left-4 sm:top-4" />}
          />

          <div className="grid min-h-[168px] grid-cols-2 grid-rows-2 gap-1.5 sm:min-h-[280px] sm:gap-2 lg:min-h-[420px]">
            {gridSlots.map(({ index, share, showMore }) => (
              <GalleryTile
                key={`grid-${index}`}
                src={getGalleryImage(gallery, index)}
                alt={`${title} photo ${index + 1}`}
                onClick={() => openLightbox(showMore && extraPhotoCount > 0 ? 4 : index)}
                sizes="(max-width: 640px) 25vw, (max-width: 1024px) 25vw, 280px"
                className="min-h-0 rounded-lg sm:rounded-2xl"
                overlay={showMore ? moreOverlay : null}
                topRight={
                  share ? (
                    <ShareButton
                      title={title}
                      className="absolute right-1 top-1 z-10 sm:right-3 sm:top-3"
                    />
                  ) : null
                }
              />
            ))}
          </div>
        </div>
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/95" role="dialog" aria-modal>
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <button
              type="button"
              onClick={() => setLightbox(false)}
              className="rounded-lg px-3 py-1.5 text-sm font-bold hover:bg-white/10"
            >
              Close
            </button>
            <span className="text-sm font-medium">
              {active + 1} / {gallery.length}
            </span>
          </div>
          <div className="relative mx-auto w-full max-w-5xl flex-1 px-4">
            <Image
              src={gallery[active] ?? gallery[0]}
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
                className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md ${
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
