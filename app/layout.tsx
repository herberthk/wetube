import type { Metadata } from "next";
import * as dotenv from 'dotenv';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '@progress/kendo-theme-default/dist/all.css';
import { Header } from "@/components/Header";
import NextTopLoader from 'nextjs-toploader';

dotenv.config();
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recommendation system",
  description: "The application for movie recommendation system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased scroller-container`}
      >
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black"
        >
          Skip to main content
        </a>
        <NextTopLoader />
        <Header />
       
          {children}
      </body>
    </html>
  );
}
