import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Evenly",
  description: "Created by Deepanshu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <ClerkProvider>
      <body className={`${inter.className} antialiased`}>

        <ConvexClientProvider>
          {<Header />}
          <main className="min-h-screen">{children}</main>
        </ConvexClientProvider>
      </body>
      </ClerkProvider>
    </html>
  );
}
