"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getPackageImage } from "@/lib/tourPackages";

export default function PackageEnquiryForm({
  open,
  onClose,
  tourPackage,
  embedded = false,
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    travelDate: "",
    travellers: "2",
  });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!embedded && !open) {
      setVisible(false);
      return undefined;
    }
    if (!tourPackage) return undefined;

    setSubmitted(false);
    setForm({
      name: "",
      phone: "",
      email: "",
      travelDate: tourPackage.defaultTravelDate || "",
      travellers: String(tourPackage.defaultTravellers ?? 2),
    });
    setVisible(true);

    if (embedded) return undefined;

    const frame = window.setTimeout(() => setVisible(true), 16);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(frame);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [embedded, open, onClose, tourPackage]);

  if (!tourPackage) return null;
  if (!embedded && (!mounted || !open)) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const travellers = Number.parseInt(form.travellers, 10) || 2;
    const body = [
      `Tour package enquiry`,
      ``,
      `Package: ${tourPackage.title}`,
      `Duration: ${tourPackage.duration}`,
      `Destination: ${tourPackage.location}`,
      tourPackage.defaultTourType ? `Tour type: ${tourPackage.defaultTourType}` : null,
      ``,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Email: ${form.email}`,
      `Preferred travel date: ${form.travelDate || "Flexible"}`,
      `Adults: ${travellers}`,
    ]
      .filter(Boolean)
      .join("\n");

    const subject = encodeURIComponent(`Tour enquiry — ${tourPackage.title}`);
    const mailBody = encodeURIComponent(body);
    window.location.href = `mailto:info@demandsetutours.com?subject=${subject}&body=${mailBody}`;
    setSubmitted(true);
  };

  const panel = (
    <div
      className={
        embedded
          ? "flex flex-col"
          : `relative flex max-h-[min(92vh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-t-[1.75rem] bg-white shadow-2xl ring-1 ring-stone-900/5 sm:rounded-2xl ${
              visible ? "enquiry-panel-enter" : "translate-y-8 opacity-0"
            }`
      }
    >
      {!embedded && (
        <div className="relative h-28 shrink-0 overflow-hidden sm:h-32">
          <Image
            src={getPackageImage(tourPackage)}
            alt=""
            fill
            className="object-cover"
            sizes="512px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-stone-950/20" />
          <div
            className={`absolute inset-x-0 bottom-0 px-5 pb-4 pr-12 ${
              visible ? "enquiry-header-enter" : "opacity-0"
            }`}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">
              Enquiry
            </p>
            <p className="mt-1 text-lg font-bold text-white">{tourPackage.title}</p>
            <p className="text-xs text-white/70">
              {tourPackage.duration} · {tourPackage.location}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-lg leading-none text-white backdrop-blur hover:bg-black/50"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}

      {embedded && (
        <div className="border-b border-stone-100 bg-gradient-to-r from-brand-muted to-white px-6 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-lg font-extrabold text-stone-900">Complete your enquiry</p>
              <p className="mt-0.5 text-sm text-stone-600">{tourPackage.title}</p>
              <p className="text-xs text-stone-500">
                {tourPackage.duration} · {tourPackage.location}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 text-sm font-bold text-brand hover:underline"
            >
              ← Back
            </button>
          </div>
        </div>
      )}

      <div
        className={`no-scrollbar min-h-0 flex-1 overflow-y-auto ${
          embedded ? "px-6 py-4" : "px-5 py-4"
        }`}
      >
        {submitted ? (
          <div className="enquiry-success-enter py-6 text-center sm:py-8">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
              ✓
            </span>
            <p className="mt-4 text-base font-bold text-foreground">Enquiry ready to send</p>
            <p className="mt-2 text-sm text-muted">
              Your email app should open with the details. Our travel experts will get back to you
              shortly.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-full bg-brand py-3.5 text-sm font-bold text-white transition hover:brightness-105"
            >
              Done
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className={`space-y-2.5 ${visible ? "enquiry-form-stagger" : ""}`}
          >
            <Field label="Full name" required>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={inputClass}
                placeholder="Your name"
              />
            </Field>

            <Field label="Phone" required>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className={inputClass}
                placeholder="+91"
              />
            </Field>

            <Field label="Email" required>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className={inputClass}
                placeholder="you@email.com"
              />
            </Field>

            <Field label="Preferred travel date">
              <input
                type="date"
                value={form.travelDate}
                onChange={(e) => setForm((f) => ({ ...f, travelDate: e.target.value }))}
                className={inputClass}
                min={new Date().toISOString().split("T")[0]}
              />
            </Field>

            <Field label="Number of adults" required>
              <input
                type="number"
                required
                min={1}
                max={50}
                value={form.travellers}
                onChange={(e) => setForm((f) => ({ ...f, travellers: e.target.value }))}
                className={inputClass}
              />
            </Field>

            <button
              type="submit"
              className="w-full rounded-full bg-brand py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:brightness-105"
            >
              Send enquiry
            </button>
          </form>
        )}
      </div>
    </div>
  );

  if (embedded) return panel;

  return createPortal(
    <div
      className="fixed inset-0 z-[600] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Tour package enquiry"
    >
      <button
        type="button"
        className={`absolute inset-0 bg-stone-900/55 backdrop-blur-[2px] ${
          visible ? "enquiry-backdrop-enter" : "opacity-0"
        }`}
        aria-label="Close enquiry form"
        onClick={onClose}
      />
      {panel}
    </div>,
    document.body
  );
}

const inputClass =
  "w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-foreground outline-none ring-brand/30 transition focus:border-brand focus:ring-2";

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-foreground">
        {label}
        {required ? <span className="text-brand"> *</span> : null}
      </span>
      {children}
    </label>
  );
}
