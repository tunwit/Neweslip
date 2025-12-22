import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import { redirect } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import ClientWrapper from "@/widget/ClientWrapper";
import { ClerkProvider } from "@clerk/nextjs";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import Providers from "../providers";
import Navbar from "../components/Navbar/Navbar";

const propmt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400"],
  variable: "--font-propmt",
});

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const locale = (await params).locale;
  return (
    <NextIntlClientProvider locale={locale}>
      <Providers>
        <Suspense>
          <div className="flex flex-col min-h-screen">
            <div className="flex flex-row h-full  w-screen overflow-hidden">
              <ClientWrapper>{children}</ClientWrapper>
            </div>
          </div>
        </Suspense>
      </Providers>
    </NextIntlClientProvider>
  );
}
