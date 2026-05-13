import { Prompt } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

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
