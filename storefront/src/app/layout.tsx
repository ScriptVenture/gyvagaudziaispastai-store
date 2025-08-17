import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import "../styles/colors.css";
import "../styles/modern-animations.css";
import { Theme } from "@radix-ui/themes";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Providers } from "@/components/providers/Providers";
import CookieConsent from "@/components/ui/CookieConsent";
import PrivacyBanner from "@/components/ui/PrivacyBanner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap", // Improves loading performance
  preload: true,   // Preloads for better performance
});

export const metadata: Metadata = {
  title: "Gyvagaudziaispastai Store - Live Animal Traps",
  description: "Professional live animal traps for humane wildlife capture. Safe, effective traps for raccoons, squirrels, cats, rabbits and more. Trusted since 1940.",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased min-h-screen flex flex-col`}
      >
        <Theme accentColor="green" grayColor="gray" radius="large" scaling="110%" appearance="light">
          <Providers>
            <PrivacyBanner />
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <CookieConsent />
          </Providers>
        </Theme>
      </body>
    </html>
  );
}
