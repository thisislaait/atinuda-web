import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Nav/HeaderNav";
import SummitFooter from "../components/layout/SummitFooter";
import { Toaster } from "react-hot-toast";
import { FlutterwaveScript } from "@/components/FlutterwaveScript";

// 👇 import your context provider
import { AuthProvider } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";

export const metadata: Metadata = {
  title: {
    default: 'Atinuda — Africa\'s Premier Leadership & Creative Excellence Platform',
    template: '%s | Atinuda',
  },
  description:
    'Atinuda convenes Africa\'s most consequential founders, executives, and cultural architects for transformative summits, the Elevation programme, and Spark the Future.',
  metadataBase: new URL('https://atinuda.com'),
  openGraph: {
    siteName: 'Atinuda',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/assets/images/Retreat/Finale/ATINUDA6_DAY6_46.JPG', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@atinuda_',
  },
  keywords: [
    'Atinuda', 'African leadership', 'African creative summit', 'Elevation Retreat',
    'Spark the Future', 'African entrepreneurs', 'pan-African conference',
    'Oaken Events', 'African diaspora', 'creative economy Africa',
  ],
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* 👇 Now your entire site has access to auth context */}
        <AuthProvider>
          <FlutterwaveScript />
          <Navbar />
          <AuthModal />
          {children}
          <SummitFooter />
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
