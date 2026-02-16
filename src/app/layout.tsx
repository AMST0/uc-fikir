import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PhaseProvider } from "@/context/PhaseContext";
import { DemoControls, Toast, Cart, ReviewFunnel } from "@/components";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "piiyuu | Dijital Menü",
  description: "piiyuu dijital restoran menüsü platformu",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  themeColor: '#f47622',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'piiyuu Menü',
  },
  formatDetection: {
    telephone: true,
    email: false,
    address: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} font-sans antialiased`}>
        <PhaseProvider>
          {children}
          <DemoControls />
          <Toast />
          <Cart />
          <ReviewFunnel />
        </PhaseProvider>
      </body>
    </html>
  );
}

