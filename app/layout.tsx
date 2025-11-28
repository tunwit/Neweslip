import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
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

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "E Slip",
  description: "Web application to store employee data",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${sarabun.className} antialiased flex`}>
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
        </body>
      </html>
    </ClerkProvider>
  );
}
