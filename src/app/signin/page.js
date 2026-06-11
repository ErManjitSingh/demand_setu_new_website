import Link from "next/link";
import { LogoLink } from "@/components/Logo";
import SignInForm from "@/components/auth/SignInForm";

export const metadata = {
  title: "Sign in | Demand Setu",
  description: "Sign in to book stays and manage your trips on Demand Setu.",
};

export default function SignInPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-brand-muted/40 via-[#faf9f7] to-white px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <LogoLink size="lg" className="mx-auto justify-center" />
          <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted">
            Sign in with your mobile and password to view your bookings.
          </p>
        </div>

        <div className="rounded-3xl border border-border/80 bg-white p-6 shadow-xl shadow-stone-200/50 sm:p-8">
          <SignInForm />
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          <Link href="/" className="font-semibold text-brand hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
