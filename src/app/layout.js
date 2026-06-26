import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import AppProviders from "@/components/providers/AppProviders";
import NavigationProgress from "@/components/NavigationProgress";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Demand Setu Tours | Tour Packages Across India & The World",
  description:
    "Tour packages across India and the world — explore states, cities and famous itineraries with Demand Setu.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <AppProviders>
          <NavigationProgress />
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
