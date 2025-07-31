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
  title: "Gyvagaudziaispastai Store - Wildlife Control Solutions",
  description: "Professional wildlife control products and solutions for managing nuisance animals effectively and humanely.",
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
