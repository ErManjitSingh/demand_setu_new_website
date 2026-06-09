import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import AppProviders from "@/components/providers/AppProviders";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Demand Setu | Hotels, Airbnb & Villas",
  description:
    "Book curated hotels, Airbnbs, homestays and private villas across India with Demand Setu.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <AppProviders>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Suspense fallback={null}>
            <MobileNav />
          </Suspense>
        </AppProviders>
      </body>
    </html>
  );
}
