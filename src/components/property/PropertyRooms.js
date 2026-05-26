"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/listings";
import { getRoomCategories } from "@/lib/property";

export default function PropertyRooms({ rooms }) {
  const categories = useMemo(() => getRoomCategories(rooms), [rooms]);
  const [activeCat, setActiveCat] = useState("All");
  const [mealByRoom, setMealByRoom] = useState(() =>
    Object.fromEntries(rooms.map((r) => [r.id, r.mealPlans?.[1]?.code ?? "CP"]))
  );

  const filtered =
    activeCat === "All"
      ? rooms
      : rooms.filter((r) => r.category === activeCat);

  return (
    <section className="mt-10" id="rooms">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-brand">
          Room categories
        </p>
        <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">
          Pick your room & meal plan
        </h2>
      </div>

      <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCat(cat)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
              activeCat === cat
                ? "bg-gradient-to-r from-brand to-orange-500 text-white shadow-md shadow-brand/25"
                : "border border-border bg-white text-muted hover:border-brand"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-5 sm:space-y-6">
        {filtered.map((room) => {
          const selectedCode = mealByRoom[room.id] ?? "CP";
          const selectedPlan = room.mealPlans?.find((p) => p.code === selectedCode);
          const displayPrice = selectedPlan?.total ?? room.price;

          return (
            <article
              key={room.id}
              className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-stone-900/[0.06] sm:rounded-3xl"
            >
              {/* Always: images left, details right */}
              <div className="flex flex-row items-stretch">
                {/* Left — images */}
                <div className="flex w-[38%] min-w-[118px] max-w-[150px] shrink-0 flex-col self-stretch sm:w-[200px] sm:max-w-none md:w-[280px] lg:w-[320px]">
                  <div className="relative min-h-[140px] flex-1 bg-stone-200 sm:min-h-[200px] md:min-h-[240px]">
                    <Image
                      src={room.image}
                      alt={room.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 40vw, 320px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-1.5 left-1.5 right-1.5 flex flex-col gap-1 sm:bottom-2 sm:left-2">
                      <span className="w-fit rounded-md bg-white/95 px-1.5 py-0.5 text-[8px] font-bold text-foreground shadow sm:rounded-full sm:px-2.5 sm:py-1 sm:text-[10px]">
                        {room.category}
                      </span>
                      {room.badge && (
                        <span className="hidden w-fit rounded-md bg-brand px-1.5 py-0.5 text-[8px] font-bold text-white sm:inline sm:rounded-full sm:px-2.5 sm:py-1 sm:text-[10px]">
                          {room.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  {room.gallery?.length > 1 && (
                    <div className="grid grid-cols-3 gap-0.5 border-t border-stone-100 bg-stone-50 p-0.5 sm:gap-1 sm:p-1">
                      {room.gallery.slice(0, 3).map((src) => (
                        <div
                          key={src}
                          className="relative aspect-square overflow-hidden rounded-sm bg-stone-200 sm:rounded-md"
                        >
                          <Image
                            src={src}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right — details */}
                <div className="flex min-w-0 flex-1 flex-col p-2.5 sm:p-4 md:p-5 lg:p-6">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="line-clamp-2 text-[13px] font-extrabold leading-tight sm:text-lg md:text-xl">
                      {room.name}
                    </h3>
                    <span className="shrink-0 rounded-full bg-orange-50 px-1.5 py-0.5 text-[8px] font-bold text-brand-dark ring-1 ring-brand/20 sm:px-2.5 sm:py-1 sm:text-[10px]">
                      {room.available}
                    </span>
                  </div>

                  <div className="mt-1.5 flex flex-wrap gap-1 sm:mt-2 sm:gap-1.5">
                    {[room.size, `${room.guests} guests`].map((spec) => (
                      <span
                        key={spec}
                        className="rounded bg-stone-100 px-1.5 py-0.5 text-[9px] font-semibold text-stone-600 sm:rounded-md sm:px-2.5 sm:py-1 sm:text-[11px]"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="mt-1 hidden flex-wrap gap-1 sm:flex">
                    {room.amenities.slice(0, 4).map((a) => (
                      <span
                        key={a}
                        className="rounded-full border border-brand/15 bg-brand-muted/50 px-2 py-0.5 text-[10px] font-semibold text-brand-dark"
                      >
                        {a}
                      </span>
                    ))}
                  </div>

                  <div className="mt-2 flex-1 sm:mt-3">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-brand sm:text-[10px]">
                      Meal plan
                    </p>
                    <div className="mt-1 space-y-1 sm:mt-1.5 sm:space-y-1.5">
                      {room.mealPlans?.map((plan) => {
                        const selected = selectedCode === plan.code;
                        return (
                          <button
                            key={plan.code}
                            type="button"
                            onClick={() =>
                              setMealByRoom((prev) => ({ ...prev, [room.id]: plan.code }))
                            }
                            className={`flex w-full items-center gap-1.5 rounded-lg border-2 px-2 py-1.5 text-left transition sm:gap-2 sm:rounded-xl sm:px-3 sm:py-2.5 ${
                              selected
                                ? "border-brand bg-brand-muted/60"
                                : "border-stone-200 active:bg-stone-50"
                            }`}
                          >
                            <span
                              className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2 sm:h-4 sm:w-4 ${
                                selected ? "border-brand bg-brand" : "border-stone-300"
                              }`}
                            >
                              {selected && (
                                <span className="h-1 w-1 rounded-full bg-white sm:h-1.5 sm:w-1.5" />
                              )}
                            </span>
                            <span
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[9px] font-extrabold sm:h-8 sm:w-8 sm:rounded-lg sm:text-[10px] ${
                                selected ? "bg-brand text-white" : "bg-stone-100 text-stone-600"
                              }`}
                            >
                              {plan.short}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] font-bold leading-tight sm:text-xs md:text-sm">
                                {plan.name}
                              </p>
                              <p className="hidden text-[10px] text-muted sm:block sm:text-xs">
                                {plan.desc}
                              </p>
                            </div>
                            <p className="shrink-0 text-[10px] font-extrabold text-brand sm:text-sm">
                              {formatPrice(plan.total)}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-2 rounded-xl bg-stone-900 p-2.5 text-white sm:mt-3 sm:rounded-2xl sm:p-4">
                    <p className="text-[9px] text-stone-400 sm:text-[10px]">
                      {selectedPlan?.short} · {room.available} left
                    </p>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <p className="text-base font-extrabold sm:text-xl md:text-2xl">
                        {formatPrice(displayPrice)}
                        <span className="text-[10px] font-medium text-stone-400 sm:text-sm">
                          {" "}
                          /nt
                        </span>
                      </p>
                      <button
                        type="button"
                        className="shrink-0 rounded-lg bg-gradient-to-r from-brand to-orange-500 px-3 py-2 text-[10px] font-extrabold text-white shadow-md sm:rounded-xl sm:px-5 sm:py-2.5 sm:text-sm"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
