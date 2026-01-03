import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/lib/redux/StoreProvider";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GamerKeys - Digital Marketplace",
  description: "Buy software, games, and gift cards instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          {/* Global Layout Wrapper:
            1. min-h-screen: Ensures the page is at least as tall as the screen.
            2. flex-col: Stacks Nav, Main Content, and Footer vertically.
            3. bg-gray-50/50: Sets the consistent background color for the whole app.
          */}
          <div className="min-h-screen flex flex-col bg-gray-50/50">

            <NavBar />

            {/* 'flex-1' pushes the Footer to the bottom if content is short */}
            <main className="flex-1">
              {children}
            </main>

            <Footer />

          </div>
        </StoreProvider>
      </body>
    </html>
  );
}