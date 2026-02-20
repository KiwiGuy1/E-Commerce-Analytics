import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import SideNav from "@/components/SideNav";
import ContentTransition from "@/components/ContentTransition";

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
        className={`${geistSans.variable} ${geistMono.variable} app-shell antialiased`}
      >
        <div className="mx-auto max-w-[1400px] px-4 py-5 md:px-6 md:py-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-start">
            {/* Persistent left nav */}
            <SideNav />
            {/* Main content */}
            <div className="min-w-0 flex-1">
              <ContentTransition>{children}</ContentTransition>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
