import { Prompt } from "next/font/google";
import { Suspense } from "react";
import ClientWrapper from "@/widget/ClientWrapper";
import { NextIntlClientProvider } from "next-intl";
import Providers from "../providers";
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
            <div className="flex flex-row h-full  w-screen">
              <ClientWrapper>{children}</ClientWrapper>
            </div>
          </div>
        </Suspense>
      </Providers>
    </NextIntlClientProvider>
  );
}
