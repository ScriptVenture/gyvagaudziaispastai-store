import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import "../styles/colors.css";
import { Theme } from "@radix-ui/themes";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Theme accentColor="green" grayColor="gray" radius="large" scaling="100%" appearance="light">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Theme>
      </body>
    </html>
  );
}
