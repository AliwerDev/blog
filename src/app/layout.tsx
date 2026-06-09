import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "alisher.blog",
    template: "%s | alisher.blog",
  },
  description: "Dasturlash, zamonaviy texnologiyalar va dizayn haqidagi shaxsiy blog",
  keywords: [
    "dasturlash",
    "next.js",
    "react",
    "web development",
    "frontend",
    "uzbek coding",
    "alisher blog",
  ],
  authors: [{ name: "Alisher" }],
  creator: "Alisher",
  openGraph: {
    title: "alisher.blog",
    description: "Dasturlash, zamonaviy texnologiyalar va dizayn haqidagi shaxsiy blog",
    url: "https://alisher.blog",
    siteName: "alisher.blog",
    locale: "uz_UZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "alisher.blog",
    description: "Dasturlash, zamonaviy texnologiyalar va dizayn haqidagi shaxsiy blog",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uz"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head />
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
