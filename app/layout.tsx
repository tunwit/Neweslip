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
    <ClerkProvider signInUrl="/th/sign-in">
      <html className={`${propmt.variable} antialiased`}>
        <body className={`${propmt.className} antialiased flex`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
