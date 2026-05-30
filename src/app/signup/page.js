import Link from "next/link";
import { LogoLink } from "@/components/Logo";
import SignUpForm from "@/components/auth/SignUpForm";

export const metadata = {
  title: "Create account | Demand Setu",
  description: "Create your Demand Setu account to book stays and manage trips.",
};

export default function SignUpPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-brand-muted/40 via-[#faf9f7] to-white px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <LogoLink size="lg" className="mx-auto justify-center" />
          <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-muted">
            Join Demand Setu to book stays, save favourites, and get member prices.
          </p>
        </div>

        <div className="rounded-3xl border border-border/80 bg-white p-6 shadow-xl shadow-stone-200/50 sm:p-8">
          <SignUpForm />
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
