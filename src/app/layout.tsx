import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/lib/redux/StoreProvider";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans", // We name this variable generically
  display: "swap",
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
      <body className={`${inter.variable} font-sans antialiased`} >
        <StoreProvider>
          <div className="min-h-screen flex flex-col bg-gray-50/50">
            <main className="flex-1">
              {children}
            </main>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}