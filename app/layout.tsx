import { Prompt } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400"],
  variable: "--font-prompt",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider signInUrl="/th/sign-in">
      <html className={`${prompt.variable} antialiased`}>
        <body className={`${prompt.className} antialiased flex`}>
          <Suspense>{children}</Suspense>
        </body>
      </html>
    </ClerkProvider>
  );
}
