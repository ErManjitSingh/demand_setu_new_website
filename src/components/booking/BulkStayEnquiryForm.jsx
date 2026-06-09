"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
function formatGuestSummary({ adults, children, rooms }) {
  const parts = [`${adults} Adult${adults !== 1 ? "s" : ""}`];
  if (children > 0) parts.push(`${children} Child${children !== 1 ? "ren" : ""}`);
  parts.push(`${rooms} Room${rooms !== 1 ? "s" : ""}`);
  return parts.join(" · ");
}

export default function BulkStayEnquiryForm({
  open,
  onClose,
  guests,
  requestedRooms = 10,
  defaultLocation = "",
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    location: defaultLocation,
    rooms: String(requestedRooms),
  });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) {
      setVisible(false);
      return undefined;
    }
    setSubmitted(false);
    setForm((prev) => ({
      ...prev,
      rooms: String(requestedRooms),
      location: defaultLocation || prev.location,
    }));
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
  }, [open, requestedRooms, defaultLocation, onClose]);

  if (!mounted || !open) return null;

  const guestSummary = formatGuestSummary({
    adults: guests?.adults ?? 2,
    children: guests?.children ?? 0,
    rooms: Number.parseInt(form.rooms, 10) || requestedRooms,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const rooms = Number.parseInt(form.rooms, 10) || requestedRooms;
    const body = [
      `Bulk stay enquiry`,
      ``,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Email: ${form.email}`,
      `Location: ${form.location}`,
      `Rooms: ${rooms}`,
      `Guests: ${guestSummary}`,
    ].join("\n");

    const subject = encodeURIComponent(`Bulk stay enquiry — ${rooms} rooms`);
    const mailBody = encodeURIComponent(body);
    window.location.href = `mailto:info@demandsetutours.com?subject=${subject}&body=${mailBody}`;
    setSubmitted(true);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[600] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Bulk stay enquiry"
    >
      <button
        type="button"
        className={`absolute inset-0 bg-stone-900/55 backdrop-blur-[2px] ${
          visible ? "enquiry-backdrop-enter" : "opacity-0"
        }`}
        aria-label="Close enquiry form"
        onClick={onClose}
      />
      <div
        className={`relative flex max-h-[min(92vh,720px)] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl ring-1 ring-stone-900/5 sm:rounded-2xl ${
          visible ? "enquiry-panel-enter" : "translate-y-8 opacity-0"
        }`}
      >
        <div
          className={`shrink-0 border-b border-stone-100 px-5 py-4 pr-12 ${
            visible ? "enquiry-header-enter" : "opacity-0"
          }`}
        >
          <p className="text-lg font-bold text-foreground">Group stay enquiry</p>
          <p className="mt-1 text-xs text-muted">
            For {requestedRooms}+ rooms, our team will share the best group rates.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 text-xl leading-none text-stone-400 hover:text-stone-600"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {submitted ? (
            <div className="enquiry-success-enter py-8 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
                ✓
              </span>
              <p className="mt-4 text-base font-bold text-foreground">Enquiry ready to send</p>
              <p className="mt-2 text-sm text-muted">
                Your email app should open with the details. Our team will get back to you shortly.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 w-full rounded-xl bg-brand py-3 text-sm font-bold text-white"
              >
                Done
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className={`space-y-4 ${visible ? "enquiry-form-stagger" : ""}`}
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

              <Field label="Location" required>
                <input
                  type="text"
                  required
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  className={inputClass}
                  placeholder="City or state"
                  autoComplete="address-level2"
                />
              </Field>

              <Field label="Rooms required" required>
                <input
                  type="number"
                  required
                  min={10}
                  value={form.rooms}
                  onChange={(e) => setForm((f) => ({ ...f, rooms: e.target.value }))}
                  className={inputClass}
                />
              </Field>

              <button
                type="submit"
                className="w-full rounded-xl bg-brand py-3 text-sm font-bold uppercase tracking-wide text-white shadow-sm hover:opacity-95"
              >
                Send enquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

const inputClass =
  "w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm font-medium text-foreground outline-none ring-brand/30 transition focus:border-brand focus:ring-2";

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-foreground">
        {label}
        {required ? <span className="text-brand"> *</span> : null}
      </span>
      {children}
    </label>
  );
}
