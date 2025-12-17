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
  title: "Uç Fikir | Dijital Menü",
  description: "Modern dijital restoran menüsü platformu",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  themeColor: '#e94560',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Uç Fikir Menü',
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

