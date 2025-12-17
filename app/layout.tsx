import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import DashboardSidebar from "./components/DashboardSidebar/DashboardSidebar";
import Providers from "./providers";
import { redirect } from "next/navigation";
import Navbar from "./components/Navbar/Navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import SnackBar from "../widget/SnackBar";
import ClientWrapper from "@/widget/ClientWrapper";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";

const propmt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400"],
  variable: "--font-propmt",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang={"th"} className={`${propmt.variable} antialiased`}>
        <body className={`${propmt.className} antialiased flex`}>
          <NextIntlClientProvider locale={"th"}>
            <Providers>
              <Suspense>
                <div className="flex flex-col min-h-screen">
                  <Navbar />

                  <div className="flex flex-row h-full max-h-[calc(100vh-80px)] w-screen overflow-hidden">
                    <ClientWrapper>{children}</ClientWrapper>
                  </div>
                </div>
              </Suspense>
            </Providers>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
