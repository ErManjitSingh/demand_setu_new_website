"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 800);
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="text-lg font-extrabold text-emerald-800">Account created!</p>
        <p className="mt-2 text-sm text-emerald-700">
          Welcome, {name}. You can now sign in and book your stays.
        </p>
        <Link
          href="/signin"
          className="mt-4 inline-flex rounded-2xl bg-gradient-to-r from-brand to-orange-500 px-6 py-3 text-sm font-extrabold text-white"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="Full name" id="name" value={name} onChange={setName} placeholder="Your full name" />
      <Field
        label="Email"
        id="email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@example.com"
      />
      <Field
        label="Mobile number"
        id="mobile"
        type="tel"
        value={mobile}
        onChange={setMobile}
        placeholder="+91 98765 43210"
      />
      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-foreground">
          Password
        </label>
        <div className="relative mt-1.5">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="w-full rounded-xl border border-stone-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-brand to-orange-500 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-brand/30 transition hover:brightness-105 disabled:opacity-70"
      >
        {loading ? "Creating account…" : "Create account"}
      </button>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/signin" className="font-bold text-brand hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

function Field({ label, id, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-foreground">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
    </div>
  );
}
