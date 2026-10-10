import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "বাজার দর — বাংলাদেশের বাজারদর",
  description:
    "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের দাম ও বাজারভিত্তিক মূল্য এক নজরে দেখুন।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" data-theme="light">
      <body>
        <Suspense
          fallback={
            <header className="min-h-24 border-b border-base-300 bg-base-100" />
          }
        >
          <Navbar />
        </Suspense>

        {children}

        <Suspense
          fallback={
            <footer className="min-h-32 border-t border-gray-200 bg-white" />
          }
        >
          <Footer />
        </Suspense>

        <Toaster position="top-right" />
      </body>
    </html>
  );
}