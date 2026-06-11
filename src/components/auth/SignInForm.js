"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGuestAuth } from "@/hooks/useGuestAuth";
import { guestLogin, saveGuestSession } from "@/lib/inventoryBookingApi";

export default function SignInForm() {
  const router = useRouter();
  const { isLoggedIn, ready } = useGuestAuth();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && isLoggedIn) {
      router.replace("/my-bookings");
    }
  }, [ready, isLoggedIn, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await guestLogin({
        mobile: mobile.trim(),
        password,
      });
      saveGuestSession(
        {
          ...(response?.data ?? response),
          mobile: mobile.trim(),
        },
        { persist: keepSignedIn }
      );
      router.push("/my-bookings");
    } catch (err) {
      setError(err?.message || "Sign in failed. Please check your mobile and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="mobile" className="block text-sm font-semibold text-foreground">
          Mobile number
        </label>
        <input
          id="mobile"
          type="tel"
          autoComplete="tel"
          required
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="98765 43210"
          className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none ring-brand/20 transition focus:border-brand focus:ring-2"
        />
      </div>

      <div>
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="password" className="block text-sm font-semibold text-foreground">
            Password
          </label>
          <button type="button" className="text-xs font-semibold text-brand hover:underline">
            Forgot password?
          </button>
        </div>
        <div className="relative mt-1.5">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 pr-12 text-sm outline-none ring-brand/20 transition focus:border-brand focus:ring-2"
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

      <label className="flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={keepSignedIn}
          onChange={(e) => setKeepSignedIn(e.target.checked)}
          className="h-4 w-4 rounded border-stone-300 text-brand"
        />
        Keep me signed in
      </label>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-brand to-orange-500 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-brand/30 transition hover:brightness-105 disabled:opacity-70"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
