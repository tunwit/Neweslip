import ClientWrapper from "@/widget/ClientWrapper";
import Providers from "../providers";
import { NextIntlClientProvider } from "next-intl";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  return (
    <NextIntlClientProvider locale={locale}>
      <Providers locale={locale}>
        <div className="flex flex-col min-h-screen">
          <div className="flex flex-row h-full  w-screen">
            <ClientWrapper>{children}</ClientWrapper>
          </div>
        </div>
      </Providers>
    </NextIntlClientProvider>
  );
}
