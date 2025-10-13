import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import SideNav from "@/components/SideNav";
import ContentTransition from "@/components/ContentTransition";
import DarkModeToggle from "@/components/DarkModeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-Commerce Analytics Dashboard",
  description: "Interactive analytics dashboard with smooth transitions",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-black dark:via-purple-950 dark:to-black`}
      >
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-6">
          <div className="flex gap-6">
            {/* Persistent left nav */}
            <SideNav />
            {/* Main content and dark mode toggle */}
            <div className="flex-1 relative">
              <div className="absolute top-0 right-0 z-50">
                <DarkModeToggle />
              </div>
              <ContentTransition>{children}</ContentTransition>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
